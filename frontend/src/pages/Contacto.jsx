import React, { useState } from "react";
import { Loader2, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import pmmApi from "../lib/api";

export default function Contacto() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    origen: "", destino: "", peso: "",
    tipo_cliente: "empresas", message: ""
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const payload = { ...form, peso: form.peso ? parseFloat(form.peso) : null };
      await pmmApi.createLead(payload);
      setSent(true);
    } catch {
      setError("No pudimos enviar el formulario. Intenta de nuevo o llámanos.");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-transparent border-0 border-b border-[#E5E5E5] focus:border-[#1E008D] py-3 px-0 text-[#2D2D2D] placeholder-[#B8B8B8] font-mono text-sm focus:outline-none transition-colors";

  return (
    <>
      <Seo
        title="Contacto"
        description="Habla con un ejecutivo PMM. Cotizaciones B2B, soporte y atención personalizada para tus envíos en México."
        path="/contacto"
      />
      <PageHeader
        overline="Contacto"
        title={<>Hablemos<br /><em className="not-italic text-[#3DAE2B]">de tus envíos.</em></>}
        description="Déjanos tus datos y un ejecutivo se pondrá en contacto. También puedes escribirnos por WhatsApp o llamarnos directamente."
        breadcrumbs={[{ label: "Contacto" }]}
      />
      <section className="section-pad">
        <div className="container-pmm grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            {sent ? (
              <div data-testid="contact-success" className="border border-[#1E008D]/40 bg-[#1E008D]/5 p-10">
                <div className="text-overline mb-3">¡Gracias!</div>
                <h3 className="font-display text-4xl text-[#2D2D2D] mb-3">Recibimos tu mensaje.</h3>
                <p className="text-[#2D2D2D]">Un ejecutivo te contactará en menos de 24 horas hábiles. Si tu solicitud es urgente, escríbenos por WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6" data-testid="contact-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-overline block mb-3">Nombre *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} data-testid="contact-name" /></div>
                  <div><label className="text-overline block mb-3">Empresa</label>
                    <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} data-testid="contact-company" /></div>
                  <div><label className="text-overline block mb-3">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} data-testid="contact-email" /></div>
                  <div><label className="text-overline block mb-3">Teléfono *</label>
                    <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} data-testid="contact-phone" /></div>
                  <div><label className="text-overline block mb-3">Origen</label>
                    <input value={form.origen} onChange={(e) => setForm({ ...form, origen: e.target.value })} placeholder="Ciudad / CP" className={inputCls} /></div>
                  <div><label className="text-overline block mb-3">Destino</label>
                    <input value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} placeholder="Ciudad / CP" className={inputCls} /></div>
                  <div><label className="text-overline block mb-3">Volumen mensual (envíos)</label>
                    <input value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} placeholder="ej. 200" className={inputCls} /></div>
                  <div><label className="text-overline block mb-3">Tipo de cliente</label>
                    <select value={form.tipo_cliente} onChange={(e) => setForm({ ...form, tipo_cliente: e.target.value })} className={inputCls + " cursor-pointer"}>
                      <option value="empresas" className="bg-[#F5F5F5]">Empresa</option>
                      <option value="personas" className="bg-[#F5F5F5]">Persona</option>
                    </select></div>
                </div>
                <div><label className="text-overline block mb-3">Mensaje</label>
                  <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls + " resize-none"} placeholder="Cuéntanos sobre tus necesidades logísticas" /></div>

                {error && <div className="border border-red-500/30 bg-red-500/5 text-red-400 text-sm px-4 py-3 font-mono">{error}</div>}

                <button type="submit" disabled={loading} data-testid="contact-submit" className="inline-flex items-center gap-3 bg-[#1E008D] hover:bg-[#2A0FB0] text-[#2D2D2D] px-8 py-5 font-semibold transition-all active:scale-95 disabled:opacity-60">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Enviar solicitud"}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="border border-[#E5E5E5] p-8">
              <div className="text-overline mb-3">Atención general</div>
              <div className="space-y-4 mt-4">
                <a href="tel:+528007666666" className="flex items-center gap-3 text-[#2D2D2D] hover:text-[#1E008D]"><Phone size={18} /> 800 PMM (766-6666)</a>
                <a href="mailto:atencion@pmm.com.mx" className="flex items-center gap-3 text-[#2D2D2D] hover:text-[#1E008D]"><Mail size={18} /> atencion@pmm.com.mx</a>
                <a href="https://wa.me/5216692705424" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#2D2D2D] hover:text-[#1E008D]"><MessageCircle size={18} /> WhatsApp directo</a>
              </div>
            </div>
            <div className="border border-[#E5E5E5] p-8">
              <div className="text-overline mb-3">Cobertura</div>
              <div className="flex items-center gap-3 text-[#2D2D2D] mt-4"><MapPin size={18} className="text-[#1E008D]" /> 16+ estados · 29+ ciudades</div>
              <p className="text-[#6B6B6B] text-sm mt-3">Si tu zona aún no aparece en cobertura, escríbenos para evaluar rutas especiales B2B.</p>
            </div>
            <div className="border border-[#1E008D] bg-[#1E008D]/10 p-8">
              <div className="text-overline mb-3">Soporte fiscal</div>
              <a href="mailto:facturacion@pmm.com.mx" className="text-[#2D2D2D] text-lg font-medium hover:underline">facturacion@pmm.com.mx</a>
              <p className="text-[#2D2D2D] text-sm mt-2">Aclaraciones, complementos de pago y cambios de uso de CFDI.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
