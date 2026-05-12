import React from "react";
import { Link } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, open, setOpen, update, remove, subtotal, totalGuias } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      {/* Drawer */}
      <aside
        data-testid="cart-drawer"
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <div>
            <div className="text-overline mb-1">Carrito</div>
            <h3 className="font-display text-2xl text-[#2D2D2D]">{totalGuias > 0 ? `${totalGuias} guías` : "Vacío"}</h3>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Cerrar carrito" className="text-[#6B6B6B] hover:text-[#1E008D]">
            <X size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={36} className="text-[#999999] mx-auto mb-4" />
              <p className="text-[#6B6B6B] mb-6">Tu carrito está vacío.</p>
              <Link to="/tienda" onClick={() => setOpen(false)} className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-semibold">
                Ir a la tienda <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((p) => {
                const key = `${p.box_id}-${p.tier_id}`;
                return (
                  <li key={key} className="flex gap-4 pb-5 border-b border-[#E5E5E5]">
                    <div className="w-20 h-20 bg-[#FAFAFA] flex items-center justify-center border border-[#E5E5E5] shrink-0">
                      <span className="font-display text-2xl text-[#1E008D]">{p.box_name}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-overline text-[10px] mb-1">{p.tier_label}</div>
                      <div className="font-display-medium text-[#2D2D2D]">{p.guias} guías × {p.box_name}</div>
                      <div className="text-xs text-[#6B6B6B] font-mono mt-1">${p.unit_price.toLocaleString("es-MX")} c/u</div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="inline-flex items-center border border-[#E5E5E5]">
                          <button onClick={() => update(key, p.qty - 1)} className="p-2 hover:bg-[#FAFAFA]"><Minus size={12} /></button>
                          <span data-testid={`cart-qty-${key}`} className="px-3 font-mono text-sm text-[#2D2D2D] min-w-[2ch] text-center">{p.qty}</span>
                          <button onClick={() => update(key, p.qty + 1)} className="p-2 hover:bg-[#FAFAFA]"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => remove(key)} className="text-[#6B6B6B] hover:text-red-600" aria-label="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="font-display text-xl text-[#1E008D] shrink-0">
                      ${(p.unit_price * p.qty).toLocaleString("es-MX")}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="p-6 border-t border-[#E5E5E5] bg-[#FAFAFA]">
            <div className="flex items-baseline justify-between mb-5">
              <span className="text-overline">Subtotal</span>
              <span className="font-display text-3xl text-[#2D2D2D]">${subtotal.toLocaleString("es-MX")}</span>
            </div>
            <Link
              to="/carrito"
              onClick={() => setOpen(false)}
              data-testid="checkout-button"
              className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4 font-semibold"
            >
              Ir al checkout <ArrowRight size={18} />
            </Link>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6B6B6B] text-center mt-3">
              IVA incluido · {totalGuias} guías totales
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}
