import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import pmmApi from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const processed = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = location.hash || "";
    const m = hash.match(/session_id=([^&]+)/);
    if (!m) {
      navigate("/login", { replace: true });
      return;
    }
    const sessionId = decodeURIComponent(m[1]);
    pmmApi
      .googleSession(sessionId)
      .then((u) => {
        setUser(u);
        // Read intended destination from sessionStorage (set before redirect)
        const intended = sessionStorage.getItem("pmm_post_login") || "/tienda";
        sessionStorage.removeItem("pmm_post_login");
        navigate(intended, { replace: true });
      })
      .catch((e) => {
        setError(e?.response?.data?.detail || "No pudimos completar el inicio con Google.");
        setTimeout(() => navigate("/login", { replace: true }), 2500);
      });
  }, [location.hash, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center">
        <Loader2 size={36} className="text-[#1E008D] animate-spin mx-auto mb-6" />
        <div className="text-overline mb-2">Iniciando sesión</div>
        <p className="text-[#6B6B6B] text-sm">{error || "Validando tu cuenta…"}</p>
      </div>
    </div>
  );
}
