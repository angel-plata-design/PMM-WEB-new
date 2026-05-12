import axios from "axios";

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

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
};

export default pmmApi;
