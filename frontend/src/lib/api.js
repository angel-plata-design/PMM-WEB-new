import axios from "axios";

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "pmm_session_token";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Token management — works through ingress wildcards by avoiding credentials cookies.
export function setAuthToken(token) {
  if (token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch {}
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    try { localStorage.removeItem(TOKEN_KEY); } catch {}
    delete api.defaults.headers.common["Authorization"];
  }
}

export function getAuthToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

// Initialize header from existing token if present
const existing = getAuthToken();
if (existing) {
  api.defaults.headers.common["Authorization"] = `Bearer ${existing}`;
}

export function formatApiError(err) {
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || "Error inesperado. Intenta de nuevo.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const pmmApi = {
  health: () => api.get("/health").then((r) => r.data),
  quote: (payload) => api.post("/quote", payload).then((r) => r.data),
  tracking: (guia) => api.get(`/tracking/${encodeURIComponent(guia)}`).then((r) => r.data),
  branches: (params = {}) => api.get("/branches", { params }).then((r) => r.data),
  coverage: () => api.get("/branches/coverage").then((r) => r.data),
  invoice: (folio) => api.get(`/invoices/${encodeURIComponent(folio)}`).then((r) => r.data),
  posts: () => api.get("/posts").then((r) => r.data),
  post: (slug) => api.get(`/posts/${slug}`).then((r) => r.data),
  services: () => api.get("/services").then((r) => r.data),
  createLead: (payload) => api.post("/leads", payload).then((r) => r.data),
  products: () => api.get("/products").then((r) => r.data),
  checkout: (payload) => api.post("/checkout", payload).then((r) => r.data),
  // auth
  register: (payload) => api.post("/auth/register", payload).then((r) => {
    setAuthToken(r.data.session_token);
    return r.data.user;
  }),
  login: (payload) => api.post("/auth/login", payload).then((r) => {
    setAuthToken(r.data.session_token);
    return r.data.user;
  }),
  logout: () => api.post("/auth/logout").then((r) => { setAuthToken(null); return r.data; }).catch(() => { setAuthToken(null); }),
  me: () => api.get("/auth/me").then((r) => r.data),
  googleSession: (session_id) => api.post("/auth/google/session", { session_id }).then((r) => {
    setAuthToken(r.data.session_token);
    return r.data.user;
  }),
  updateMe: (payload) => api.patch("/auth/me", payload).then((r) => r.data),
  myOrders: () => api.get("/orders/mine").then((r) => r.data),
};

export default pmmApi;
