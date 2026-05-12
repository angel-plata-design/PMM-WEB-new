"""PMM unified authentication: email/password (JWT) + Emergent Google OAuth.

Both methods set the same httpOnly session cookie (`session_token`) backed by
the `user_sessions` collection so the same `get_current_user` dependency works
for both.
"""
from __future__ import annotations
import os
import uuid
import secrets
import bcrypt
import httpx
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Request, Response, Header, Depends
from pydantic import BaseModel, EmailStr, ConfigDict

SESSION_COOKIE = "session_token"
SESSION_TTL_DAYS = 7

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ============== MODELS ==============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    role: str = "customer"
    picture: Optional[str] = None
    rfc: Optional[str] = None
    has_password: bool = False
    has_google: bool = False
    created_at: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleSessionRequest(BaseModel):
    session_id: str


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    rfc: Optional[str] = None


# ============== HELPERS ==============

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _generate_session_token() -> str:
    return secrets.token_urlsafe(48)


def _user_doc_to_model(doc: dict) -> User:
    return User(
        user_id=doc["user_id"],
        email=doc["email"],
        name=doc.get("name", ""),
        role=doc.get("role", "customer"),
        picture=doc.get("picture"),
        rfc=doc.get("rfc"),
        has_password=bool(doc.get("password_hash")),
        has_google=bool(doc.get("google_sub") or doc.get("google_id")),
        created_at=(
            doc["created_at"].isoformat()
            if isinstance(doc.get("created_at"), datetime)
            else doc.get("created_at", "")
        ),
    )


def _is_secure_request(request: Request) -> bool:
    proto = request.headers.get("x-forwarded-proto", "")
    return proto == "https" or request.url.scheme == "https"


def _set_session_cookie(response: Response, token: str, request: Request):
    secure = _is_secure_request(request)
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        secure=secure,
        samesite="none" if secure else "lax",
        max_age=SESSION_TTL_DAYS * 24 * 3600,
        path="/",
    )


def _clear_session_cookie(response: Response):
    response.delete_cookie(SESSION_COOKIE, path="/")


# Late-bound DB reference (set from server.py via init_auth)
_db = None


def init_auth(db):
    """Inject the Motor db instance and create indexes."""
    global _db
    _db = db


async def ensure_indexes():
    if _db is None:
        return
    await _db.users.create_index("email", unique=True)
    await _db.users.create_index("user_id", unique=True)
    await _db.user_sessions.create_index("session_token", unique=True)
    await _db.user_sessions.create_index("expires_at", expireAfterSeconds=0)


async def _create_session(user_id: str) -> str:
    token = _generate_session_token()
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)
    await _db.user_sessions.insert_one({
        "session_token": token,
        "user_id": user_id,
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc),
    })
    return token


async def get_current_user(request: Request) -> User:
    if _db is None:
        raise HTTPException(status_code=500, detail="Auth no inicializado")
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    session = await _db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Sesión inválida")
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Sesión expirada")
    user = await _db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return _user_doc_to_model(user)


async def get_current_user_optional(request: Request) -> Optional[User]:
    try:
        return await get_current_user(request)
    except HTTPException:
        return None


# ============== ROUTES ==============

@router.post("/register")
async def register(payload: RegisterRequest, response: Response, request: Request):
    email = payload.email.lower().strip()
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres")
    existing = await _db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="Ya existe una cuenta con este email")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    doc = {
        "user_id": user_id,
        "email": email,
        "name": payload.name.strip()[:120],
        "password_hash": hash_password(payload.password),
        "role": "customer",
        "created_at": now,
    }
    await _db.users.insert_one(doc)
    token = await _create_session(user_id)
    _set_session_cookie(response, token, request)
    return {"user": _user_doc_to_model(doc), "session_token": token}


@router.post("/login")
async def login(payload: LoginRequest, response: Response, request: Request):
    email = payload.email.lower().strip()
    user = await _db.users.find_one({"email": email})
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = await _create_session(user["user_id"])
    _set_session_cookie(response, token, request)
    return {"user": _user_doc_to_model(user), "session_token": token}


@router.post("/google/session")
async def google_session(payload: GoogleSessionRequest, response: Response, request: Request):
    base = os.environ.get("EMERGENT_AUTH_BASE", "https://demobackend.emergentagent.com")
    url = f"{base}/auth/v1/env/oauth/session-data"
    async with httpx.AsyncClient(timeout=15) as c:
        try:
            r = await c.get(url, headers={"X-Session-ID": payload.session_id})
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Error al validar sesión: {e}")
        if r.status_code != 200:
            raise HTTPException(status_code=401, detail="Sesión de Google inválida o expirada")
        info = r.json()
    google_id = info.get("id")
    email = (info.get("email") or "").lower().strip()
    if not email or not google_id:
        raise HTTPException(status_code=400, detail="Respuesta de Google incompleta")
    name = info.get("name") or email.split("@")[0]
    picture = info.get("picture")
    now = datetime.now(timezone.utc)
    user = await _db.users.find_one({"email": email})
    if user:
        updates = {"google_sub": google_id}
        if picture and not user.get("picture"):
            updates["picture"] = picture
        if name and not user.get("name"):
            updates["name"] = name
        await _db.users.update_one({"user_id": user["user_id"]}, {"$set": updates})
        user = await _db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id, "email": email, "name": name,
            "google_sub": google_id, "picture": picture,
            "role": "customer", "created_at": now,
        }
        await _db.users.insert_one(dict(user))
    token = info.get("session_token") or _generate_session_token()
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)
    await _db.user_sessions.update_one(
        {"session_token": token},
        {"$set": {"session_token": token, "user_id": user["user_id"], "expires_at": expires_at, "created_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    _set_session_cookie(response, token, request)
    return {"user": _user_doc_to_model(user), "session_token": token}


@router.get("/me", response_model=User)
async def me(user: User = Depends(get_current_user)):
    return user


@router.post("/logout")
async def logout(request: Request, response: Response):
    # Resolve token from cookie OR Authorization Bearer header
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if token and _db is not None:
        await _db.user_sessions.delete_one({"session_token": token})
    _clear_session_cookie(response)
    return {"ok": True}


@router.patch("/me", response_model=User)
async def update_me(payload: UpdateProfileRequest, user: User = Depends(get_current_user)):
    updates = {}
    if payload.name is not None:
        updates["name"] = payload.name.strip()[:120]
    if payload.rfc is not None:
        updates["rfc"] = payload.rfc.strip().upper()[:13]
    if updates:
        await _db.users.update_one({"user_id": user.user_id}, {"$set": updates})
    fresh = await _db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    return _user_doc_to_model(fresh)
