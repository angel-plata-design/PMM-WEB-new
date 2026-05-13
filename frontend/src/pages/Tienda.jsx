import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Check, Truck, ArrowRight, Package } from "lucide-react";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import { useCart } from "../context/CartContext";
import pmmApi from "../lib/api";

function ProductCard({ box }) {
  const { add } = useCart();
  const [tierId, setTierId] = useState(box.tiers[0].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const tier = box.tiers.find((t) => t.id === tierId) || box.tiers[0];

  const onAdd = () => {
    add({
      box_id: box.id,
      box_name: box.name,
      box_weight_kg: box.weight_kg,
      tier_id: tier.id,
      tier_label: tier.label,
      guias: tier.guias,
      unit_price: tier.price,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article
      data-testid={`product-${box.id}`}
      className="bg-white border border-[#E5E5E5] hover:border-[#1E008D]/40 transition-all hover:shadow-[0_30px_50px_-25px_rgba(30,0,141,0.2)] flex flex-col"
    >
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[#FAFAFA] to-[#F0F0F0] flex items-center justify-center">
        <div className="absolute top-4 left-4 text-overline">{box.weight_kg} kg máx</div>
        <div className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#3DAE2B]">{box.color_tag}</div>
        <Package
          size={120}
          strokeWidth={1}
          style={{ color: box.color }}
          className="transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-4 right-4 flex items-baseline justify-between">
          <div className="font-display text-7xl text-[#2D2D2D]">{box.name}</div>
          <div className="font-mono text-xs text-[#6B6B6B] uppercase tracking-[0.2em]">caja</div>
        </div>
      </div>

      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <h3 className="font-display-medium text-2xl text-[#2D2D2D]">{box.title}</h3>
        <p className="text-sm text-[#6B6B6B] mt-2 leading-relaxed">{box.description}</p>

        <div className="mt-6">
          <label className="text-overline block mb-3">Paquete</label>
          <div className="grid grid-cols-3 gap-2">
            {box.tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setTierId(t.id)}
                data-testid={`tier-${box.id}-${t.id}`}
                className={`py-2 px-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                  t.id === tierId
                    ? "border-[#1E008D] bg-[#1E008D] text-white"
                    : "border-[#E5E5E5] text-[#2D2D2D] hover:border-[#1E008D]/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <div className="text-overline mb-1">Precio</div>
            <div className="font-display text-4xl text-[#1E008D]">${tier.price.toLocaleString("es-MX")}</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6B6B6B] mt-1">
              {tier.guias} guías · ${(tier.price / tier.guias).toFixed(2)} c/u
            </div>
          </div>
          <div className="inline-flex items-center border border-[#E5E5E5]">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-[#FAFAFA]"><Minus size={14} /></button>
            <span className="px-4 font-mono text-[#2D2D2D] min-w-[3ch] text-center">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="p-2.5 hover:bg-[#FAFAFA]"><Plus size={14} /></button>
          </div>
        </div>

        <button
          onClick={onAdd}
          data-testid={`add-to-cart-${box.id}`}
          className={`mt-6 w-full inline-flex items-center justify-center gap-2 py-4 font-semibold transition-all active:scale-95 ${
            added ? "bg-[#3DAE2B] text-white" : "btn-primary"
          }`}
        >
          {added ? (<><Check size={18} /> Agregado</>) : (<><ShoppingBag size={18} /> Agregar al carrito</>)}
        </button>
      </div>
    </article>
  );
}

const PRODUCTS_FALLBACK = [
  {
    id: "box5", name: "5kg", title: "Caja 5 kg", weight_kg: 5,
    color: "#1E008D", color_tag: "Azul",
    description: "Ideal para envíos pequeños: documentos, accesorios, ropa ligera.",
    tiers: [
      { id: "t1",   label: "1 guía",    guias: 1,   price: 249.90 },
      { id: "t10",  label: "10 guías",  guias: 10,  price: 2374.05 },
      { id: "t30",  label: "30 guías",  guias: 30,  price: 6872.25 },
      { id: "t50",  label: "50 guías",  guias: 50,  price: 10995.60 },
      { id: "t100", label: "100 guías", guias: 100, price: 20991.60 },
      { id: "t300", label: "300 guías", guias: 300, price: 59976.00 },
    ],
  },
  {
    id: "box10", name: "10kg", title: "Caja 10 kg", weight_kg: 10,
    color: "#3DAE2B", color_tag: "Verde",
    description: "Para pedidos medianos: electrónicos, kits, paquetes regulares.",
    tiers: [
      { id: "t1",   label: "1 guía",    guias: 1,   price: 301.00 },
      { id: "t10",  label: "10 guías",  guias: 10,  price: 2859.50 },
      { id: "t30",  label: "30 guías",  guias: 30,  price: 8277.50 },
      { id: "t50",  label: "50 guías",  guias: 50,  price: 13244.00 },
      { id: "t100", label: "100 guías", guias: 100, price: 25284.00 },
      { id: "t300", label: "300 guías", guias: 300, price: 72240.00 },
    ],
  },
  {
    id: "box20", name: "20kg", title: "Caja 20 kg", weight_kg: 20,
    color: "#2D2D2D", color_tag: "Carbón",
    description: "Para envíos pesados: hogar, refacciones, lotes mayoristas.",
    tiers: [
      { id: "t1",   label: "1 guía",    guias: 1,   price: 350.00 },
      { id: "t10",  label: "10 guías",  guias: 10,  price: 3325.00 },
      { id: "t30",  label: "30 guías",  guias: 30,  price: 9625.00 },
      { id: "t50",  label: "50 guías",  guias: 50,  price: 15400.00 },
      { id: "t100", label: "100 guías", guias: 100, price: 29400.00 },
      { id: "t300", label: "300 guías", guias: 300, price: 84000.00 },
    ],
  },
  {
    id: "box30", name: "30kg", title: "Caja 30 kg", weight_kg: 30,
    color: "#1E008D", color_tag: "XL",
    description: "Máxima capacidad para mercancía voluminosa o consolidada.",
    tiers: [
      { id: "t1",   label: "1 guía",    guias: 1,   price: 390.00 },
      { id: "t10",  label: "10 guías",  guias: 10,  price: 3705.00 },
      { id: "t30",  label: "30 guías",  guias: 30,  price: 10725.00 },
      { id: "t50",  label: "50 guías",  guias: 50,  price: 17160.00 },
      { id: "t100", label: "100 guías", guias: 100, price: 32760.00 },
      { id: "t300", label: "300 guías", guias: 300, price: 93600.00 },
    ],
  },
];

export default function Tienda() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pmmApi.products()
      .then((p) => setBoxes(p))
      .catch(() => setBoxes(PRODUCTS_FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo
        title="Tienda · Guías Prepagadas"
        description="Compra guías prepagadas PMM en línea. Cajas de 5kg, 10kg, 20kg y 30kg con paquetes desde 1 hasta 300 guías. Precios preferenciales y entrega inmediata."
        path="/tienda"
      />
      <PageHeader
        overline="Tienda PMM"
        title={<>Compra guías<br /><em className="not-italic text-[#3DAE2B]">prepagadas en línea.</em></>}
        description="Cuatro tamaños de caja con paquetes desde 1 hasta 300 guías. Precios preferenciales por volumen, sin contratos y validez 12 meses."
        breadcrumbs={[{ label: "Tienda" }]}
        image="https://images.unsplash.com/photo-1766040923580-16ad32fae8b4"
      />

      <section className="section-pad">
        <div className="container-pmm">
          {/* Value props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 pb-16 border-b border-[#E5E5E5]">
            {[
              { icon: Truck, t: "Cobertura nacional", d: "16+ estados activos" },
              { icon: Package, t: "Validez 12 meses", d: "Desde la fecha de compra" },
              { icon: ShoppingBag, t: "Sin mínimos", d: "Compra desde 1 guía" },
              { icon: Check, t: "Pago seguro", d: "IVA incluido" },
            ].map((v) => (
              <div key={v.t} className="flex items-start gap-3">
                <v.icon size={20} className="text-[#1E008D] mt-1 shrink-0" />
                <div>
                  <div className="font-display-medium text-[#2D2D2D]">{v.t}</div>
                  <div className="text-xs text-[#6B6B6B] mt-1 font-mono">{v.d}</div>
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-[#6B6B6B] py-20 font-mono text-sm">Cargando productos…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boxes.map((b) => (<ProductCard key={b.id} box={b} />))}
            </div>
          )}

          {/* B2B CTA */}
          <div className="mt-20 bg-[#1E008D] text-white p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-overline-on-dark mb-3">¿Volúmenes mayores?</div>
              <h3 className="font-display text-4xl md:text-5xl">Plan B2B con tarifas dedicadas.</h3>
              <p className="text-white/80 mt-3 max-w-lg">Si manejas más de 500 envíos al mes, habla con un ejecutivo para diseñar un plan corporativo.</p>
            </div>
            <Link to="/contacto" className="bg-[#3DAE2B] hover:bg-[#339224] text-white px-8 py-4 font-semibold inline-flex items-center gap-2 shrink-0 transition-all active:scale-95">
              Contactar ventas <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
