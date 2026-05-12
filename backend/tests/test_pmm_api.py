"""PMM Backend API tests - covers health, quote, tracking, branches, invoices, posts, services, leads."""
import os
import pytest
import requests

BASE_URL = (os.environ.get('REACT_APP_BACKEND_URL') or 'https://pmm-web-optimize.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ===== Health =====
def test_health(session):
    r = session.get(f"{API}/health", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "ts" in data


# ===== Quote =====
def test_quote_estandar(session):
    payload = {"origen_cp": "03100", "destino_cp": "64620", "peso": 2.5, "tipo_servicio": "estandar"}
    r = session.post(f"{API}/quote", json=payload, timeout=20)
    assert r.status_code == 200
    d = r.json()
    for k in ["quote_id", "subtotal", "iva", "total", "dias_estimados", "peso_facturable"]:
        assert k in d
    assert d["total"] > 0
    assert d["iva"] == round(d["subtotal"] * 0.16, 2)
    assert d["dias_estimados"] == 3
    assert "_id" not in d


def test_quote_invalid_peso(session):
    r = session.post(f"{API}/quote", json={"origen_cp": "03100", "destino_cp": "64620", "peso": 0, "tipo_servicio": "estandar"}, timeout=20)
    assert r.status_code == 400


def test_quote_invalid_cp(session):
    r = session.post(f"{API}/quote", json={"origen_cp": "031", "destino_cp": "646", "peso": 2, "tipo_servicio": "estandar"}, timeout=20)
    assert r.status_code == 400


# ===== Tracking =====
def test_tracking(session):
    r = session.get(f"{API}/tracking/PMM-12345678", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["guia"] == "PMM-12345678"
    assert len(d["eventos"]) == 4
    for ev in d["eventos"]:
        assert "timestamp" in ev and "status" in ev
    assert d["origen"] and d["destino"]
    assert d["estado_actual"]


# ===== Branches =====
def test_branches_list(session):
    r = session.get(f"{API}/branches", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) == 16
    for b in arr:
        assert "_id" not in b
        for k in ["id", "nombre", "estado", "ciudad", "cp"]:
            assert k in b


def test_branches_filter_q(session):
    r = session.get(f"{API}/branches", params={"q": "Guadalajara"}, timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) >= 1
    assert any("Guadalajara" in b["ciudad"] for b in arr)


def test_branches_filter_estado(session):
    r = session.get(f"{API}/branches", params={"estado": "Jalisco"}, timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert all("Jalisco" in b["estado"] for b in arr)


def test_branches_coverage(session):
    r = session.get(f"{API}/branches/coverage", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["total_estados"] >= 1
    assert d["total_ciudades"] >= 1
    assert d["anos_experiencia"] == 30


# ===== Invoices =====
def test_invoice(session):
    r = session.get(f"{API}/invoices/PMM-001", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["folio"] == "PMM-001"
    assert d["estatus"] == "Timbrada"
    assert d["xml_url"] and d["pdf_url"]
    assert d["total"] > 0


# ===== Posts =====
def test_posts_list(session):
    r = session.get(f"{API}/posts", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) == 4
    for p in arr:
        assert "_id" not in p
        assert "slug" in p and "title" in p


def test_post_detail(session):
    r = session.get(f"{API}/posts/como-empacar-paquete-para-envio", timeout=20)
    assert r.status_code == 200
    d = r.json()
    assert d["slug"] == "como-empacar-paquete-para-envio"
    assert "content" in d and len(d["content"]) > 100


def test_post_not_found(session):
    r = session.get(f"{API}/posts/non-existent-slug-xx", timeout=20)
    assert r.status_code == 404


# ===== Services =====
def test_services(session):
    r = session.get(f"{API}/services", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) == 4
    keys = [s["key"] for s in arr]
    assert set(keys) == {"entrega-detalle", "por-cobrar", "retorno-evidencias", "ocurre"}


# ===== Leads =====
def test_create_lead_and_list(session):
    payload = {"name": "TEST_User", "email": "test_lead@example.com", "phone": "5555555555", "tipo_cliente": "personas", "message": "Test lead"}
    r = session.post(f"{API}/leads", json=payload, timeout=20)
    assert r.status_code == 200
    created = r.json()
    assert "_id" not in created
    assert created["name"] == "TEST_User"
    assert "id" in created

    # List leads
    r2 = session.get(f"{API}/leads", timeout=20)
    assert r2.status_code == 200
    arr = r2.json()
    assert isinstance(arr, list)
    assert any(l.get("id") == created["id"] for l in arr)
    for l in arr:
        assert "_id" not in l



# ===== Tienda: Products =====
def test_products_list(session):
    r = session.get(f"{API}/products", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    assert len(arr) == 4
    ids = {p["id"] for p in arr}
    assert ids == {"box5", "box10", "box20", "box30"}
    for p in arr:
        assert "_id" not in p
        assert len(p["tiers"]) == 6
        tier_ids = {t["id"] for t in p["tiers"]}
        assert tier_ids == {"t1", "t10", "t30", "t50", "t100", "t300"}
        for t in p["tiers"]:
            assert t["price"] > 0
            assert isinstance(t["guias"], int)


def test_products_pricing_scaling(session):
    """t10 should be 9.5x t1 price, t300 should be 240x t1 price."""
    r = session.get(f"{API}/products", timeout=20)
    assert r.status_code == 200
    arr = r.json()
    box5 = next(p for p in arr if p["id"] == "box5")
    tiers = {t["id"]: t for t in box5["tiers"]}
    base = tiers["t1"]["price"]
    assert base == 249.90
    assert tiers["t10"]["price"] == round(base * 9.5, 2)
    assert tiers["t300"]["price"] == round(base * 240.0, 2)


# ===== Tienda: Checkout =====
def test_checkout_success(session):
    payload = {
        "name": "TEST_Buyer",
        "email": "buyer@example.com",
        "phone": "5512345678",
        "items": [
            {"box_id": "box5", "tier_id": "t10", "qty": 2},
            {"box_id": "box20", "tier_id": "t50", "qty": 1},
        ],
    }
    r = session.post(f"{API}/checkout", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["order_id"].startswith("PMM-")
    assert len(d["order_id"]) == 12  # PMM- + 8 hex
    assert "_id" not in d
    # compute expected total: box5 t10 = 249.90*9.5=2374.05 *2 + box20 t50 = 350*44=15400 *1
    expected = round(2374.05 * 2 + 15400.0, 2)
    assert d["total"] == expected
    assert d["items_count"] == 2
    assert d["guias_total"] == 10 * 2 + 50 * 1


def test_checkout_empty_cart(session):
    r = session.post(f"{API}/checkout", json={"name": "X", "email": "x@x.com", "phone": "1", "items": []}, timeout=20)
    assert r.status_code == 400


def test_checkout_invalid_box(session):
    r = session.post(f"{API}/checkout", json={
        "name": "X", "email": "x@x.com", "phone": "1",
        "items": [{"box_id": "box999", "tier_id": "t1", "qty": 1}],
    }, timeout=20)
    assert r.status_code == 400


def test_checkout_invalid_tier(session):
    r = session.post(f"{API}/checkout", json={
        "name": "X", "email": "x@x.com", "phone": "1",
        "items": [{"box_id": "box5", "tier_id": "t999", "qty": 1}],
    }, timeout=20)
    assert r.status_code == 400
