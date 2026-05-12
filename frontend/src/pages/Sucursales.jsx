import React, { useEffect, useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import pmmApi from "../lib/api";

export default function Sucursales() {
  const [branches, setBranches] = useState([]);
  useEffect(() => { pmmApi.branches().then(setBranches).catch(() => {}); }, []);

  // LocalBusiness Schema for all branches
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
        description="Directorio de sucursales PMM en México. Encuentra dirección, teléfono y horarios de tu sucursal más cercana."
        path="/sucursales"
        jsonLd={branches.length > 0 ? schema : undefined}
      />
      <PageHeader
        overline="Sucursales"
        title={<>Nuestra red.<br /><em className="not-italic text-[#E30613]">Tu cercanía.</em></>}
        description="Visita una de nuestras sucursales para enviar, recoger paquetes o resolver dudas directamente con nuestro equipo."
        breadcrumbs={[{ label: "Sucursales" }]}
      />
      <section className="section-pad">
        <div className="container-pmm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <article key={b.id} data-testid={`sucursal-${b.id}`} className="border border-white/10 p-8 hover-lift hover:border-[#E30613]/40">
              <div className="text-overline mb-3">{b.estado}</div>
              <h3 className="font-display text-3xl text-white tracking-tight mb-4">{b.ciudad}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2 text-zinc-300"><MapPin size={14} className="text-[#E30613] mt-1 shrink-0" /> {b.direccion}</div>
                <div className="flex gap-2 text-zinc-400"><Phone size={14} className="text-zinc-500 mt-1 shrink-0" /> {b.telefono}</div>
                <div className="flex gap-2 text-zinc-400"><Clock size={14} className="text-zinc-500 mt-1 shrink-0" /> {b.horario}</div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 font-mono text-xs text-zinc-500">CP base · {b.cp}</div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
