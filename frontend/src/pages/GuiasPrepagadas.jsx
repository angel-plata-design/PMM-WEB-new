import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";

const PLANS = [
  { name: "Starter", price: 990, envios: 10, peso: "Hasta 5 kg", best: false, perks: ["Cobertura nacional", "Validez 12 meses", "Sin contratación"] },
  { name: "Pro", price: 4490, envios: 50, peso: "Hasta 5 kg", best: true, perks: ["Cobertura nacional", "Atención dedicada", "Validez 12 meses", "Retorno de evidencias"] },
  { name: "Business", price: 8490, envios: 100, peso: "Hasta 10 kg", best: false, perks: ["Cobertura nacional + ocurre", "Ejecutivo asignado", "Reportes mensuales", "Tarifas preferenciales"] },
];

export default function GuiasPrepagadas() {
  return (
    <>
      <Seo
        title="Guías Prepagadas"
        description="Paquetes de guías PMM a precios preferenciales. Impulsa las ventas de tu negocio con envíos prepagados y cobertura nacional."
        path="/guias-prepagadas"
      />
      <PageHeader
        overline="Guías Prepagadas"
        title={<>Impulsa tus ventas<br /><em className="not-italic text-[#3DAE2B]">con precios fijos.</em></>}
        description="Adquiere paquetes de guías PMM a precios preferenciales. Genera, etiqueta y entrega — sin sorpresas de tarifa."
        breadcrumbs={[{ label: "Guías Prepagadas" }]}
        image="https://images.unsplash.com/photo-1766040923580-16ad32fae8b4"
      />
      <section className="section-pad">
        <div className="container-pmm grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div
              key={p.name}
              data-testid={`plan-${p.name.toLowerCase()}`}
              className={`relative border p-8 md:p-10 hover-lift ${p.best ? "border-[#1E008D] bg-gradient-to-b from-[#1E008D]/10 to-transparent" : "border-[#E5E5E5]"}`}
            >
              {p.best && (
                <div className="absolute -top-3 left-8 bg-[#1E008D] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#2D2D2D]">
                  Más elegido
                </div>
              )}
              <div className="text-overline mb-3">Plan</div>
              <h3 className="font-display text-4xl text-[#2D2D2D] tracking-tight">{p.name}</h3>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-6xl text-[#2D2D2D]">${p.price.toLocaleString("es-MX")}</span>
                <span className="text-[#6B6B6B] font-mono text-sm">MXN</span>
              </div>
              <div className="text-[#6B6B6B] mt-2 text-sm">{p.envios} guías · {p.peso}</div>
              <ul className="mt-8 space-y-3 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-[#2D2D2D]">
                    <Check size={16} className="text-[#1E008D] mt-0.5" /> {perk}
                  </li>
                ))}
              </ul>
              <Link to="/contacto" className={`mt-10 inline-flex w-full justify-center py-4 font-semibold transition-all active:scale-95 ${p.best ? "bg-[#1E008D] hover:bg-[#2A0FB0] text-[#2D2D2D]" : "border border-white/20 hover:border-white text-[#2D2D2D]"}`}>
                Contratar
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
