from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="PMM API", version="1.0")
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    origen: Optional[str] = None
    destino: Optional[str] = None
    peso: Optional[float] = None
    tipo_cliente: str = "personas"  # personas | empresas
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    origen: Optional[str] = None
    destino: Optional[str] = None
    peso: Optional[float] = None
    tipo_cliente: str = "personas"
    message: Optional[str] = None

class QuoteRequest(BaseModel):
    origen_cp: str
    destino_cp: str
    peso: float
    largo: Optional[float] = 30
    ancho: Optional[float] = 30
    alto: Optional[float] = 30
    tipo_servicio: str = "estandar"  # estandar | express | tarima

class QuoteResponse(BaseModel):
    quote_id: str
    origen_cp: str
    destino_cp: str
    peso: float
    peso_volumetrico: float
    peso_facturable: float
    tipo_servicio: str
    subtotal: float
    iva: float
    total: float
    dias_estimados: int
    moneda: str = "MXN"

class TrackingEvent(BaseModel):
    timestamp: str
    location: str
    status: str
    description: str

class TrackingResponse(BaseModel):
    guia: str
    estado_actual: str
    origen: str
    destino: str
    fecha_envio: str
    fecha_estimada: str
    eventos: List[TrackingEvent]

class Branch(BaseModel):
    id: str
    nombre: str
    estado: str
    ciudad: str
    direccion: str
    telefono: str
    horario: str
    cp: str
    lat: float
    lng: float

class BlogPost(BaseModel):
    slug: str
    title: str
    excerpt: str
    content: str
    category: str
    cover: str
    date: str
    read_time: str

# ============== SEED DATA ==============

SUCURSALES_SEED = [
    {"id": "suc-cdmx-centro", "nombre": "PMM CDMX Centro", "estado": "Ciudad de México", "ciudad": "Ciudad de México", "direccion": "Av. Insurgentes Sur 1234, Col. Del Valle", "telefono": "55 5555 1001", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "03100", "lat": 19.3878, "lng": -99.1773},
    {"id": "suc-gdl", "nombre": "PMM Guadalajara", "estado": "Jalisco", "ciudad": "Guadalajara", "direccion": "Av. López Mateos Sur 2200, Col. Cd. del Sol", "telefono": "33 3333 2002", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "45050", "lat": 20.6597, "lng": -103.3496},
    {"id": "suc-mty", "nombre": "PMM Monterrey", "estado": "Nuevo León", "ciudad": "Monterrey", "direccion": "Av. Gonzalitos 500, Col. Vista Hermosa", "telefono": "81 8181 3003", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "64620", "lat": 25.6866, "lng": -100.3161},
    {"id": "suc-pue", "nombre": "PMM Puebla", "estado": "Puebla", "ciudad": "Puebla", "direccion": "Blvd. Atlixco 1500, Col. La Paz", "telefono": "222 222 4004", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "72160", "lat": 19.0414, "lng": -98.2063},
    {"id": "suc-qro", "nombre": "PMM Querétaro", "estado": "Querétaro", "ciudad": "Querétaro", "direccion": "Av. 5 de Febrero 400, Col. Niños Héroes", "telefono": "442 442 5005", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "76010", "lat": 20.5888, "lng": -100.3899},
    {"id": "suc-leon", "nombre": "PMM León", "estado": "Guanajuato", "ciudad": "León", "direccion": "Blvd. Adolfo López Mateos 800, Col. Centro", "telefono": "477 477 6006", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "37000", "lat": 21.1250, "lng": -101.6859},
    {"id": "suc-mer", "nombre": "PMM Mérida", "estado": "Yucatán", "ciudad": "Mérida", "direccion": "Calle 60 Norte 299, Col. Altabrisa", "telefono": "999 999 7007", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "97130", "lat": 20.9674, "lng": -89.5926},
    {"id": "suc-tij", "nombre": "PMM Tijuana", "estado": "Baja California", "ciudad": "Tijuana", "direccion": "Blvd. Agua Caliente 4500, Col. Aviación", "telefono": "664 664 8008", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "22014", "lat": 32.5149, "lng": -117.0382},
    {"id": "suc-ver", "nombre": "PMM Veracruz", "estado": "Veracruz", "ciudad": "Veracruz", "direccion": "Av. Cuauhtémoc 1200, Col. Centro", "telefono": "229 229 9009", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "91700", "lat": 19.1738, "lng": -96.1342},
    {"id": "suc-cun", "nombre": "PMM Cancún", "estado": "Quintana Roo", "ciudad": "Cancún", "direccion": "Av. Tulum 200, SM 4", "telefono": "998 998 1010", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "77500", "lat": 21.1619, "lng": -86.8515},
    {"id": "suc-slp", "nombre": "PMM San Luis Potosí", "estado": "San Luis Potosí", "ciudad": "San Luis Potosí", "direccion": "Av. Carranza 1500, Col. Tequisquiapan", "telefono": "444 444 1111", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "78250", "lat": 22.1565, "lng": -100.9855},
    {"id": "suc-mor", "nombre": "PMM Morelia", "estado": "Michoacán", "ciudad": "Morelia", "direccion": "Av. Camelinas 3300, Col. Félix Ireta", "telefono": "443 443 1212", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "58070", "lat": 19.7008, "lng": -101.1844},
    {"id": "suc-tol", "nombre": "PMM Toluca", "estado": "Estado de México", "ciudad": "Toluca", "direccion": "Paseo Tollocan 800, Col. Centro", "telefono": "722 722 1313", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "50000", "lat": 19.2826, "lng": -99.6557},
    {"id": "suc-agu", "nombre": "PMM Aguascalientes", "estado": "Aguascalientes", "ciudad": "Aguascalientes", "direccion": "Av. Aguascalientes 100, Col. Bosques", "telefono": "449 449 1414", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "20127", "lat": 21.8853, "lng": -102.2916},
    {"id": "suc-her", "nombre": "PMM Hermosillo", "estado": "Sonora", "ciudad": "Hermosillo", "direccion": "Blvd. Kino 500, Col. Pitic", "telefono": "662 662 1515", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "83150", "lat": 29.0729, "lng": -110.9559},
    {"id": "suc-chi", "nombre": "PMM Chihuahua", "estado": "Chihuahua", "ciudad": "Chihuahua", "direccion": "Av. Tecnológico 2900, Col. Magisterial", "telefono": "614 614 1616", "horario": "L-V 9:00-19:00, S 9:00-14:00", "cp": "31200", "lat": 28.6353, "lng": -106.0889},
]

POSTS_SEED = [
    {
        "slug": "como-empacar-paquete-para-envio",
        "title": "Cómo empacar un paquete para envío sin que llegue dañado",
        "excerpt": "Una guía práctica con materiales, técnicas y errores comunes para que tu envío llegue intacto a cualquier punto de México.",
        "category": "Guías",
        "cover": "https://images.unsplash.com/photo-1766040923580-16ad32fae8b4",
        "date": "2026-01-12",
        "read_time": "6 min",
        "content": "El empaque correcto reduce hasta 80% el riesgo de daños. Estos son los principios que aplicamos en PMM tras más de 30 años transportando mercancía en México.\n\n**1. Elige la caja correcta.** Doble corrugado para objetos frágiles, cartón estándar para textil o accesorios. Deja al menos 5 cm de holgura por lado para relleno.\n\n**2. Protege desde adentro.** Burbuja, papel kraft o foam de polietileno para envolver cada pieza. Lo frágil se envuelve dos veces.\n\n**3. Inmoviliza.** Si el objeto se mueve al sacudir la caja, falta relleno. Usa cacahuates de unicel o aire comprimido en bolsas.\n\n**4. Sella en H.** Cinta canela cruzando las uniones superior e inferior en forma de H. Nunca uses masking tape.\n\n**5. Etiqueta clara.** Datos del destinatario completos, frágil cuando aplique, y elimina etiquetas viejas si reutilizas la caja.\n\nSi tienes envíos recurrentes, en PMM ofrecemos asesoría de embalaje para empresas dentro del servicio B2B."
    },
    {
        "slug": "diferencia-entre-mensajeria-y-paqueteria",
        "title": "Mensajería vs. Paquetería: cuál necesitas para tu negocio",
        "excerpt": "Aclaramos las diferencias entre ambos servicios para que elijas el correcto según volumen, peso y urgencia.",
        "category": "Conceptos",
        "cover": "https://images.unsplash.com/photo-1762320723943-527ff68405c3",
        "date": "2026-01-08",
        "read_time": "4 min",
        "content": "Aunque suelen usarse como sinónimos, mensajería y paquetería tienen alcances distintos.\n\n**Mensajería** se refiere al traslado de documentos y sobres ligeros (hasta 1 kg típicamente), con entregas rápidas dentro de la misma ciudad o entre plazas grandes.\n\n**Paquetería** abarca el envío de cajas y mercancía con peso desde 1 kg hasta cargas consolidadas y tarimas. Incluye servicios como entrega a detalle, ocurre, contra entrega y B2B.\n\nEn PMM operamos ambos esquemas: si necesitas mover documentos firmados entre tus sucursales, usamos mensajería. Si tu e-commerce necesita enviar 200 pedidos diarios, paquetería con guías prepagadas es lo más conveniente."
    },
    {
        "slug": "envios-por-cobrar-que-son",
        "title": "Envíos por cobrar: qué son y cómo activarlos en PMM",
        "excerpt": "El servicio que transfiere el costo del envío al destinatario y que está impulsando ventas en miles de PyMEs mexicanas.",
        "category": "Servicios",
        "cover": "https://images.unsplash.com/photo-1775756789951-3f2ef4307258",
        "date": "2026-01-04",
        "read_time": "5 min",
        "content": "El servicio **por cobrar** permite que el destinatario pague el envío al recibirlo. Es ideal para PyMEs y vendedores en marketplaces que no quieren absorber el costo logístico ni complicar el checkout.\n\n**Cómo funciona en PMM:**\n1. Generas la guía marcando 'Servicio por cobrar'.\n2. El paquete viaja con la tarifa pre-cotizada.\n3. Al entregar, nuestro colaborador cobra el envío al destinatario y emite el recibo.\n4. Tu negocio no desembolsa nada por el flete.\n\nFunciona en las 29 ciudades de cobertura nacional. Para activarlo necesitas una cuenta empresarial PMM."
    },
    {
        "slug": "como-rastrear-envio-pmm",
        "title": "Cómo rastrear tu envío PMM en tiempo real",
        "excerpt": "Paso a paso para consultar el estado de tu guía, recibir alertas y resolver incidencias sin esperar en línea.",
        "category": "Soporte",
        "cover": "https://images.pexels.com/photos/30341205/pexels-photo-30341205.jpeg",
        "date": "2026-01-02",
        "read_time": "3 min",
        "content": "Rastrear tu envío PMM toma menos de 30 segundos.\n\n**1. Tu número de guía.** Lo recibes al generar el envío. Tiene formato PMM-XXXXXXXX.\n\n**2. Ingresa a la sección Rastreo** en pmm.com.mx o usa el buscador en la home.\n\n**3. Consulta la línea de tiempo:** recolección, en tránsito, en sucursal destino, en ruta de entrega, entregado.\n\n**4. Activa alertas WhatsApp** para que el destinatario reciba notificaciones automáticas.\n\nSi tu guía lleva más de 48 horas sin movimiento, contacta a soporte y se levanta un caso interno con tu sucursal de origen."
    }
]

@app.on_event("startup")
async def seed_data():
    # Branches
    count = await db.branches.count_documents({})
    if count == 0:
        await db.branches.insert_many([{**s} for s in SUCURSALES_SEED])
    # Posts
    pcount = await db.posts.count_documents({})
    if pcount == 0:
        await db.posts.insert_many([{**p} for p in POSTS_SEED])

# ============== HELPERS ==============

def calculate_quote(req: QuoteRequest) -> QuoteResponse:
    # Volumetric weight: (L*W*H) / 5000
    peso_vol = (req.largo * req.ancho * req.alto) / 5000.0
    peso_fact = max(req.peso, peso_vol)
    base_rate = {"estandar": 18.0, "express": 32.0, "tarima": 12.0}.get(req.tipo_servicio, 18.0)
    distancia_factor = 1.0
    try:
        cp_o = int(req.origen_cp[:2])
        cp_d = int(req.destino_cp[:2])
        distancia_factor = 1.0 + (abs(cp_o - cp_d) / 100.0)
    except Exception:
        distancia_factor = 1.2
    subtotal = round(peso_fact * base_rate * distancia_factor + 75, 2)
    iva = round(subtotal * 0.16, 2)
    total = round(subtotal + iva, 2)
    dias = {"express": 1, "estandar": 3, "tarima": 5}.get(req.tipo_servicio, 3)
    return QuoteResponse(
        quote_id=str(uuid.uuid4()),
        origen_cp=req.origen_cp, destino_cp=req.destino_cp,
        peso=req.peso, peso_volumetrico=round(peso_vol, 2), peso_facturable=round(peso_fact, 2),
        tipo_servicio=req.tipo_servicio, subtotal=subtotal, iva=iva, total=total,
        dias_estimados=dias,
    )

def generate_tracking(guia: str) -> TrackingResponse:
    # Deterministic mock based on guide
    rnd = random.Random(guia)
    origenes = ["Ciudad de México", "Guadalajara", "Monterrey", "Querétaro", "Puebla"]
    destinos = ["Mérida", "León", "Tijuana", "Cancún", "Veracruz", "Hermosillo"]
    origen = rnd.choice(origenes); destino = rnd.choice(destinos)
    base = datetime.now(timezone.utc) - timedelta(days=2)
    eventos = [
        {"timestamp": (base + timedelta(hours=0)).isoformat(), "location": origen, "status": "Recolectado", "description": "El paquete fue recolectado en sucursal de origen."},
        {"timestamp": (base + timedelta(hours=6)).isoformat(), "location": origen, "status": "En tránsito", "description": "El paquete salió del centro de distribución."},
        {"timestamp": (base + timedelta(hours=22)).isoformat(), "location": "Hub Central", "status": "En clasificación", "description": "Paquete clasificado para ruta destino."},
        {"timestamp": (base + timedelta(hours=38)).isoformat(), "location": destino, "status": "En sucursal destino", "description": "Llegó a la sucursal destino y está en preparación de ruta."},
    ]
    fecha_estimada = (base + timedelta(days=1)).date().isoformat()
    return TrackingResponse(
        guia=guia, estado_actual="En sucursal destino",
        origen=origen, destino=destino,
        fecha_envio=base.date().isoformat(),
        fecha_estimada=fecha_estimada,
        eventos=[TrackingEvent(**e) for e in eventos],
    )

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "PMM API online", "version": "1.0"}

@api_router.get("/health")
async def health():
    return {"status": "ok", "ts": datetime.now(timezone.utc).isoformat()}

@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    return lead

@api_router.get("/leads", response_model=List[Lead])
async def list_leads(limit: int = 50):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for l in leads:
        if isinstance(l.get('created_at'), str):
            l['created_at'] = datetime.fromisoformat(l['created_at'])
    return leads

@api_router.post("/quote", response_model=QuoteResponse)
async def quote(payload: QuoteRequest):
    if payload.peso <= 0:
        raise HTTPException(status_code=400, detail="Peso debe ser mayor a 0")
    if len(payload.origen_cp) < 4 or len(payload.destino_cp) < 4:
        raise HTTPException(status_code=400, detail="CP inválido")
    return calculate_quote(payload)

@api_router.get("/tracking/{guia}", response_model=TrackingResponse)
async def tracking(guia: str):
    if len(guia) < 4:
        raise HTTPException(status_code=400, detail="Guía inválida")
    return generate_tracking(guia.upper())

@api_router.get("/branches", response_model=List[Branch])
async def branches(estado: Optional[str] = None, cp: Optional[str] = None, q: Optional[str] = None):
    query = {}
    if estado:
        query["estado"] = {"$regex": estado, "$options": "i"}
    if cp:
        query["cp"] = {"$regex": f"^{cp[:2]}"}
    if q:
        query["$or"] = [
            {"ciudad": {"$regex": q, "$options": "i"}},
            {"estado": {"$regex": q, "$options": "i"}},
            {"nombre": {"$regex": q, "$options": "i"}},
        ]
    branches = await db.branches.find(query, {"_id": 0}).to_list(200)
    return branches

@api_router.get("/branches/coverage")
async def coverage_summary():
    estados = await db.branches.distinct("estado")
    ciudades = await db.branches.distinct("ciudad")
    return {
        "estados": sorted(estados),
        "ciudades": sorted(ciudades),
        "total_estados": len(estados),
        "total_ciudades": len(ciudades),
        "anos_experiencia": 30,
    }

class InvoiceResponse(BaseModel):
    folio: str
    fecha: str
    cliente: str
    rfc: str
    subtotal: float
    iva: float
    total: float
    estatus: str
    xml_url: str
    pdf_url: str

@api_router.get("/invoices/{folio}", response_model=InvoiceResponse)
async def get_invoice(folio: str):
    # Mock invoice search
    if len(folio) < 3:
        raise HTTPException(status_code=404, detail="Folio no encontrado")
    rnd = random.Random(folio)
    sub = round(rnd.uniform(150, 4500), 2)
    iva = round(sub * 0.16, 2)
    return InvoiceResponse(
        folio=folio.upper(),
        fecha=(datetime.now(timezone.utc) - timedelta(days=rnd.randint(1, 30))).date().isoformat(),
        cliente="Cliente PMM",
        rfc="XAXX010101000",
        subtotal=sub, iva=iva, total=round(sub + iva, 2),
        estatus="Timbrada",
        xml_url=f"/api/invoices/{folio}/xml",
        pdf_url=f"/api/invoices/{folio}/pdf",
    )

@api_router.get("/posts", response_model=List[BlogPost])
async def list_posts():
    posts = await db.posts.find({}, {"_id": 0}).to_list(50)
    return posts

@api_router.get("/posts/{slug}", response_model=BlogPost)
async def get_post(slug: str):
    p = await db.posts.find_one({"slug": slug}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    return p

class Service(BaseModel):
    key: str
    name: str
    description: str
    icon: str
    image: str
    bullets: List[str]

@api_router.get("/services", response_model=List[Service])
async def list_services():
    return [
        Service(
            key="entrega-detalle",
            name="Entrega a detalle",
            description="Nuestros colaboradores revisan frente a ti cada paquete para asegurar que tu envío llegó como lo pediste.",
            icon="package-check",
            image="https://images.unsplash.com/photo-1766040923580-16ad32fae8b4",
            bullets=["Validación frente al cliente", "Acuse firmado", "Reporte fotográfico opcional"],
        ),
        Service(
            key="por-cobrar",
            name="Servicio por cobrar",
            description="Envía sin importar el volumen — el costo se cubre por el destinatario al entregar.",
            icon="hand-coins",
            image="https://images.unsplash.com/photo-1775756789951-3f2ef4307258",
            bullets=["Cobro al destinatario", "Ideal para e-commerce", "Cobertura nacional"],
        ),
        Service(
            key="retorno-evidencias",
            name="Retorno de evidencias",
            description="Obtén de regreso facturas, entradas a almacén, acuses o cualquier documento firmado.",
            icon="file-check-2",
            image="https://images.pexels.com/photos/30341205/pexels-photo-30341205.jpeg",
            bullets=["Documentos firmados", "Sellos y acuses", "Trazabilidad total"],
        ),
        Service(
            key="ocurre",
            name="Servicio ocurre",
            description="Entrega directa en nuestras sucursales al destinatario que indiques en la carta porte.",
            icon="map-pin",
            image="https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg",
            bullets=["Recolección en sucursal", "Identificación oficial", "Resguardo seguro"],
        ),
    ]

# ============== TIENDA (PRODUCTS + CHECKOUT) ==============

class ProductTier(BaseModel):
    id: str
    label: str
    guias: int
    price: float

class Product(BaseModel):
    id: str
    name: str
    title: str
    description: str
    weight_kg: int
    color: str
    color_tag: str
    tiers: List[ProductTier]

# Volume discount multipliers
TIER_DEFS = [
    {"id": "t1",   "label": "1 guía",     "guias": 1,   "mult": 1.0},
    {"id": "t10",  "label": "10 guías",   "guias": 10,  "mult": 9.5},
    {"id": "t30",  "label": "30 guías",   "guias": 30,  "mult": 27.5},
    {"id": "t50",  "label": "50 guías",   "guias": 50,  "mult": 44.0},
    {"id": "t100", "label": "100 guías",  "guias": 100, "mult": 84.0},
    {"id": "t300", "label": "300 guías",  "guias": 300, "mult": 240.0},
]

BOX_BASE_PRICES = [
    {"id": "box5",  "name": "5kg",  "weight_kg": 5,  "base": 249.90, "color": "#1E008D", "color_tag": "Azul",
     "title": "Caja 5 kg", "description": "Ideal para envíos pequeños: documentos, accesorios, ropa ligera."},
    {"id": "box10", "name": "10kg", "weight_kg": 10, "base": 301.00, "color": "#3DAE2B", "color_tag": "Verde",
     "title": "Caja 10 kg", "description": "Para pedidos medianos: electrónicos, kits, paquetes regulares."},
    {"id": "box20", "name": "20kg", "weight_kg": 20, "base": 350.00, "color": "#2D2D2D", "color_tag": "Carbón",
     "title": "Caja 20 kg", "description": "Para envíos pesados: hogar, refacciones, lotes mayoristas."},
    {"id": "box30", "name": "30kg", "weight_kg": 30, "base": 390.00, "color": "#1E008D", "color_tag": "XL",
     "title": "Caja 30 kg", "description": "Máxima capacidad para mercancía voluminosa o consolidada."},
]

def build_products() -> List[Product]:
    out = []
    for box in BOX_BASE_PRICES:
        tiers = []
        for t in TIER_DEFS:
            tiers.append(ProductTier(
                id=t["id"],
                label=t["label"],
                guias=t["guias"],
                price=round(box["base"] * t["mult"], 2),
            ))
        out.append(Product(
            id=box["id"], name=box["name"], title=box["title"],
            description=box["description"], weight_kg=box["weight_kg"],
            color=box["color"], color_tag=box["color_tag"], tiers=tiers,
        ))
    return out

@api_router.get("/products", response_model=List[Product])
async def list_products():
    return build_products()

class CheckoutItem(BaseModel):
    box_id: str
    tier_id: str
    qty: int

class CheckoutRequest(BaseModel):
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    items: List[CheckoutItem]

class CheckoutResponse(BaseModel):
    order_id: str
    total: float
    items_count: int
    guias_total: int
    created_at: str

@api_router.post("/checkout", response_model=CheckoutResponse)
async def checkout(payload: CheckoutRequest):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Carrito vacío")
    products = {p.id: p for p in build_products()}
    total = 0.0
    guias_total = 0
    enriched = []
    for it in payload.items:
        prod = products.get(it.box_id)
        if not prod:
            raise HTTPException(status_code=400, detail=f"Producto inválido: {it.box_id}")
        tier = next((t for t in prod.tiers if t.id == it.tier_id), None)
        if not tier:
            raise HTTPException(status_code=400, detail=f"Paquete inválido: {it.tier_id}")
        if it.qty <= 0:
            raise HTTPException(status_code=400, detail="Cantidad inválida")
        total += tier.price * it.qty
        guias_total += tier.guias * it.qty
        enriched.append({
            "box_id": it.box_id, "box_name": prod.name, "tier_id": it.tier_id,
            "tier_label": tier.label, "guias": tier.guias,
            "unit_price": tier.price, "qty": it.qty,
        })
    order_id = "PMM-" + str(uuid.uuid4()).split("-")[0].upper()
    created_at = datetime.now(timezone.utc).isoformat()
    doc = {
        "order_id": order_id,
        "customer": {"name": payload.name, "email": payload.email, "phone": payload.phone, "company": payload.company},
        "items": enriched,
        "total": round(total, 2),
        "guias_total": guias_total,
        "items_count": len(enriched),
        "created_at": created_at,
        "status": "pending_payment",
    }
    await db.orders.insert_one(doc)
    return CheckoutResponse(
        order_id=order_id, total=round(total, 2),
        items_count=len(enriched), guias_total=guias_total,
        created_at=created_at,
    )

# Mount router & middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
