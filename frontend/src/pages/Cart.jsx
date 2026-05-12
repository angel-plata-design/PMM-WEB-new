import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, Loader2, ShoppingBag, Check } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import { useCart } from "../context/CartContext";
import pmmApi from "../lib/api";

export default function Cart() {
  const { items, update, remove, subtotal, totalGuias, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [step, setStep] = useState("review"); // review | done
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const r = await pmmApi.checkout({
        ...form,
        items: items.map((p) => ({
          box_id: p.box_id, tier_id: p.tier_id, qty: p.qty,
        })),
      });
      setOrderId(r.order_id);
      setStep("done");
      clear();
    } catch (err) {
      setError(err?.response?.data?.detail || "No pudimos procesar tu pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-transparent border-0 border-b border-[#E5E5E5] focus:border-[#1E008D] py-3 px-0 text-[#2D2D2D] placeholder-[#B8B8B8] font-mono text-sm focus:outline-none transition-colors";

  if (step === "done") {
    return (
      <>
        <Seo title="Pedido confirmado" description="Tu pedido PMM ha sido recibido." path="/carrito" />
        <PageHeader
          overline="Pedido confirmado"
          title={<>¡Listo!<br /><em className="not-italic text-[#3DAE2B]">tu pedido fue recibido.</em></>}
          description="Recibirás un correo de confirmación con tus guías prepagadas en breve."
          breadcrumbs={[{ label: "Tienda", to: "/tienda" }, { label: "Confirmación" }]}
        />
        <section className="section-pad">
          <div className="container-pmm max-w-2xl text-center" data-testid="checkout-success">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#3DAE2B] text-white rounded-full mb-8">
              <Check size={36} />
            </div>
            <div className="text-overline mb-3">Folio de orden</div>
            <h2 className="font-display text-5xl text-[#1E008D] mb-8">{orderId}</h2>
            <p className="text-[#6B6B6B] mb-10 leading-relaxed">
              En menos de 10 minutos recibirás un correo con tus guías prepagadas listas para usar. Si necesitas factura, escríbenos a <span className="text-[#2D2D2D]">facturacion@pmm.com.mx</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/tienda" className="btn-primary px-7 py-4 font-semibold inline-flex items-center justify-center gap-2">
                <ShoppingBag size={18} /> Seguir comprando
              </Link>
              <Link to="/" className="border border-[#E5E5E5] hover:border-[#1E008D] text-[#2D2D2D] px-7 py-4 font-semibold">
                Ir al inicio
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo title="Carrito" description="Revisa tus guías prepagadas y completa tu pedido PMM." path="/carrito" />
      <PageHeader
        overline="Tu carrito"
        title={<>Revisa tu<br /><em className="not-italic text-[#3DAE2B]">pedido.</em></>}
        description={items.length > 0
          ? `${totalGuias} guías en ${items.length} producto${items.length > 1 ? "s" : ""}. Confirma tus datos y completa la compra.`
          : "Aún no tienes guías en tu carrito. Visita la tienda para agregar."}
        breadcrumbs={[{ label: "Tienda", to: "/tienda" }, { label: "Carrito" }]}
      />

      <section className="section-pad">
        <div className="container-pmm">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="text-[#999999] mx-auto mb-6" />
              <p className="text-[#6B6B6B] mb-8">Tu carrito está vacío.</p>
              <Link to="/tienda" className="btn-primary inline-flex items-center gap-2 px-7 py-4 font-semibold">
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Items list */}
              <div className="lg:col-span-7" data-testid="cart-items">
                <div className="text-overline mb-6">Productos</div>
                <ul className="space-y-5">
                  {items.map((p) => {
                    const key = `${p.box_id}-${p.tier_id}`;
                    return (
                      <li key={key} className="flex gap-5 pb-6 border-b border-[#E5E5E5]">
                        <div className="w-24 h-24 bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                          <span className="font-display text-3xl text-[#1E008D]">{p.box_name}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-overline text-[10px] mb-1">{p.tier_label}</div>
                          <div className="font-display-medium text-lg text-[#2D2D2D]">{p.guias} guías · caja {p.box_name}</div>
                          <div className="text-xs text-[#6B6B6B] font-mono mt-1">${p.unit_price.toLocaleString("es-MX")} por paquete</div>
                          <div className="mt-4 flex items-center gap-4">
                            <div className="inline-flex items-center border border-[#E5E5E5]">
                              <button onClick={() => update(key, p.qty - 1)} className="p-2 hover:bg-[#FAFAFA]"><Minus size={12} /></button>
                              <span className="px-4 font-mono text-[#2D2D2D]">{p.qty}</span>
                              <button onClick={() => update(key, p.qty + 1)} className="p-2 hover:bg-[#FAFAFA]"><Plus size={12} /></button>
                            </div>
                            <button onClick={() => remove(key)} className="text-[#6B6B6B] hover:text-red-600 text-xs font-mono uppercase tracking-wider flex items-center gap-1">
                              <Trash2 size={12} /> Quitar
                            </button>
                          </div>
                        </div>
                        <div className="font-display text-2xl text-[#1E008D] shrink-0">
                          ${(p.unit_price * p.qty).toLocaleString("es-MX")}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <Link to="/tienda" className="inline-flex items-center gap-2 mt-8 text-[#1E008D] nav-underline text-sm font-semibold uppercase tracking-wider">
                  <ArrowLeft size={14} /> Seguir comprando
                </Link>
              </div>

              {/* Checkout form */}
              <div className="lg:col-span-5">
                <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-8 sticky top-28">
                  <div className="text-overline mb-2">Resumen</div>
                  <h3 className="font-display text-3xl text-[#2D2D2D] mb-6">Completa tu pedido</h3>

                  <div className="space-y-3 pb-6 border-b border-[#E5E5E5] mb-6">
                    <div className="flex justify-between text-sm"><span className="text-[#6B6B6B]">Guías totales</span><span className="font-mono text-[#2D2D2D]">{totalGuias}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6B6B6B]">Productos</span><span className="font-mono text-[#2D2D2D]">{items.length}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#6B6B6B]">IVA</span><span className="font-mono text-[#3DAE2B]">Incluido</span></div>
                  </div>

                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-overline">Total</span>
                    <span className="font-display text-4xl text-[#1E008D]">${subtotal.toLocaleString("es-MX")}</span>
                  </div>

                  <form onSubmit={submit} className="space-y-4" data-testid="checkout-form">
                    <div>
                      <label className="text-overline block mb-2">Nombre *</label>
                      <input required value={form.name} onChange={onChange("name")} className={inputCls} data-testid="checkout-name" />
                    </div>
                    <div>
                      <label className="text-overline block mb-2">Email *</label>
                      <input required type="email" value={form.email} onChange={onChange("email")} className={inputCls} data-testid="checkout-email" />
                    </div>
                    <div>
                      <label className="text-overline block mb-2">Teléfono *</label>
                      <input required value={form.phone} onChange={onChange("phone")} className={inputCls} data-testid="checkout-phone" />
                    </div>
                    <div>
                      <label className="text-overline block mb-2">Empresa</label>
                      <input value={form.company} onChange={onChange("company")} className={inputCls} />
                    </div>

                    {error && <div className="border border-red-300 bg-red-50 text-red-700 text-xs px-3 py-2 font-mono">{error}</div>}

                    <button type="submit" disabled={loading} data-testid="checkout-submit" className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4 font-semibold disabled:opacity-60">
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <>Confirmar pedido</>}
                    </button>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6B6B6B] text-center pt-2">
                      Al confirmar aceptas los términos de PMM Tienda
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
