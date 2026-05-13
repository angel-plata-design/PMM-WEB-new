import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowUpRight } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import pmmApi from "../lib/api";

export default function Servicios({ audience = "empresas" }) {
  const [services, setServices] = useState([]);
  useEffect(() => {
    pmmApi.services().then(setServices).catch(() => {
      // Fallback estático si la API no responde
      setServices([
        {
          key: "entrega-detalle",
          name: "Entrega a Detalle",
          description: "Revisión de mercancía frente al cliente al momento de la entrega. Incluye acuse firmado y verificación de estado del paquete.",
          bullets: ["Acuse firmado por el destinatario", "Verificación de integridad", "Evidencia fotográfica disponible", "Ideal para artículos de valor"],
          image: "https://images.pexels.com/photos/30341205/pexels-photo-30341205.jpeg",
        },
        {
          key: "por-cobrar",
          name: "Servicio por Cobrar",
          description: "El destinatario cubre el costo del flete al recibir el paquete. Solución ideal para e-commerce y ventas en línea.",
          bullets: ["Sin inversión inicial del remitente", "Pago en efectivo o tarjeta en destino", "Ideal para e-commerce", "Cobertura nacional"],
          image: "https://images.unsplash.com/photo-1775756789951-3f2ef4307258",
        },
        {
          key: "retorno-evidencias",
          name: "Retorno de Evidencias",
          description: "Gestión y regreso de documentos firmados, facturas originales y acuses de recibo a tu domicilio.",
          bullets: ["Retorno de facturas y documentos", "Acuses originales firmados", "Trazabilidad completa", "Para procesos administrativos y legales"],
          image: "https://images.unsplash.com/photo-1762320723943-527ff68405c3",
        },
        {
          key: "ocurre",
          name: "Servicio Ocurre",
          description: "El destinatario recoge su paquete directamente en la sucursal PMM más cercana a su domicilio.",
          bullets: ["Sin necesidad de estar en casa", "Retiro en horario flexible", "Múltiples sucursales", "Notificación por WhatsApp"],
          image: "https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg",
        },
      ]);
    });
  }, [audience]);

  const isB2B = audience === "empresas";

  return (
    <>
      <Seo
        title={isB2B ? "Servicios para empresas (B2B)" : "Servicios para personas"}
        description={isB2B
          ? "Soluciones logísticas integrales B2B: entrega a detalle, servicio por cobrar, retorno de evidencias y ocurre. Cobertura nacional PMM."
          : "Envía y recibe paquetes con PMM. Servicios pensados para personas y pequeños negocios en todo México."}
        path={isB2B ? "/servicios/empresas" : "/servicios/personas"}
      />
      <PageHeader
        overline={isB2B ? "B2B Logística" : "Para personas"}
        title={isB2B
          ? <>Soluciones <em className="not-italic text-[#3DAE2B]">integrales</em><br />para tu cadena de suministro.</>
          : <>Envía como <em className="not-italic text-[#3DAE2B]">grande,</em><br />paga como persona.</>}
        description={isB2B
          ? "Trato dedicado, tarifas preferenciales y herramientas operativas para mover tu logística sin fricción."
          : "Cotiza, envía y rastrea con la misma confiabilidad de los grandes. Sin contratos ni mínimos."}
        breadcrumbs={[{ label: "Servicios", to: "/servicios/empresas" }, { label: isB2B ? "Empresas" : "Personas" }]}
        image={isB2B ? "https://images.unsplash.com/photo-1775756789951-3f2ef4307258" : "https://images.unsplash.com/photo-1762320723943-527ff68405c3"}
      />

      <section className="section-pad">
        <div className="container-pmm grid grid-cols-1 lg:grid-cols-2 gap-10">
          {services.map((s) => (
            <div key={s.key} id={s.key} data-testid={`service-${s.key}`} className="border border-[#E5E5E5] hover:border-[#1E008D]/40 group hover-lift">
              <div className="aspect-[16/9] overflow-hidden bg-[#F5F5F5]">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="p-8 md:p-10">
                <div className="text-overline mb-4">Servicio · {s.key}</div>
                <h3 className="font-display text-4xl text-[#2D2D2D] tracking-tight mb-4">{s.name}</h3>
                <p className="text-[#6B6B6B] leading-relaxed">{s.description}</p>
                <ul className="mt-6 space-y-3">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#2D2D2D] text-sm">
                      <Check size={16} className="text-[#1E008D] mt-0.5 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
                <Link to={isB2B ? "/contacto" : "/cotizador"} className="mt-8 inline-flex items-center gap-2 text-[#2D2D2D] nav-underline text-sm uppercase tracking-wider font-medium">
                  {isB2B ? "Solicitar plan B2B" : "Cotizar este servicio"} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad border-t border-[#EFEFEF]">
        <div className="container-pmm flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="text-overline mb-6">{isB2B ? "Plan corporativo" : "¿Listo para enviar?"}</div>
            <h2 className="font-display text-5xl md:text-6xl text-[#2D2D2D] tracking-tighter leading-[0.95]">
              {isB2B ? "Habla con un ejecutivo y diseñamos tu plan." : "Cotiza tu envío y agéndalo en minutos."}
            </h2>
          </div>
          <Link to={isB2B ? "/contacto" : "/cotizador"} className="bg-[#1E008D] hover:bg-[#2A0FB0] text-white px-8 py-5 font-semibold shrink-0">
            {isB2B ? "Contactar a ventas" : "Cotizar ahora"}
          </Link>
        </div>
      </section>
    </>
  );
}
