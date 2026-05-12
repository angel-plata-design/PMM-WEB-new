import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import pmmApi from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // If no token in storage, skip the call entirely (avoids 401 noise)
    const token = (() => { try { return localStorage.getItem("pmm_session_token"); } catch { return null; } })();
    if (!token) { setUser(null); return null; }
    try {
      const u = await pmmApi.me();
      setUser(u);
      return u;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from Google OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const logout = async () => {
    try { await pmmApi.logout(); } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
