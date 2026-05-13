import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Package, HandCoins, FileCheck2, MapPin, Truck, Building2, ShieldCheck } from "lucide-react";
import Seo from "../components/Seo";
import HomeToolsPanel from "../components/HomeToolsPanel";
import pmmApi from "../lib/api";

const HERO_IMG = "https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg";

const SERVICES = [
  { key: "entrega-detalle", icon: Package, name: "Entrega a detalle", desc: "Revisión frente al cliente. Acuse firmado.", img: "https://images.unsplash.com/photo-1766040923580-16ad32fae8b4" },
  { key: "por-cobrar", icon: HandCoins, name: "Servicio por cobrar", desc: "El destinatario cubre el flete. Ideal e-commerce.", img: "https://images.unsplash.com/photo-1775756789951-3f2ef4307258" },
  { key: "retorno-evidencias", icon: FileCheck2, name: "Retorno de evidencias", desc: "Facturas, acuses y documentos firmados.", img: "https://images.pexels.com/photos/30341205/pexels-photo-30341205.jpeg" },
  { key: "ocurre", icon: MapPin, name: "Servicio ocurre", desc: "Entrega directa en sucursal al destinatario.", img: "https://images.unsplash.com/photo-1762320723943-527ff68405c3" },
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

export default function Home() {
  const [coverage, setCoverage] = useState({ total_estados: 16, total_ciudades: 29, anos_experiencia: 30 });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    pmmApi.coverage().then(setCoverage).catch(() => {});
    pmmApi.posts().then((p) => setPosts(p.slice(0, 4))).catch(() => {
      // Fallback estático si la API no responde
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

      {/* HERO — full bleed dark image with brand blue gradient */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden grain">
        <img src={HERO_IMG} alt="Operaciones PMM México" className="absolute inset-0 w-full h-full object-cover" />
        {/* dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E008D] via-[#1E008D]/55 to-[#1E008D]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E008D]/85 via-[#1E008D]/25 to-transparent" />

        <div className="container-pmm relative z-10 pt-32 pb-52">
          <div className="fade-up text-overline-on-dark mb-6">Orgullosamente mexicanos · Desde 1995</div>
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
                className="inline-flex items-center justify-center gap-3 bg-[#3DAE2B] hover:bg-[#339224] text-white px-8 py-5 font-semibold transition-all active:scale-95"
              >
                Ir a la tienda <ArrowRight size={18} />
              </Link>
              <Link
                to="/servicios/empresas"
                data-testid="hero-cta-empresas"
                className="inline-flex items-center justify-center gap-3 border border-white/30 hover:border-white text-white px-8 py-5 font-semibold transition-all hover:bg-white/5"
              >
                Soluciones B2B <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS PANEL — Cotizar + Rastrear */}
      <section className="container-pmm -mt-24 relative z-20 pb-20">
        <HomeToolsPanel />
      </section>

      {/* STATS — light editorial */}
      <section data-testid="stats-section" className="section-pad border-y border-[#E5E5E5]">
        <div className="container-pmm grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="text-overline mb-3">Experiencia</div>
            <div className="font-display text-7xl md:text-8xl text-[#2D2D2D]">{coverage.anos_experiencia}+</div>
            <div className="text-[#6B6B6B] text-sm mt-2 font-mono">Años en operación</div>
          </div>
          <div>
            <div className="text-overline mb-3">Cobertura</div>
            <div className="font-display text-7xl md:text-8xl text-[#2D2D2D]">{coverage.total_ciudades}+</div>
            <div className="text-[#6B6B6B] text-sm mt-2 font-mono">Ciudades activas</div>
          </div>
          <div>
            <div className="text-overline mb-3">Alcance</div>
            <div className="font-display text-7xl md:text-8xl text-[#2D2D2D]">{coverage.total_estados}+</div>
            <div className="text-[#6B6B6B] text-sm mt-2 font-mono">Estados de la república</div>
          </div>
          <div>
            <div className="text-overline mb-3">Volumen</div>
            <div className="font-display text-7xl md:text-8xl text-[#1E008D]">∞</div>
            <div className="text-[#6B6B6B] text-sm mt-2 font-mono">Capacidad B2B</div>
          </div>
        </div>
      </section>

      {/* INTRO EDITORIAL — light */}
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

      {/* SERVICES MOSAIC — dark band */}
      <section data-testid="services-mosaic" className="section-pad bg-[#2D2D2D]">
        <div className="container-pmm mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-overline-on-dark mb-4">Soluciones logísticas</div>
              <h2 className="font-display text-5xl md:text-6xl text-white max-w-2xl">
                Cuatro servicios. Una sola promesa.
              </h2>
            </div>
            <Link to="/servicios/empresas" className="text-white nav-underline text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2">
              Ver todo <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="container-pmm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            const span = idx === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5";
            const tall = idx === 0 ? "h-[560px]" : "h-[270px]";
            return (
              <Link
                key={s.key}
                to={`/servicios/empresas#${s.key}`}
                data-testid={`service-tile-${s.key}`}
                className={`${span} ${tall} relative overflow-hidden border border-white/10 hover-lift group bg-[#1f1f1f]`}
              >
                <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E008D] via-[#1E008D]/40 to-transparent" />
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                    <ArrowUpRight size={24} className="text-white opacity-70 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
                  </div>
                  <div>
                    <h3 className={`font-display text-white ${idx === 0 ? "text-5xl md:text-6xl" : "text-3xl"}`}>{s.name}</h3>
                    <p className="text-white/85 mt-3 max-w-md">{s.desc}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 bg-[#3DAE2B] w-0 group-hover:w-full transition-all duration-700" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* DUAL CTA — light bg with two dark cards */}
      <section className="section-pad">
        <div className="container-pmm grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/servicios/empresas" data-testid="dual-cta-empresas" className="relative aspect-[4/5] md:aspect-auto md:h-[520px] overflow-hidden group bg-[#1E008D] border border-[#1E008D] hover-lift">
            <img src="https://images.unsplash.com/photo-1775756789951-3f2ef4307258" alt="Empresas" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E008D]/95 via-[#1E008D]/80 to-[#1E008D]/95" />
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

          <Link to="/guias-prepagadas" data-testid="dual-cta-prepago" className="relative aspect-[4/5] md:aspect-auto md:h-[520px] overflow-hidden group bg-[#3DAE2B] border border-[#3DAE2B] hover-lift">
            <img src="https://images.unsplash.com/photo-1766040923580-16ad32fae8b4" alt="Guías Prepagadas" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-bl from-[#3DAE2B]/95 via-[#3DAE2B]/80 to-[#2c8a1f]/95" />
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

      {/* COVERAGE TEASER — dark/charcoal with light cards */}
      <section className="section-pad bg-[#2D2D2D] border-y border-white/5">
        <div className="container-pmm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="text-overline-on-dark mb-6">Cobertura</div>
            <h2 className="font-display text-5xl md:text-6xl text-white">
              Cada vez <em className="not-italic text-[#3DAE2B] font-display-medium">más cerca</em> de ti.
            </h2>
            <p className="text-white/70 mt-6 leading-relaxed max-w-md">
              Llegamos a los principales estados de la República. Consulta tu código postal y encuentra la sucursal más cercana.
            </p>
            <Link to="/cobertura" className="inline-flex items-center gap-2 mt-8 btn-primary px-7 py-4 font-semibold">
              Ver cobertura <ArrowRight size={18} />
            </Link>
          </div>
          <div className="lg:col-span-7 grid grid-cols-3 gap-3">
            {["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Querétaro", "León", "Mérida", "Tijuana", "Veracruz", "Cancún", "Hermosillo", "Chihuahua", "Aguascalientes", "Morelia", "Toluca"].map((c) => (
              <div key={c} className="border border-white/10 p-4 font-mono text-xs uppercase tracking-wider text-white/60 hover:text-white hover:border-[#3DAE2B] transition-all">
                <Truck size={14} className="text-[#3DAE2B] mb-2" />
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSIGHTS / BLOG — light */}
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
                  <div className="aspect-[4/5] overflow-hidden mb-5 bg-[#F0F0F0]">
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
