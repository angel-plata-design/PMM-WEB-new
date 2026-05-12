import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LogOut, User as UserIcon, Package, FileText } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import pmmApi, { formatApiError } from "../lib/api";

export default function Account() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: user?.name || "", rfc: user?.rfc || "" });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    pmmApi.myOrders().then(setOrders).catch(() => {});
  }, []);

  useEffect(() => {
    setProfile({ name: user?.name || "", rfc: user?.rfc || "" });
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      await pmmApi.updateMe(profile);
      await refresh();
      setSavedAt(Date.now());
    } catch (err) {
      setError(formatApiError(err));
    } finally { setSaving(false); }
  };

  const onLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const inputCls = "w-full bg-transparent border-0 border-b border-[#E5E5E5] focus:border-[#1E008D] py-3 px-0 text-[#2D2D2D] font-mono text-sm focus:outline-none transition-colors";

  return (
    <>
      <Seo title="Mi cuenta" description="Tu perfil PMM, historial de pedidos y datos de facturación." path="/cuenta" />
      <PageHeader
        overline={user ? user.email : "Mi cuenta"}
        title={<>Hola,<br /><em className="not-italic text-[#3DAE2B]">{user?.name?.split(" ")[0] || "Cliente"}.</em></>}
        description="Gestiona tu perfil, RFC de facturación y consulta tu historial de pedidos PMM."
        breadcrumbs={[{ label: "Mi cuenta" }]}
      />
      <section className="section-pad">
        <div className="container-pmm grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E5E5E5] p-8">
              <div className="flex items-center gap-3 mb-6">
                <UserIcon size={20} className="text-[#1E008D]" />
                <h3 className="font-display text-2xl text-[#2D2D2D]">Perfil</h3>
              </div>
              <form onSubmit={save} className="space-y-5" data-testid="profile-form">
                <div>
                  <label className="text-overline block mb-2">Nombre completo</label>
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputCls} data-testid="profile-name" />
                </div>
                <div>
                  <label className="text-overline block mb-2">RFC para facturación</label>
                  <input value={profile.rfc} onChange={(e) => setProfile({ ...profile, rfc: e.target.value })} placeholder="XAXX010101000" className={inputCls} data-testid="profile-rfc" maxLength={13} />
                </div>
                <div>
                  <label className="text-overline block mb-2">Email</label>
                  <input value={user?.email || ""} disabled className={inputCls + " opacity-60"} />
                </div>
                {error && <div className="border border-red-300 bg-red-50 text-red-700 text-xs px-3 py-2 font-mono">{error}</div>}
                <div className="flex gap-3 items-center">
                  <button type="submit" disabled={saving} data-testid="profile-save" className="btn-primary px-6 py-3 font-semibold inline-flex items-center gap-2 disabled:opacity-60">
                    {saving ? <Loader2 className="animate-spin" size={16} /> : "Guardar"}
                  </button>
                  {savedAt && <span className="text-xs font-mono text-[#3DAE2B] uppercase tracking-wider">Guardado ✓</span>}
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-overline">Método de acceso</span>
                  <span className="text-xs text-[#6B6B6B] font-mono">
                    {user?.has_password && "Email/Contraseña"}{user?.has_password && user?.has_google ? " · " : ""}{user?.has_google && "Google"}
                  </span>
                </div>
                <button onClick={onLogout} data-testid="logout-btn" className="text-xs uppercase tracking-[0.2em] font-mono text-[#6B6B6B] hover:text-red-600 inline-flex items-center gap-1">
                  <LogOut size={14} /> Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <Package size={20} className="text-[#1E008D]" />
              <h3 className="font-display text-2xl text-[#2D2D2D]">Mis pedidos</h3>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white border border-[#E5E5E5] p-10 text-center">
                <p className="text-[#6B6B6B] mb-6">Aún no has hecho compras.</p>
                <Link to="/tienda" className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-semibold">Ir a la tienda</Link>
              </div>
            ) : (
              <ul className="space-y-4" data-testid="orders-list">
                {orders.map((o) => (
                  <li key={o.order_id} data-testid={`order-${o.order_id}`} className="bg-white border border-[#E5E5E5] p-6 flex items-center justify-between hover-lift">
                    <div>
                      <div className="text-overline mb-2">{new Date(o.created_at).toLocaleDateString("es-MX", { dateStyle: "medium" })}</div>
                      <div className="font-display-medium text-xl text-[#2D2D2D]">{o.order_id}</div>
                      <div className="text-xs text-[#6B6B6B] mt-1 font-mono">{o.guias_total} guías · {o.items_count} producto{o.items_count > 1 ? "s" : ""}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl text-[#1E008D]">${o.total.toLocaleString("es-MX")}</div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#3DAE2B] mt-1">{o.status === "pending_payment" ? "Por pagar" : o.status}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/facturacion" className="mt-6 inline-flex items-center gap-2 text-[#1E008D] nav-underline text-sm font-semibold uppercase tracking-wider">
              <FileText size={14} /> Ir a facturación
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
