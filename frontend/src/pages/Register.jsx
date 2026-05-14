import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Check } from "lucide-react";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";
import pmmApi, { formatApiError } from "../lib/api";

function googleStart() {
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const redirectUrl = window.location.origin + "/auth/callback";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const u = await pmmApi.register(form);
      setUser(u);
      const intended = sessionStorage.getItem("pmm_post_login") || "/tienda";
      sessionStorage.removeItem("pmm_post_login");
      navigate(intended, { replace: true });
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-transparent border-0 border-b border-[#E5E5E5] focus:border-[#1E008D] py-3 px-0 text-[#2D2D2D] placeholder-[#B8B8B8] font-mono text-sm focus:outline-none transition-colors";

  return (
    <>
      <Seo title="Crea tu cuenta" description="Crea tu cuenta PMM en 30 segundos. Compra guías, factura y rastrea desde un solo lugar." path="/registro" />
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 pt-20">
        <aside className="lg:col-span-5 bg-[#3DAE2B] text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden order-2 lg:order-1">
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-12">
              <img src={`${process.env.PUBLIC_URL}/pmm-blanco.svg`} alt="PMM" className="h-10 w-auto" />
            </Link>
            <div className="text-overline-on-dark mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>Crea tu cuenta</div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white">
              30 segundos.<br /><em className="not-italic text-white/80 font-display-medium">Y listo.</em>
            </h1>
            <ul className="mt-10 space-y-3 text-white/90 text-sm">
              {[
                "Compra guías prepagadas con descuento por volumen",
                "Historial completo de pedidos y guías",
                "Facturación automática con tu RFC",
                "Cobertura nacional en 29+ ciudades",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" /> {b}</li>
              ))}
            </ul>
          </div>
          <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
            #TransportandoEmociones
          </div>
          <div className="absolute -bottom-20 -right-10 text-[18rem] font-display leading-none text-white/[0.08] select-none pointer-events-none">M</div>
        </aside>

        <section className="lg:col-span-7 flex items-center justify-center p-8 md:p-16 bg-[#FAFAFA] order-1 lg:order-2">
          <div className="w-full max-w-md">
            <div className="text-overline mb-3">Cuenta nueva</div>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D2D2D] mb-10">Regístrate</h2>

            <button
              type="button"
              onClick={googleStart}
              data-testid="google-register-btn"
              className="w-full inline-flex items-center justify-center gap-3 border border-[#E5E5E5] hover:border-[#1E008D] py-3.5 font-medium text-[#2D2D2D] transition-colors bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 28.9 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.7 0 19.5-8.5 19.5-19.5 0-1.2-.1-2.3-.3-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.8 28.9 5 24 5 16.3 5 9.7 9.4 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 43c4.8 0 9.2-1.7 12.5-4.6l-5.8-4.8C28.9 35.1 26.6 36 24 36c-5.3 0-9.7-3.1-11.5-7.5l-6.5 5C9.6 38.4 16.2 43 24 43z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.1-2.2 3.9-4 5.1l5.8 4.8c-.4.4 6.5-4.7 6.5-13.9 0-1.2-.1-2.3-.3-3.5z"/>
              </svg>
              Crear cuenta con Google
            </button>

            <div className="my-7 flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em] text-[#999999]">
              <div className="flex-1 h-px bg-[#E5E5E5]" /> o con email <div className="flex-1 h-px bg-[#E5E5E5]" />
            </div>

            <form onSubmit={submit} className="space-y-5" data-testid="register-form">
              <div>
                <label className="text-overline block mb-2">Nombre completo</label>
                <input data-testid="register-name" required value={form.name} onChange={onChange("name")} className={inputCls} />
              </div>
              <div>
                <label className="text-overline block mb-2">Email</label>
                <input data-testid="register-email" required type="email" value={form.email} onChange={onChange("email")} className={inputCls} />
              </div>
              <div>
                <label className="text-overline block mb-2">Contraseña</label>
                <input data-testid="register-password" required type="password" minLength={6} value={form.password} onChange={onChange("password")} className={inputCls} />
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#999999] mt-2">Mínimo 6 caracteres</p>
              </div>
              {error && <div data-testid="register-error" className="border border-red-300 bg-red-50 text-red-700 text-xs px-3 py-2 font-mono">{error}</div>}
              <button type="submit" disabled={loading} data-testid="register-submit" className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4 font-semibold disabled:opacity-60">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Crear cuenta <ArrowRight size={16} /></>}
              </button>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6B6B6B] text-center">
                Al registrarte aceptas los términos y aviso de privacidad PMM.
              </p>
            </form>

            <p className="mt-6 text-sm text-[#6B6B6B]">
              ¿Ya tienes cuenta? <Link to="/login" className="text-[#1E008D] nav-underline font-semibold">Inicia sesión</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
