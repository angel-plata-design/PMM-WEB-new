import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import SucursalesMap from "../components/SucursalesMap";
import pmmApi from "../lib/api";

export default function Cobertura() {
  const [branches, setBranches] = useState([]);
  const [coverage, setCoverage] = useState({ total_estados: 16, total_ciudades: 29 });

  useEffect(() => {
    pmmApi.branches().then(setBranches).catch(() => {});
    pmmApi.coverage().then(setCoverage).catch(() => {});
  }, []);

  return (
    <>
      <Seo
        title="Cobertura nacional"
        description={`Cobertura PMM en ${coverage.total_estados}+ estados y ${coverage.total_ciudades}+ ciudades de México. Mapa interactivo con buscador por código postal o ciudad.`}
        path="/cobertura"
      />
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
