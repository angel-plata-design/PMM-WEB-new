"""PMM Backend API tests (iter 3) - covers auth, health, quote, tracking, branches, invoices, posts, services, leads, products, checkout (auth), orders/mine."""
import os
import time
import pytest
import requests

BASE_URL = (os.environ.get('REACT_APP_BACKEND_URL') or 'https://pmm-web-optimize.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth_user(session):
    """Create a fresh user and return {token, email, password, user}."""
    ts = int(time.time() * 1000)
    email = f"test_iter3_{ts}@pmm.com"
    password = "pass123"
    payload = {"name": "TEST_Iter3 User", "email": email, "password": password}
    r = session.post(f"{API}/auth/register", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    assert "session_token" in d and "user" in d
    return {"token": d["session_token"], "email": email, "password": password, "user": d["user"]}


def _auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ===== Health =====
def test_health(session):
    r = session.get(f"{API}/health", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"


# ===== Auth =====
def test_register_returns_user_and_token(auth_user):
    assert auth_user["token"]
    assert auth_user["user"]["email"] == auth_user["email"]
    assert auth_user["user"]["role"] == "customer"
    assert auth_user["user"]["has_password"] is True


def test_register_duplicate_email(session, auth_user):
    payload = {"name": "Dup", "email": auth_user["email"], "password": "pass123"}
    r = session.post(f"{API}/auth/register", json=payload, timeout=20)
    assert r.status_code == 409


def test_register_short_password(session):
    ts = int(time.time() * 1000)
    payload = {"name": "Short", "email": f"short_{ts}@pmm.com", "password": "abc"}
    r = session.post(f"{API}/auth/register", json=payload, timeout=20)
    assert r.status_code == 400


def test_login_success(session, auth_user):
    r = session.post(f"{API}/auth/login", json={"email": auth_user["email"], "password": auth_user["password"]}, timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert "session_token" in d
    assert d["user"]["email"] == auth_user["email"]


def test_login_invalid_credentials(session, auth_user):
    r = session.post(f"{API}/auth/login", json={"email": auth_user["email"], "password": "wrongpass"}, timeout=20)
    assert r.status_code == 401


def test_me_without_token(session):
    r = requests.get(f"{API}/auth/me", timeout=20)
    assert r.status_code == 401


def test_me_with_token(auth_user):
    r = requests.get(f"{API}/auth/me", headers=_auth_headers(auth_user["token"]), timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["email"] == auth_user["email"]
    assert "_id" not in d


def test_update_me_rfc_uppercase_truncated(auth_user):
    payload = {"name": "TEST_Iter3 Updated", "rfc": "test010101abcde"}  # 15 chars, should uppercase + truncate to 13
    r = requests.patch(f"{API}/auth/me", json=payload, headers=_auth_headers(auth_user["token"]), timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["name"] == "TEST_Iter3 Updated"
    assert d["rfc"] == "TEST010101ABC"  # uppercased + truncated to 13
    assert len(d["rfc"]) == 13


def test_google_session_invalid(session):
    r = session.post(f"{API}/auth/google/session", json={"session_id": "invalid_session_xxx"}, timeout=20)
    assert r.status_code == 401


def test_logout_invalidates_session(session):
    # create a throwaway user
    ts = int(time.time() * 1000)
    email = f"logout_{ts}@pmm.com"
    r = session.post(f"{API}/auth/register", json={"name": "L", "email": email, "password": "pass123"}, timeout=20)
    token = r.json()["session_token"]
    # logout requires the cookie OR header — the server uses request.cookies.get only for logout
    # We'll send token as cookie
    r2 = requests.post(f"{API}/auth/logout", cookies={"session_token": token}, timeout=20)
    assert r2.status_code == 200
    # Verify session no longer works
    r3 = requests.get(f"{API}/auth/me", headers=_auth_headers(token), timeout=20)
    assert r3.status_code == 401


# ===== Quote =====
def test_quote_estandar(session):
    payload = {"origen_cp": "03100", "destino_cp": "64620", "peso": 2.5, "tipo_servicio": "estandar"}
    r = session.post(f"{API}/quote", json=payload, timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["total"] > 0
    assert d["iva"] == round(d["subtotal"] * 0.16, 2)
    assert d["dias_estimados"] == 3


def test_quote_invalid_peso(session):
    r = session.post(f"{API}/quote", json={"origen_cp": "03100", "destino_cp": "64620", "peso": 0, "tipo_servicio": "estandar"}, timeout=20)
    assert r.status_code == 400


# ===== Tracking =====
def test_tracking(session):
    r = session.get(f"{API}/tracking/PMM-12345678", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["guia"] == "PMM-12345678"
    assert len(d["eventos"]) == 4


# ===== Branches =====
def test_branches_list(session):
    r = session.get(f"{API}/branches", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) == 16


def test_branches_coverage(session):
    r = session.get(f"{API}/branches/coverage", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["anos_experiencia"] == 30


# ===== Invoices =====
def test_invoice(session):
    r = session.get(f"{API}/invoices/PMM-001", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["estatus"] == "Timbrada"


# ===== Posts =====
def test_posts_list(session):
    r = session.get(f"{API}/posts", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) == 4


# ===== Services (Iter3: now 8 services) =====
def test_services_returns_eight(session):
    r = session.get(f"{API}/services", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) == 8
    keys = {s["key"] for s in arr}
    expected = {
        "entrega-domicilio", "entrega-detalle", "por-cobrar", "ocurre",
        "recoleccion-domicilio", "valor-declarado", "acuse-recibo", "retorno-evidencias",
    }
    assert keys == expected


# ===== Leads =====
def test_create_lead(session):
    payload = {"name": "TEST_User", "email": "test_lead@example.com", "phone": "5555555555"}
    r = session.post(f"{API}/leads", json=payload, timeout=20)
    assert r.status_code == 200
    assert r.json()["name"] == "TEST_User"


# ===== Products =====
def test_products_list(session):
    r = session.get(f"{API}/products", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) == 4
    ids = {p["id"] for p in arr}
    assert ids == {"box5", "box10", "box20", "box30"}
    for p in arr:
        assert len(p["tiers"]) == 6


# ===== Checkout (now requires auth) =====
def test_checkout_without_auth_returns_401(session):
    payload = {"phone": "5512345678", "items": [{"box_id": "box5", "tier_id": "t10", "qty": 1}]}
    r = session.post(f"{API}/checkout", json=payload, timeout=20)
    assert r.status_code == 401


def test_checkout_success_with_auth(auth_user):
    payload = {
        "phone": "5512345678",
        "items": [
            {"box_id": "box5", "tier_id": "t10", "qty": 2},
            {"box_id": "box20", "tier_id": "t50", "qty": 1},
        ],
    }
    r = requests.post(f"{API}/checkout", json=payload, headers=_auth_headers(auth_user["token"]), timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["order_id"].startswith("PMM-")
    expected = round(2374.05 * 2 + 15400.0, 2)
    assert d["total"] == expected
    assert d["guias_total"] == 70


def test_checkout_empty_cart(auth_user):
    r = requests.post(f"{API}/checkout", json={"phone": "1", "items": []}, headers=_auth_headers(auth_user["token"]), timeout=20)
    assert r.status_code == 400


# ===== Orders mine =====
def test_orders_mine_without_auth_returns_401(session):
    r = session.get(f"{API}/orders/mine", timeout=20)
    assert r.status_code == 401


def test_orders_mine_returns_users_orders(auth_user):
    r = requests.get(f"{API}/orders/mine", headers=_auth_headers(auth_user["token"]), timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert isinstance(arr, list)
    # We created at least 1 order in test_checkout_success_with_auth
    assert len(arr) >= 1
    for o in arr:
        assert "_id" not in o
        assert o["order_id"].startswith("PMM-")
