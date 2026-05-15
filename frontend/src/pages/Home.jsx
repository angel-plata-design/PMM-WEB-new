import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Package,
  HandCoins,
  FileCheck2,
  MapPin,
  Truck,
  Building2,
  ShieldCheck,
  Search,
} from "lucide-react";
import Seo from "../components/Seo";
import HomeToolsPanel from "../components/HomeToolsPanel";
import pmmApi from "../lib/api";

const HERO_IMG = "https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg";

// SVG dot texture pattern (data URI) — used as hero overlay
const DOT_TEXTURE = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

const SERVICES = [
  {
    key: "entrega-detalle",
    icon: Package,
    name: "Entrega a detalle",
    desc: "Revisión frente al cliente. Acuse firmado. Máxima seguridad en cada entrega.",
    img: "https://images.unsplash.com/photo-1766040923580-16ad32fae8b4",
  },
  {
    key: "por-cobrar",
    icon: HandCoins,
    name: "Servicio por cobrar",
    desc: "El destinatario cubre el flete. Ideal para e-commerce y ventas en línea.",
    img: "https://images.unsplash.com/photo-1775756789951-3f2ef4307258",
  },
  {
    key: "retorno-evidencias",
    icon: FileCheck2,
    name: "Retorno de evidencias",
    desc: "Facturas, acuses y documentos firmados de vuelta a tu empresa sin demoras.",
    img: "https://images.pexels.com/photos/30341205/pexels-photo-30341205.jpeg",
  },
  {
    key: "ocurre",
    icon: MapPin,
    name: "Servicio ocurre",
    desc: "Entrega directa en sucursal al destinatario. Seguro y conveniente.",
    img: "https://images.unsplash.com/photo-1762320723943-527ff68405c3",
  },
];

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PMM Paquetería y Mensajería",
  url: "https://pmm.com.mx",
  logo: "https://pmm.com.mx/pmm-azul.svg",
  description: "Empresa mexicana de paquetería y mensajería con cobertura nacional. 30+ años de experiencia.",
  address: { "@type": "PostalAddress", addressCountry: "MX" },
};

const CITIES = [
  "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Querétaro",
  "León", "Mérida", "Tijuana", "Veracruz", "Cancún",
  "Hermosillo", "Chihuahua", "Aguascalientes", "Morelia", "Toluca",
];

export default function Home() {
  const [coverage, setCoverage] = useState({ total_estados: 16, total_ciudades: 29, anos_experiencia: 30 });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    pmmApi.coverage().then(setCoverage).catch(() => {});
    pmmApi.posts().then((p) => setPosts(p.slice(0, 4))).catch(() => {
      setPosts([
        { slug: "optimiza-logistica", title: "5 formas de optimizar tu logística en 2025", category: "Empresas", read_time: "4 min", cover: "https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg" },
        { slug: "guias-prepagadas", title: "¿Por qué las guías prepagadas son la mejor inversión?", category: "Tienda", read_time: "3 min", cover: "https://images.pexels.com/photos/30341205/pexels-photo-30341205.jpeg" },
        { slug: "e-commerce-envios", title: "E-commerce mexicano: la logística que sí funciona", category: "E-commerce", read_time: "5 min", cover: "https://images.unsplash.com/photo-1775756789951-3f2ef4307258" },
        { slug: "rastreo-tiempo-real", title: "Trazabilidad total: rastreo en tiempo real con PMM", category: "Tecnología", read_time: "3 min", cover: "https://images.unsplash.com/photo-1762320723943-527ff68405c3" },
      ]);
    });
  }, []);

  return (
    <>
      <Seo
        title="Tu socio logístico en México"
        description="Envía, rastrea y entrega con cobertura PMM en México. 30+ años de experiencia, 16+ estados, 29+ ciudades. Cotiza tu envío al instante."
        path="/"
        jsonLd={ORG_SCHEMA}
      />

      {/* ─── HERO — full bleed image + brand blue gradients + dot texture ─── */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden grain">
        <img src={HERO_IMG} alt="Operaciones PMM México" className="absolute inset-0 w-full h-full object-cover" />
        {/* Dark vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E008D] via-[#1E008D]/55 to-[#1E008D]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E008D]/85 via-[#1E008D]/25 to-transparent" />
        {/* Dot texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: DOT_TEXTURE }}
        />

        <div className="container-pmm relative z-10 pt-32 pb-56">
          {/* Eyebrow badge chip */}
          <div className="fade-up mb-6">
            <span className="inline-block bg-white/10 backdrop-blur-sm text-[#3DAE2B] font-semibold px-4 py-1.5 rounded-full text-sm tracking-wide border border-white/15">
              Líderes en logística mexicana · Desde 1995
            </span>
          </div>

          <h1 className="font-display text-white text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] max-w-5xl">
            <span className="fade-up fade-up-d1 inline-block">Transportando</span><br />
            <span className="fade-up fade-up-d2 inline-block">emociones,</span><br />
            <span className="fade-up fade-up-d3 inline-block font-display-medium text-white/95">entregando </span>
            <span className="fade-up fade-up-d3 inline-block font-display-medium text-[#3DAE2B]">confianza.</span>
          </h1>

          <div className="mt-10 max-w-2xl fade-up fade-up-d4">
            <p className="text-white/85 text-lg md:text-xl leading-relaxed font-light">
              Envía, rastrea y entrega con cobertura PMM en todo México. Soluciones logísticas integrales para empresas y personas en {coverage.total_ciudades}+ ciudades.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/tienda"
                data-testid="hero-cta-tienda"
                className="inline-flex items-center justify-center gap-3 bg-white text-[#1E008D] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition-all active:scale-95"
              >
                Ir a la tienda <ArrowRight size={18} />
              </Link>
              <Link
                to="/servicios/empresas"
                data-testid="hero-cta-empresas"
                className="inline-flex items-center justify-center gap-3 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
              >
                Soluciones B2B <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOOLS PANEL — Cotizar + Rastrear (floating over hero) ─── */}
      <section className="container-pmm -mt-24 relative z-20 pb-0">
        <HomeToolsPanel />
      </section>

      {/* ─── STATS — floating card overlapping hero ─── */}
      <section data-testid="stats-section" className="relative z-20 -mt-0 pb-0 pt-6">
        <div className="container-pmm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-2xl shadow-xl shadow-gray-200/60 overflow-hidden border border-gray-100">
            <div className="text-center py-10 px-6">
              <p className="text-5xl font-black text-[#1E008D]">{coverage.anos_experiencia}+</p>
              <p className="text-[#2D2D2D] font-medium mt-2">Años de experiencia</p>
            </div>
            <div className="text-center py-10 px-6 border-t md:border-t-0 md:border-l border-gray-100">
              <p className="text-5xl font-black text-[#1E008D]">{coverage.total_ciudades}+</p>
              <p className="text-[#2D2D2D] font-medium mt-2">Ciudades con cobertura</p>
            </div>
            <div className="text-center py-10 px-6 border-t md:border-t-0 md:border-l border-gray-100">
              <p className="text-5xl font-black text-[#1E008D]">10M+</p>
              <p className="text-[#2D2D2D] font-medium mt-2">Paquetes entregados</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTRO EDITORIAL — light ─── */}
      <section className="section-pad">
        <div className="container-pmm grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="text-overline mb-6">Quiénes somos</div>
            <h2 className="font-display text-5xl md:text-6xl text-[#2D2D2D]">
              Una red logística <em className="not-italic text-[#6B6B6B] font-display-medium">cercana,</em> hecha en México.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 space-y-6">
            <p className="text-[#2D2D2D] text-lg leading-relaxed">
              Conectamos ciudades e impulsamos negocios con soluciones de paquetería y mensajería diseñadas para la realidad mexicana: entregas rápidas, trato directo y total trazabilidad.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed">
              Somos un equipo de operadores, choferes, ejecutivos y aliados que toma cada envío como propio. Tres décadas después, seguimos creyendo que mover un paquete es mover una historia.
            </p>
            <div className="flex gap-8 pt-4">
              <Link to="/servicios/empresas" className="text-[#1E008D] nav-underline text-sm font-semibold uppercase tracking-wider">Servicios para empresas</Link>
              <Link to="/sucursales" className="text-[#1E008D] nav-underline text-sm font-semibold uppercase tracking-wider">Nuestras sucursales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES — white card grid (4 cards) ─── */}
      <section data-testid="services-mosaic" id="servicios" className="py-24 bg-white">
        <div className="container-pmm">
          <div className="text-center mb-16">
            <span className="text-overline-light">Lo que hacemos</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E008D] mt-3">Soluciones logísticas integrales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.key}
                  to={`/servicios/empresas#${s.key}`}
                  data-testid={`service-tile-${s.key}`}
                  className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-[#1E008D]/20 hover:shadow-2xl hover:shadow-[#1E008D]/5 transition-all duration-300 flex flex-col"
                >
                  <div className="w-14 h-14 bg-[#1E008D]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1E008D] transition-colors duration-300 shrink-0">
                    <Icon size={26} className="text-[#1E008D] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">{s.name}</h3>
                  <p className="text-[#2D2D2D]/70 leading-relaxed text-sm flex-1">{s.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-[#1E008D] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Ver más <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/servicios/empresas"
              className="inline-flex items-center gap-2 text-[#1E008D] font-bold nav-underline text-sm uppercase tracking-wider"
            >
              Ver todos los servicios <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DUAL CTA — dark cards ─── */}
      <section className="section-pad bg-[#FAFAFA]">
        <div className="container-pmm grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/servicios/empresas" data-testid="dual-cta-empresas" className="relative aspect-[4/5] md:aspect-auto md:h-[520px] overflow-hidden group bg-[#1E008D] border border-[#1E008D] hover-lift rounded-3xl">
            <img src="https://images.unsplash.com/photo-1775756789951-3f2ef4307258" alt="Empresas" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E008D]/95 via-[#1E008D]/80 to-[#1E008D]/95 rounded-3xl" />
            <div className="relative h-full p-10 md:p-14 flex flex-col justify-between text-white">
              <Building2 size={36} />
              <div>
                <div className="text-overline-on-dark mb-3">B2B Logística</div>
                <h3 className="font-display text-5xl md:text-6xl">Servicio para empresas</h3>
                <p className="text-white/85 mt-5 max-w-md">Soluciones integrales adaptadas a tu cadena de suministro. Confiabilidad total y trato dedicado.</p>
                <div className="mt-8 inline-flex items-center gap-2 text-white font-medium">
                  Conocer plan B2B <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          <Link to="/guias-prepagadas" data-testid="dual-cta-prepago" className="relative aspect-[4/5] md:aspect-auto md:h-[520px] overflow-hidden group bg-[#3DAE2B] border border-[#3DAE2B] hover-lift rounded-3xl">
            <img src="https://images.unsplash.com/photo-1766040923580-16ad32fae8b4" alt="Guías Prepagadas" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-bl from-[#3DAE2B]/95 via-[#3DAE2B]/80 to-[#2c8a1f]/95 rounded-3xl" />
            <div className="relative h-full p-10 md:p-14 flex flex-col justify-between text-white">
              <ShieldCheck size={36} />
              <div>
                <div className="text-overline-on-dark mb-3" style={{ color: "rgba(255,255,255,0.85)" }}>Guías Prepagadas</div>
                <h3 className="font-display text-5xl md:text-6xl">Impulsa tus ventas</h3>
                <p className="text-white/85 mt-5 max-w-md">Paquetes a precios preferenciales para que aceleres tus envíos sin complicaciones.</p>
                <div className="mt-8 inline-flex items-center gap-2 text-white font-medium">
                  Ver planes prepago <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── COVERAGE — light section with city grid ─── */}
      <section id="cobertura" className="py-20 bg-gray-50">
        <div className="container-pmm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
            {/* Left: text */}
            <div className="flex-1 max-w-md">
              <span className="text-overline-light">Presencia Nacional</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1E008D] mt-3 mb-6">
                {coverage.total_ciudades}+ ciudades,<br />un solo estándar de calidad
              </h2>
              <p className="text-[#2D2D2D]/70 leading-relaxed mb-8">
                Desde CDMX hasta las principales capitales del país, nuestra red logística está diseñada para conectar tu negocio con todo México. {coverage.total_estados}+ estados cubiertos con presencia directa.
              </p>
              <Link
                to="/cobertura"
                className="inline-flex items-center gap-2 text-[#1E008D] font-bold hover:gap-4 transition-all group"
              >
                Ver cobertura detallada
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: city grid */}
            <div className="flex-1 w-full grid grid-cols-3 gap-3">
              {CITIES.map((c) =>
                c === "Ciudad de México" ? (
                  <div
                    key={c}
                    className="border-2 border-[#1E008D]/30 bg-[#1E008D]/5 rounded-xl p-4 hover:border-[#1E008D] hover:shadow-md transition-all col-span-1"
                  >
                    <Truck size={14} className="text-[#3DAE2B] mb-2" />
                    <span className="font-display text-sm text-[#1E008D] leading-tight block">
                      Ciudad de México
                    </span>
                  </div>
                ) : (
                  <div
                    key={c}
                    className="border border-gray-200 bg-white rounded-xl p-4 font-mono text-xs uppercase tracking-wider text-[#6B6B6B] hover:text-[#1E008D] hover:border-[#1E008D]/30 hover:shadow-md transition-all"
                  >
                    <Truck size={14} className="text-[#3DAE2B] mb-2" />
                    {c}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSIGHTS / BLOG — light ─── */}
      {posts.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-pmm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <div className="text-overline mb-4">Insights logísticos</div>
                <h2 className="font-display text-5xl md:text-6xl text-[#2D2D2D] max-w-2xl">
                  Conocimiento que mueve negocios.
                </h2>
              </div>
              <Link to="/blog" className="text-[#1E008D] nav-underline text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2">
                Ver blog <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden mb-5 bg-[#F0F0F0] rounded-2xl">
                    <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="text-overline mb-3">{p.category} · {p.read_time}</div>
                  <h3 className="font-display-medium text-2xl text-[#2D2D2D] leading-tight group-hover:text-[#1E008D] transition-colors">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
