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
    <div data-testid="tracking-widget" className={`${inline ? "" : "bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-8 md:p-10"}`}>
      <div className="text-overline mb-2">Rastreo de pedido</div>
      <h3 className="font-display text-3xl text-white mb-6">¿Dónde está mi paquete?</h3>
      <form onSubmit={search} className="flex flex-col sm:flex-row gap-3">
        <input
          data-testid="tracking-input"
          value={guia}
          onChange={(e) => setGuia(e.target.value)}
          placeholder="PMM-12345678"
          className="flex-1 bg-transparent border border-zinc-700 focus:border-[#E30613] py-4 px-5 text-white placeholder-zinc-600 font-mono focus:outline-none transition-colors"
        />
        <button
          type="submit"
          data-testid="tracking-submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#FF1A27] text-white px-7 py-4 font-semibold transition-all active:scale-95 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <><Search size={18} /> Rastrear</>}
        </button>
      </form>

      {error && (
        <div data-testid="tracking-error" className="mt-6 border border-red-500/30 bg-red-500/5 text-red-400 text-sm px-4 py-3 font-mono">
          {error}
        </div>
      )}

      {data && (
        <div data-testid="tracking-result" className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-white/10">
            <div>
              <div className="text-overline mb-1">Guía</div>
              <div className="font-mono text-white">{data.guia}</div>
            </div>
            <div>
              <div className="text-overline mb-1">Estado</div>
              <div className="text-white font-medium">{data.estado_actual}</div>
            </div>
            <div>
              <div className="text-overline mb-1">Origen → Destino</div>
              <div className="text-white text-sm">{data.origen} → {data.destino}</div>
            </div>
            <div>
              <div className="text-overline mb-1">Entrega estimada</div>
              <div className="font-mono text-white">{data.fecha_estimada}</div>
            </div>
          </div>

          <div className="space-y-1">
            {data.eventos.map((ev, idx) => {
              const Icon = iconFor(ev.status);
              const last = idx === data.eventos.length - 1;
              return (
                <div key={idx} className="flex gap-5 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${last ? "bg-[#E30613]" : "bg-zinc-800 border border-zinc-700"}`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    {!last && <div className="w-px flex-1 bg-zinc-800 my-1" style={{ minHeight: 40 }} />}
                  </div>
                  <div className="pb-8">
                    <div className="font-mono text-xs text-zinc-500">
                      {new Date(ev.timestamp).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })} · {ev.location}
                    </div>
                    <div className="text-white font-medium mt-1">{ev.status}</div>
                    <div className="text-zinc-400 text-sm mt-0.5">{ev.description}</div>
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
