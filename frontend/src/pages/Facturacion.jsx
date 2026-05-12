import React, { useState } from "react";
import { Search, Loader2, FileText, Download } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import pmmApi from "../lib/api";

export default function Facturacion() {
  const [folio, setFolio] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (e) => {
    e.preventDefault();
    setError(""); setData(null); setLoading(true);
    try {
      const r = await pmmApi.invoice(folio.trim());
      setData(r);
    } catch (err) {
      setError(err?.response?.data?.detail || "Folio no encontrado");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Seo
        title="Facturación"
        description="Buscador de facturas PMM. Descarga tu CFDI XML y PDF ingresando tu folio o RFC."
        path="/facturacion"
      />
      <PageHeader
        overline="Facturación electrónica"
        title={<>Tu factura,<br /><em className="not-italic text-[#3DAE2B]">a un clic.</em></>}
        description="Ingresa tu folio PMM y descarga el CFDI en XML y PDF. Si necesitas ayuda, contáctanos al correo de soporte fiscal."
        breadcrumbs={[{ label: "Facturación" }]}
      />
      <section className="section-pad">
        <div className="container-pmm max-w-3xl">
          <form onSubmit={search} className="flex flex-col sm:flex-row gap-3">
            <input
              data-testid="invoice-input"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              placeholder="Folio PMM-XXXXX o RFC"
              className="flex-1 bg-transparent border border-[#E5E5E5] focus:border-[#1E008D] py-4 px-5 text-[#2D2D2D] placeholder-[#B8B8B8] font-mono focus:outline-none"
            />
            <button
              type="submit"
              data-testid="invoice-submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-[#1E008D] hover:bg-[#2A0FB0] text-[#2D2D2D] px-7 py-4 font-semibold disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Search size={18} /> Buscar</>}
            </button>
          </form>
          {error && (
            <div data-testid="invoice-error" className="mt-6 border border-red-500/30 bg-red-500/5 text-red-400 text-sm px-4 py-3 font-mono">{error}</div>
          )}
          {data && (
            <div data-testid="invoice-result" className="mt-10 border border-[#E5E5E5] p-8 md:p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-overline mb-2">Folio</div>
                  <h3 className="font-display text-3xl text-[#2D2D2D]">{data.folio}</h3>
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 border border-emerald-400/30 px-3 py-1">{data.estatus}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                <div><div className="text-overline mb-1">Fecha</div><div className="text-[#2D2D2D] font-mono">{data.fecha}</div></div>
                <div><div className="text-overline mb-1">Cliente</div><div className="text-[#2D2D2D]">{data.cliente}</div></div>
                <div><div className="text-overline mb-1">RFC</div><div className="text-[#2D2D2D] font-mono">{data.rfc}</div></div>
                <div><div className="text-overline mb-1">Subtotal</div><div className="text-[#2D2D2D] font-mono">${data.subtotal.toLocaleString("es-MX")}</div></div>
                <div><div className="text-overline mb-1">IVA</div><div className="text-[#2D2D2D] font-mono">${data.iva.toLocaleString("es-MX")}</div></div>
                <div><div className="text-overline mb-1">Total</div><div className="font-display text-2xl text-[#1E008D]">${data.total.toLocaleString("es-MX")}</div></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a href="#" className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 font-semibold hover:bg-zinc-200 transition-colors"><Download size={16} /> Descargar XML</a>
                <a href="#" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white text-[#2D2D2D] px-6 py-3 font-semibold"><FileText size={16} /> Descargar PDF</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
