# PMM — Paquetería y Mensajería · Product Requirements Document

## Original Problem Statement
> Mejorar el sitio web https://pmm.com.mx/ con el plan de SEO compartido, usando estructuralmente https://www.viamaster-intl.com/ como referencia visual. Respetar contenido y funcionalidad de PMM, con buen UX/UI y plan SEO factible, sin romper la marca.

User Choice: rediseño + mocks funcionales (cotizador, rastreo, facturación, leads).

## Architecture
- **Frontend**: React 19 + React Router + Tailwind + react-helmet-async (SEO). Cormorant Garamond / Manrope / JetBrains Mono.
- **Backend**: FastAPI on :8001 with `/api` prefix; MongoDB persistence (motor).
- **Theme**: Dark editorial, premium, full-bleed cinematic hero, PMM red `#E30613` as sharp accent.
- **Routes** (11): `/`, `/cotizador`, `/rastreo`, `/cobertura`, `/servicios/empresas`, `/servicios/personas`, `/guias-prepagadas`, `/blog`, `/blog/:slug`, `/sucursales`, `/facturacion`, `/contacto`.
- **API endpoints** (10): `/api/health`, `/api/quote`, `/api/tracking/{guia}`, `/api/branches`, `/api/branches/coverage`, `/api/invoices/{folio}`, `/api/posts`, `/api/posts/{slug}`, `/api/services`, `/api/leads`.

## User Personas
1. **PyME / e-commerce mexicana** — busca cotizar envíos, guías prepagadas, servicio por cobrar.
2. **Comprador final** — quiere rastrear su paquete, encontrar sucursal cercana.
3. **Empresa B2B** — necesita plan dedicado, retorno de evidencias, cobertura nacional.
4. **Cliente de facturación** — busca CFDI por folio.

## Core Requirements (Static)
- Cobertura nacional (16+ estados, 29+ ciudades) — `/api/branches/coverage` ya devuelve este resumen.
- Conservar contenido PMM: "Transportando Emociones", servicios (entrega a detalle, por cobrar, retorno de evidencias, ocurre).
- SEO: SSL canonical, sitemap.xml, robots.txt, JSON-LD Organization/Article/LocalBusiness, OG + Twitter cards `summary_large_image`.

## Implemented (2026-01-12)
- ✅ Diseño editorial premium con tipografía **Inter** (jugando con pesos 200/300/400/500/600) + JetBrains Mono para acentos.
- ✅ Hero full-bleed + dual CTAs (Cotizar / Rastrear).
- ✅ Quick Quote panel sobre hero + Cotizador completo.
- ✅ Tracking widget con timeline determinístico mock.
- ✅ Cobertura con buscador por ciudad/estado/CP.
- ✅ Servicios B2B vs Personas (4 servicios cada uno).
- ✅ Guías Prepagadas: 3 planes (Starter / Pro / Business).
- ✅ Blog con 4 posts seed según plan SEO.
- ✅ Sucursales (16 seed) con JSON-LD LocalBusiness @graph.
- ✅ Facturación con buscador de folio mock (Timbrada).
- ✅ Contacto + lead capture persistido en MongoDB.
- ✅ WhatsApp FAB con mensaje prellenado.
- ✅ SEO técnico: react-helmet-async (title/description/canonical/og/twitter), JSON-LD Organization en Home, Article en posts, LocalBusiness en Sucursales.
- ✅ `/public/sitemap.xml` (15 URLs) y `/public/robots.txt`.
- ✅ Test suite backend pytest (15/15 passing) y validación frontend e2e (100%).

## Rebrand (2026-01-12)
- ✅ Paleta oficial PMM: **azul `#1E008D`** (primary), **verde `#3DAE2B`** (accent/secondary), **carbón `#2D2D2D`** (dark surfaces), **crema `#FAFAFA`** (background).
- ✅ Logos oficiales: `pmm-azul.svg` (en navbar/light) y `pmm-blanco.svg` (en hero/footer/dark).
- ✅ Tema cambiado de dark editorial → **light editorial** con bandas oscuras de contraste (#2D2D2D + overlays #1E008D).
- ✅ Tipografía: Cormorant Garamond → **Inter** (variable weights 200-700) para look moderno + legible.
- ✅ CTAs verdes en hero, azules en interior; acentos verdes para palabras clave en headlines sobre fondos azules (evita dark-on-dark).

## Backlog / Prioritized
### P1 — Próximos pasos para producción
- Reemplazar mocks: integrar `/api/quote` con tarifario real PMM, `/api/tracking` con sistema real (web service WMS/TMS), `/api/invoices` con SAT/SW.
- Reemplazar dominios e imágenes con fotos reales de operaciones PMM.
- Video hero real de PMM (camiones, almacén).
- Endpoint WhatsApp Business API.

### P2 — Mejoras de conversión
- A/B test del hero copy (Transportando emociones vs. Envía con la red más cercana).
- Cuenta de usuario / login con histórico de envíos.
- Recordatorios automatizados de tracking via WhatsApp/SMS.
- Editor de imagen para guías personalizadas (logo cliente).
- Dashboard B2B con estadísticas, exportes CSV, integración a sistemas contables.

### P3 — SEO/Crecimiento
- Páginas de ciudad solo cuando exista dato local verificable (horarios reales, rutas).
- Schema FAQ en posts y Servicios.
- Hreflang / mercado regional si se expande LatAm.

## Public URL
Preview: https://5bf3ed2f-472d-4807-a1ef-78ed6fac7d82.preview.emergentagent.com

## Tests
- Backend: `/app/backend/tests/test_pmm_api.py` (pytest)
- Iteration 1 report: `/app/test_reports/iteration_1.json` (100% pass)
