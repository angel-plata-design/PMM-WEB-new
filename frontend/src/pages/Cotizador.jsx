import React from "react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import QuickQuote from "../components/QuickQuote";

export default function Cotizador() {
  return (
    <>
      <Seo
        title="Cotizador de envíos"
        description="Calcula al instante el costo de tu envío PMM. Origen, destino, peso y tipo de servicio. Resultados con IVA incluido."
        path="/cotizador"
      />
      <PageHeader
        overline="Cotizador"
        title={<>Tu envío,<br /><em className="not-italic text-[#E30613]">en segundos.</em></>}
        description="Ingresa los códigos postales, peso y tipo de servicio. Te entregamos un costo aproximado con IVA y tiempo de tránsito."
        breadcrumbs={[{ label: "Cotizador" }]}
        image="https://images.unsplash.com/photo-1775756789951-3f2ef4307258"
      />
      <section className="section-pad">
        <div className="container-pmm">
          <QuickQuote />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { t: "Peso volumétrico", d: "Calculamos largo × ancho × alto / 5000 y usamos el mayor entre peso real y volumétrico." },
              { t: "Estándar vs Express", d: "Estándar entrega en 2-4 días; Express en 24 hrs entre plazas conectadas." },
              { t: "Servicio por cobrar", d: "Disponible al generar la guía. El destinatario cubre el flete a la entrega." },
            ].map((c) => (
              <div key={c.t} className="border border-white/10 p-8">
                <div className="text-overline mb-3">Detalle</div>
                <h3 className="font-display text-2xl text-white">{c.t}</h3>
                <p className="text-zinc-400 mt-3 text-sm leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
