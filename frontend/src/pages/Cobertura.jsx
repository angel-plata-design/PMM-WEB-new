import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import SucursalesMap from "../components/SucursalesMap";
import pmmApi from "../lib/api";

const BRANCHES_FALLBACK = [
  { id: "suc-cdmx-centro", nombre: "PMM CDMX Centro",       estado: "Ciudad de México", ciudad: "Ciudad de México",  direccion: "Av. Insurgentes Sur 1234, Col. Del Valle",         telefono: "55 5555 1001", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "03100", lat: 19.3878, lng: -99.1773 },
  { id: "suc-gdl",         nombre: "PMM Guadalajara",        estado: "Jalisco",          ciudad: "Guadalajara",       direccion: "Av. López Mateos Sur 2200, Col. Cd. del Sol",      telefono: "33 3333 2002", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "45050", lat: 20.6597, lng: -103.3496 },
  { id: "suc-mty",         nombre: "PMM Monterrey",          estado: "Nuevo León",       ciudad: "Monterrey",         direccion: "Av. Gonzalitos 500, Col. Vista Hermosa",           telefono: "81 8181 3003", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "64620", lat: 25.6866, lng: -100.3161 },
  { id: "suc-pue",         nombre: "PMM Puebla",             estado: "Puebla",           ciudad: "Puebla",            direccion: "Blvd. Atlixco 1500, Col. La Paz",                  telefono: "222 222 4004", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "72160", lat: 19.0414, lng: -98.2063 },
  { id: "suc-qro",         nombre: "PMM Querétaro",          estado: "Querétaro",        ciudad: "Querétaro",         direccion: "Av. 5 de Febrero 400, Col. Niños Héroes",          telefono: "442 442 5005", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "76010", lat: 20.5888, lng: -100.3899 },
  { id: "suc-leon",        nombre: "PMM León",               estado: "Guanajuato",       ciudad: "León",              direccion: "Blvd. Adolfo López Mateos 800, Col. Centro",       telefono: "477 477 6006", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "37000", lat: 21.1250, lng: -101.6859 },
  { id: "suc-mer",         nombre: "PMM Mérida",             estado: "Yucatán",          ciudad: "Mérida",            direccion: "Calle 60 Norte 299, Col. Altabrisa",               telefono: "999 999 7007", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "97130", lat: 20.9674, lng: -89.5926 },
  { id: "suc-tij",         nombre: "PMM Tijuana",            estado: "Baja California",  ciudad: "Tijuana",           direccion: "Blvd. Agua Caliente 4500, Col. Aviación",          telefono: "664 664 8008", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "22014", lat: 32.5149, lng: -117.0382 },
  { id: "suc-ver",         nombre: "PMM Veracruz",           estado: "Veracruz",         ciudad: "Veracruz",          direccion: "Av. Cuauhtémoc 1200, Col. Centro",                 telefono: "229 229 9009", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "91700", lat: 19.1738, lng: -96.1342 },
  { id: "suc-cun",         nombre: "PMM Cancún",             estado: "Quintana Roo",     ciudad: "Cancún",            direccion: "Av. Tulum 200, SM 4",                              telefono: "998 998 1010", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "77500", lat: 21.1619, lng: -86.8515 },
  { id: "suc-slp",         nombre: "PMM San Luis Potosí",    estado: "San Luis Potosí",  ciudad: "San Luis Potosí",   direccion: "Av. Carranza 1500, Col. Tequisquiapan",            telefono: "444 444 1111", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "78250", lat: 22.1565, lng: -100.9855 },
  { id: "suc-mor",         nombre: "PMM Morelia",            estado: "Michoacán",        ciudad: "Morelia",           direccion: "Av. Camelinas 3300, Col. Félix Ireta",             telefono: "443 443 1212", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "58070", lat: 19.7008, lng: -101.1844 },
  { id: "suc-tol",         nombre: "PMM Toluca",             estado: "Estado de México", ciudad: "Toluca",            direccion: "Paseo Tollocan 800, Col. Centro",                  telefono: "722 722 1313", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "50000", lat: 19.2826, lng: -99.6557 },
  { id: "suc-agu",         nombre: "PMM Aguascalientes",     estado: "Aguascalientes",   ciudad: "Aguascalientes",    direccion: "Av. Aguascalientes 100, Col. Bosques",             telefono: "449 449 1414", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "20127", lat: 21.8853, lng: -102.2916 },
  { id: "suc-her",         nombre: "PMM Hermosillo",         estado: "Sonora",           ciudad: "Hermosillo",        direccion: "Blvd. Kino 500, Col. Pitic",                       telefono: "662 662 1515", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "83150", lat: 29.0729, lng: -110.9559 },
  { id: "suc-chi",         nombre: "PMM Chihuahua",          estado: "Chihuahua",        ciudad: "Chihuahua",         direccion: "Av. Tecnológico 2900, Col. Magisterial",           telefono: "614 614 1616", horario: "L-V 9:00-19:00, S 9:00-14:00", cp: "31200", lat: 28.6353, lng: -106.0889 },
];

export default function Cobertura() {
  const [branches, setBranches] = useState([]);
  const [coverage, setCoverage] = useState({ total_estados: 16, total_ciudades: 29 });

  useEffect(() => {
    pmmApi.branches().then(setBranches).catch(() => setBranches(BRANCHES_FALLBACK));
    pmmApi.coverage().then(setCoverage).catch(() => {});
  }, []);

  return (
    <>
      <Seo
        title="Cobertura y Sucursales"
        description={`Cobertura PMM en ${coverage.total_estados}+ estados y ${coverage.total_ciudades}+ ciudades de México. Mapa interactivo con buscador por código postal o ciudad.`}
        path="/cobertura"
      />
      <PageHeader
        overline="Cobertura nacional"
        title={<>Cada vez<br /><em className="not-italic text-[#3DAE2B]">más cerca</em> de ti.</>}
        description={`Operamos en ${coverage.total_estados}+ estados y ${coverage.total_ciudades}+ ciudades de la República Mexicana. Explora el mapa y encuentra tu sucursal más cercana.`}
        breadcrumbs={[{ label: "Cobertura" }]}
        image="https://images.unsplash.com/photo-1680546882156-fbabe4acb54d"
      />

      {/* Mapa interactivo */}
      <section className="section-pad">
        <div className="container-pmm">
          <SucursalesMap branches={branches} />
        </div>
      </section>

      {/* Listado de sucursales */}
      <section className="pb-24">
        <div className="container-pmm">
          <div className="text-overline mb-3">Directorio completo</div>
          <h2 className="font-display text-4xl md:text-5xl text-[#2D2D2D] mb-12">
            Todas nuestras sucursales en México.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((b) => (
              <article key={b.id} className="border border-[#E5E5E5] bg-white p-8 hover-lift hover:border-[#1E008D]/40 hover:shadow-[0_20px_40px_-25px_rgba(30,0,141,0.25)]">
                <MapPin size={18} className="text-[#1E008D] mb-4" />
                <div className="text-overline mb-2">{b.estado}</div>
                <h3 className="font-display text-2xl text-[#2D2D2D] mb-4">{b.ciudad}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2 text-[#2D2D2D]"><MapPin size={14} className="text-[#1E008D] mt-1 shrink-0" /> {b.direccion}</div>
                  <div className="flex gap-2 text-[#6B6B6B]"><Phone size={14} className="text-[#6B6B6B] mt-1 shrink-0" /> {b.telefono}</div>
                  <div className="flex gap-2 text-[#6B6B6B]"><Clock size={14} className="text-[#6B6B6B] mt-1 shrink-0" /> {b.horario}</div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#E5E5E5] flex items-center justify-between">
                  <div className="font-mono text-xs text-[#6B6B6B]">CP {b.cp}</div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#3DAE2B]">Activa</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container-pmm bg-[#1E008D] text-white p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-overline-on-dark mb-3">¿No ves tu ciudad?</div>
            <h3 className="font-display text-4xl md:text-5xl">Cotiza tu ruta y exploramos cobertura especial.</h3>
            <p className="text-white/80 mt-3 max-w-lg">Para envíos B2B regulares, evaluamos rutas dedicadas fuera de nuestra red estándar.</p>
          </div>
          <Link to="/contacto" className="bg-[#3DAE2B] hover:bg-[#339224] text-white px-8 py-4 font-semibold inline-flex items-center gap-2 shrink-0 transition-all active:scale-95">
            Contactar a ventas
          </Link>
        </div>
      </section>
    </>
  );
}


      <PageHeader
        overline="Cobertura nacional"
        title={<>Cada vez<br /><em className="not-italic text-[#3DAE2B]">más cerca</em> de ti.</>}
        description={`Operamos en ${coverage.total_estados}+ estados y ${coverage.total_ciudades}+ ciudades de la República Mexicana. Explora el mapa interactivo y encuentra tu plaza más cercana.`}
        breadcrumbs={[{ label: "Cobertura" }]}
        image="https://images.unsplash.com/photo-1680546882156-fbabe4acb54d"
      />

      <section className="section-pad">
        <div className="container-pmm">
          {branches.length > 0 && <SucursalesMap branches={branches} />}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-pmm bg-[#1E008D] text-white p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-overline-on-dark mb-3">¿No ves tu ciudad?</div>
            <h3 className="font-display text-4xl md:text-5xl">Cotiza tu ruta y exploramos cobertura especial.</h3>
            <p className="text-white/80 mt-3 max-w-lg">Para envíos B2B regulares, evaluamos rutas dedicadas fuera de nuestra red estándar.</p>
          </div>
          <Link to="/contacto" className="bg-[#3DAE2B] hover:bg-[#339224] text-white px-8 py-4 font-semibold inline-flex items-center gap-2 shrink-0 transition-all active:scale-95">
            Contactar a ventas
          </Link>
        </div>
      </section>
    </>
  );
}
