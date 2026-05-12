import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import pmmApi from "../lib/api";

export default function QuickQuote({ compact = false }) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    origen_cp: "",
    destino_cp: "",
    peso: "",
    tipo_servicio: "estandar",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setResult(null); setLoading(true);
    try {
      const payload = {
        origen_cp: data.origen_cp,
        destino_cp: data.destino_cp,
        peso: parseFloat(data.peso),
        tipo_servicio: data.tipo_servicio,
      };
      const r = await pmmApi.quote(payload);
      setResult(r);
    } catch (err) {
      setError(err?.response?.data?.detail || "Error al cotizar. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-0 border-b border-zinc-700 focus:border-[#E30613] py-3 px-0 text-white placeholder-zinc-600 font-mono text-sm focus:outline-none transition-colors";

  return (
    <div data-testid="quick-quote" className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-8 md:p-10 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-overline mb-2">Cotiza al instante</div>
          <h3 className="font-display text-3xl text-white">Tu envío en 30 segundos.</h3>
        </div>
        <button
          type="button"
          onClick={() => navigate("/cotizador")}
          className="hidden md:inline-flex text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-white"
        >
          Cotizador completo →
        </button>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="text-overline block mb-3">Origen CP</label>
          <input
            data-testid="quote-origen"
            required
            value={data.origen_cp}
            onChange={onChange("origen_cp")}
            placeholder="03100"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-overline block mb-3">Destino CP</label>
          <input
            data-testid="quote-destino"
            required
            value={data.destino_cp}
            onChange={onChange("destino_cp")}
            placeholder="64620"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-overline block mb-3">Peso (kg)</label>
          <input
            data-testid="quote-peso"
            required type="number" step="0.1" min="0.1"
            value={data.peso}
            onChange={onChange("peso")}
            placeholder="2.5"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-overline block mb-3">Servicio</label>
          <select
            data-testid="quote-servicio"
            value={data.tipo_servicio}
            onChange={onChange("tipo_servicio")}
            className={inputCls + " cursor-pointer"}
          >
            <option value="estandar" className="bg-zinc-900">Estándar</option>
            <option value="express" className="bg-zinc-900">Express</option>
            <option value="tarima" className="bg-zinc-900">Tarima</option>
          </select>
        </div>

        <div className="md:col-span-4 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
          <p className="text-xs text-zinc-500 font-mono">
            * Cotización aproximada. Tarifa final sujeta a peso volumétrico real.
          </p>
          <button
            type="submit"
            data-testid="quote-submit"
            disabled={loading}
            className="inline-flex items-center gap-3 bg-[#E30613] hover:bg-[#FF1A27] text-white px-7 py-4 font-semibold tracking-wide transition-all active:scale-95 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Cotizar ahora <ArrowRight size={18} /></>}
          </button>
        </div>
      </form>

      {error && (
        <div data-testid="quote-error" className="mt-6 border border-red-500/30 bg-red-500/5 text-red-400 text-sm px-4 py-3 font-mono">
          {error}
        </div>
      )}

      {result && (
        <div data-testid="quote-result" className="mt-8 border border-[#E30613]/40 bg-[#E30613]/5 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-overline mb-1">Total estimado</div>
            <div className="font-display text-4xl text-white">${result.total.toLocaleString("es-MX")}</div>
            <div className="text-xs text-zinc-500 font-mono mt-1">MXN c/IVA</div>
          </div>
          <div>
            <div className="text-overline mb-1">Subtotal</div>
            <div className="font-mono text-xl text-white">${result.subtotal.toLocaleString("es-MX")}</div>
            <div className="text-xs text-zinc-500 font-mono mt-1">IVA: ${result.iva}</div>
          </div>
          <div>
            <div className="text-overline mb-1">Peso facturable</div>
            <div className="font-mono text-xl text-white">{result.peso_facturable} kg</div>
            <div className="text-xs text-zinc-500 font-mono mt-1">Vol: {result.peso_volumetrico} kg</div>
          </div>
          <div>
            <div className="text-overline mb-1">Entrega</div>
            <div className="font-mono text-xl text-white">{result.dias_estimados} día{result.dias_estimados > 1 ? "s" : ""}</div>
            <div className="text-xs text-zinc-500 font-mono mt-1 capitalize">{result.tipo_servicio}</div>
          </div>
        </div>
      )}
    </div>
  );
}
