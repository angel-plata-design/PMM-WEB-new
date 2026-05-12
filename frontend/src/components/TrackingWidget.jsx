import React, { useState } from "react";
import { Search, Loader2, Package, CheckCircle2, Truck, MapPin } from "lucide-react";
import pmmApi from "../lib/api";

export default function TrackingWidget({ inline = false }) {
  const [guia, setGuia] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (e) => {
    e.preventDefault();
    if (!guia.trim()) return;
    setError(""); setData(null); setLoading(true);
    try {
      const r = await pmmApi.tracking(guia.trim());
      setData(r);
    } catch (err) {
      setError(err?.response?.data?.detail || "Guía no encontrada");
    } finally { setLoading(false); }
  };

  const iconFor = (status) => {
    if (status.includes("Recolectado")) return Package;
    if (status.includes("tránsito") || status.includes("transito")) return Truck;
    if (status.includes("clasificación")) return Package;
    if (status.includes("sucursal")) return MapPin;
    if (status.includes("Entregado")) return CheckCircle2;
    return Package;
  };

  return (
    <div data-testid="tracking-widget" className={`${inline ? "" : "bg-white border border-[#E5E5E5] p-8 md:p-10 shadow-[0_20px_50px_-30px_rgba(30,0,141,0.2)]"}`}>
      <div className="text-overline mb-2">Rastreo de pedido</div>
      <h3 className="font-display text-3xl md:text-4xl text-[#2D2D2D] mb-6">¿Dónde está mi paquete?</h3>
      <form onSubmit={search} className="flex flex-col sm:flex-row gap-3">
        <input
          data-testid="tracking-input"
          value={guia}
          onChange={(e) => setGuia(e.target.value)}
          placeholder="PMM-12345678"
          className="flex-1 bg-[#FAFAFA] border border-[#E5E5E5] focus:border-[#1E008D] py-4 px-5 text-[#2D2D2D] placeholder-[#B8B8B8] font-mono focus:outline-none transition-colors"
        />
        <button
          type="submit"
          data-testid="tracking-submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 btn-primary px-7 py-4 font-semibold disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <><Search size={18} /> Rastrear</>}
        </button>
      </form>

      {error && (
        <div data-testid="tracking-error" className="mt-6 border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-3 font-mono">
          {error}
        </div>
      )}

      {data && (
        <div data-testid="tracking-result" className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-[#E5E5E5]">
            <div>
              <div className="text-overline mb-1">Guía</div>
              <div className="font-mono text-[#2D2D2D]">{data.guia}</div>
            </div>
            <div>
              <div className="text-overline mb-1">Estado</div>
              <div className="text-[#2D2D2D] font-semibold">{data.estado_actual}</div>
            </div>
            <div>
              <div className="text-overline mb-1">Origen → Destino</div>
              <div className="text-[#2D2D2D] text-sm">{data.origen} → {data.destino}</div>
            </div>
            <div>
              <div className="text-overline mb-1">Entrega estimada</div>
              <div className="font-mono text-[#3DAE2B]">{data.fecha_estimada}</div>
            </div>
          </div>

          <div className="space-y-1">
            {data.eventos.map((ev, idx) => {
              const Icon = iconFor(ev.status);
              const last = idx === data.eventos.length - 1;
              return (
                <div key={idx} className="flex gap-5 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${last ? "bg-[#1E008D] text-white" : "bg-white border border-[#E5E5E5] text-[#6B6B6B]"}`}>
                      <Icon size={16} />
                    </div>
                    {!last && <div className="w-px flex-1 bg-[#E5E5E5] my-1" style={{ minHeight: 40 }} />}
                  </div>
                  <div className="pb-8">
                    <div className="font-mono text-xs text-[#6B6B6B]">
                      {new Date(ev.timestamp).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })} · {ev.location}
                    </div>
                    <div className="text-[#2D2D2D] font-semibold mt-1">{ev.status}</div>
                    <div className="text-[#6B6B6B] text-sm mt-0.5">{ev.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
