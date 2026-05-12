import React, { useEffect, useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import SucursalesMap from "../components/SucursalesMap";
import pmmApi from "../lib/api";

export default function Sucursales() {
  const [branches, setBranches] = useState([]);
  useEffect(() => { pmmApi.branches().then(setBranches).catch(() => {}); }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": branches.map((b) => ({
      "@type": "LocalBusiness",
      "@id": `https://pmm.com.mx/sucursales#${b.id}`,
      name: b.nombre,
      address: {
        "@type": "PostalAddress",
        streetAddress: b.direccion,
        addressLocality: b.ciudad,
        addressRegion: b.estado,
        postalCode: b.cp,
        addressCountry: "MX",
      },
      telephone: b.telefono,
      openingHours: b.horario,
      geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng },
    })),
  };

  return (
    <>
      <Seo
        title="Sucursales PMM"
        description="Directorio interactivo de sucursales PMM en México. Encuentra dirección, teléfono y horarios de tu sucursal más cercana con mapa en tiempo real."
        path="/sucursales"
        jsonLd={branches.length > 0 ? schema : undefined}
      />
      <PageHeader
        overline="Sucursales"
        title={<>Nuestra red.<br /><em className="not-italic text-[#3DAE2B]">Tu cercanía.</em></>}
        description="Visita una de nuestras sucursales para enviar, recoger paquetes o resolver dudas. Explora el mapa interactivo y selecciona tu plaza."
        breadcrumbs={[{ label: "Sucursales" }]}
      />

      <section className="section-pad">
        <div className="container-pmm">
          {branches.length > 0 && <SucursalesMap branches={branches} />}
        </div>
      </section>

      {/* Full list grid below map */}
      <section className="pb-24">
        <div className="container-pmm">
          <div className="text-overline mb-3">Listado completo</div>
          <h2 className="font-display text-4xl md:text-5xl text-[#2D2D2D] mb-12">
            Todas nuestras sucursales en México.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((b) => (
              <article key={b.id} data-testid={`sucursal-${b.id}`} className="border border-[#E5E5E5] bg-white p-8 hover-lift hover:border-[#1E008D]/40 hover:shadow-[0_20px_40px_-25px_rgba(30,0,141,0.25)]">
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
    </>
  );
}
