import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";
import pmmApi, { formatApiError } from "../lib/api";

function GoogleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="google-login-btn"
      className="w-full inline-flex items-center justify-center gap-3 border border-[#E5E5E5] hover:border-[#1E008D] py-3.5 font-medium text-[#2D2D2D] transition-colors bg-white"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 28.9 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.7 0 19.5-8.5 19.5-19.5 0-1.2-.1-2.3-.3-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.8 28.9 5 24 5 16.3 5 9.7 9.4 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 43c4.8 0 9.2-1.7 12.5-4.6l-5.8-4.8C28.9 35.1 26.6 36 24 36c-5.3 0-9.7-3.1-11.5-7.5l-6.5 5C9.6 38.4 16.2 43 24 43z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.1-2.2 3.9-4 5.1l5.8 4.8c-.4.4 6.5-4.7 6.5-13.9 0-1.2-.1-2.3-.3-3.5z"/>
      </svg>
      Continuar con Google
    </button>
  );
}

function googleStart() {
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const redirectUrl = window.location.origin + "/auth/callback";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const u = await pmmApi.login({ email, password });
      setUser(u);
      const intended = sessionStorage.getItem("pmm_post_login") || location.state?.from || "/tienda";
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
      <Seo title="Inicia sesión" description="Accede a tu cuenta PMM para comprar guías prepagadas y consultar historial." path="/login" />
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 pt-20">
        <aside className="lg:col-span-5 bg-[#1E008D] text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-12">
              <img src="/pmm-blanco.svg" alt="PMM" className="h-10 w-auto" />
            </Link>
            <div className="text-overline-on-dark mb-6">Tu cuenta PMM</div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white">
              Mueve más,<br /><em className="not-italic text-[#3DAE2B]">paga menos.</em>
            </h1>
            <p className="text-white/80 mt-6 leading-relaxed max-w-md">
              Accede a la tienda, gestiona tus guías, consulta historial de envíos y factura automáticamente con tu RFC.
            </p>
          </div>
          <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            #TransportandoEmociones
          </div>
          {/* Watermark */}
          <div className="absolute -bottom-20 -left-10 text-[18rem] font-display leading-none text-white/[0.04] select-none pointer-events-none">P</div>
        </aside>

        <section className="lg:col-span-7 flex items-center justify-center p-8 md:p-16 bg-[#FAFAFA]">
          <div className="w-full max-w-md">
            <div className="text-overline mb-3">Bienvenido de vuelta</div>
            <h2 className="font-display text-4xl md:text-5xl text-[#2D2D2D] mb-10">Inicia sesión</h2>

            <GoogleButton onClick={googleStart} />

            <div className="my-7 flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em] text-[#999999]">
              <div className="flex-1 h-px bg-[#E5E5E5]" /> o con email <div className="flex-1 h-px bg-[#E5E5E5]" />
            </div>

            <form onSubmit={submit} className="space-y-5" data-testid="login-form">
              <div>
                <label className="text-overline block mb-2">Email</label>
                <input data-testid="login-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-overline block mb-2">Contraseña</label>
                <input data-testid="login-password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
              </div>
              {error && <div data-testid="login-error" className="border border-red-300 bg-red-50 text-red-700 text-xs px-3 py-2 font-mono">{error}</div>}
              <button type="submit" disabled={loading} data-testid="login-submit" className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4 font-semibold disabled:opacity-60">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Entrar <ArrowRight size={16} /></>}
              </button>
            </form>

            <p className="mt-6 text-sm text-[#6B6B6B]">
              ¿Aún no tienes cuenta? <Link to="/registro" className="text-[#1E008D] nav-underline font-semibold">Regístrate</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
