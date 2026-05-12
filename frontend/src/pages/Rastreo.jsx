import React from "react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import TrackingWidget from "../components/TrackingWidget";

export default function Rastreo() {
  return (
    <>
      <Seo
        title="Rastreo de envíos"
        description="Rastrea tu paquete PMM en tiempo real. Ingresa tu número de guía y consulta la línea de tiempo completa."
        path="/rastreo"
      />
      <PageHeader
        overline="Rastreo"
        title={<>¿Dónde<br /><em className="not-italic text-[#3DAE2B]">está mi envío?</em></>}
        description="Ingresa tu número de guía PMM y consulta la línea de tiempo completa: desde la recolección hasta la entrega."
        breadcrumbs={[{ label: "Rastreo" }]}
        image="https://images.pexels.com/photos/30341205/pexels-photo-30341205.jpeg"
      />
      <section className="section-pad">
        <div className="container-pmm max-w-4xl">
          <TrackingWidget />
          <div className="mt-12 border border-[#E5E5E5] p-8">
            <div className="text-overline mb-3">¿No encuentras tu guía?</div>
            <h3 className="font-display text-2xl text-[#2D2D2D]">Verifica con quien generó tu envío.</h3>
            <p className="text-[#6B6B6B] mt-3 text-sm leading-relaxed">
              El número de guía PMM lo proporciona quien generó el envío. Tiene formato PMM-XXXXXXXX. Si llevas más de 48 horas sin movimiento, escríbenos a <span className="text-[#2D2D2D]">atencion@pmm.com.mx</span>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
