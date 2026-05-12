import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "pmm_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (item) => {
    setItems((prev) => {
      const key = `${item.box_id}-${item.tier_id}`;
      const existing = prev.find((p) => `${p.box_id}-${p.tier_id}` === key);
      if (existing) {
        return prev.map((p) =>
          `${p.box_id}-${p.tier_id}` === key ? { ...p, qty: p.qty + (item.qty || 1) } : p
        );
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
    setOpen(true);
  };

  const update = (key, qty) => {
    setItems((prev) =>
      prev
        .map((p) => (`${p.box_id}-${p.tier_id}` === key ? { ...p, qty: Math.max(1, qty) } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const remove = (key) => {
    setItems((prev) => prev.filter((p) => `${p.box_id}-${p.tier_id}` !== key));
  };

  const clear = () => setItems([]);

  const subtotal = items.reduce((acc, p) => acc + p.unit_price * p.qty, 0);
  const totalGuias = items.reduce((acc, p) => acc + p.guias * p.qty, 0);
  const totalCount = items.reduce((acc, p) => acc + p.qty, 0);

  return (
    <CartContext.Provider value={{
      items, add, update, remove, clear,
      subtotal, totalGuias, totalCount,
      open, setOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
