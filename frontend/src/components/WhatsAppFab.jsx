import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFab({ message = "Hola PMM, quiero cotizar un envío. Empresa: __ . Origen: __ . Destino: __ . Volumen mensual: __" }) {
  const phone = "525555555555";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-fab"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white px-5 py-4 rounded-full shadow-2xl shadow-black/40 transition-all hover:scale-105 active:scale-95 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="font-medium text-sm hidden sm:block">Cotizar por WhatsApp</span>
    </a>
  );
}
