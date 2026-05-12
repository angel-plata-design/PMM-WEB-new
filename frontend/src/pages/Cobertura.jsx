import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Phone, Clock } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import pmmApi from "../lib/api";

export default function Cobertura() {
  const [branches, setBranches] = useState([]);
  const [filter, setFilter] = useState("");
  const [coverage, setCoverage] = useState({ total_estados: 16, total_ciudades: 29 });

  useEffect(() => {
    pmmApi.branches().then(setBranches).catch(() => {});
    pmmApi.coverage().then(setCoverage).catch(() => {});
  }, []);

  const filtered = branches.filter((b) =>
    !filter ||
    b.ciudad.toLowerCase().includes(filter.toLowerCase()) ||
    b.estado.toLowerCase().includes(filter.toLowerCase()) ||
    b.cp.startsWith(filter)
  );

  return (
    <>
      <Seo
        title="Cobertura nacional"
        description={`Cobertura PMM en ${coverage.total_estados}+ estados y ${coverage.total_ciudades}+ ciudades de México. Busca por código postal o ciudad.`}
        path="/cobertura"
      />
      <PageHeader
        overline="Cobertura nacional"
        title={<>Cada vez<br /><em className="not-italic text-[#3DAE2B]">más cerca</em> de ti.</>}
        description={`Operamos en ${coverage.total_estados}+ estados y ${coverage.total_ciudades}+ ciudades de la República Mexicana. Encuentra tu sucursal y rutas disponibles.`}
        breadcrumbs={[{ label: "Cobertura" }]}
        image="https://images.unsplash.com/photo-1680546882156-fbabe4acb54d"
      />
      <section className="section-pad">
        <div className="container-pmm">
          <div className="relative max-w-2xl mb-12">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              data-testid="coverage-search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar por ciudad, estado o CP"
              className="w-full bg-transparent border border-[#E5E5E5] focus:border-[#1E008D] py-4 pl-14 pr-5 text-[#2D2D2D] placeholder-[#B8B8B8] font-mono focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((b) => (
              <div key={b.id} data-testid={`branch-${b.id}`} className="border border-[#E5E5E5] p-7 hover-lift hover:border-[#1E008D]/40 group">
                <MapPin size={20} className="text-[#1E008D] mb-4" />
                <div className="text-overline mb-2">{b.estado}</div>
                <h3 className="font-display text-2xl text-[#2D2D2D] tracking-tight mb-3">{b.nombre}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{b.direccion}</p>
                <div className="mt-5 pt-5 border-t border-[#EFEFEF] space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#6B6B6B]"><Phone size={14} className="text-[#6B6B6B]" /> {b.telefono}</div>
                  <div className="flex items-center gap-2 text-[#6B6B6B]"><Clock size={14} className="text-[#6B6B6B]" /> {b.horario}</div>
                  <div className="font-mono text-xs text-[#6B6B6B] pt-2">CP base: {b.cp}</div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-[#6B6B6B] text-center py-20 font-mono text-sm">Sin resultados. Intenta con otra ciudad o estado.</div>
          )}

          <div className="mt-20 border border-[#E5E5E5] bg-[#F5F5F5] p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-overline mb-3">¿No ves tu ciudad?</div>
              <h3 className="font-display text-4xl text-[#2D2D2D] tracking-tight">Cotiza tu ruta y exploramos cobertura especial.</h3>
            </div>
            <Link to="/contacto" className="bg-[#1E008D] hover:bg-[#2A0FB0] text-[#2D2D2D] px-7 py-4 font-semibold shrink-0">Contactar</Link>
          </div>
        </div>
      </section>
    </>
  );
}
