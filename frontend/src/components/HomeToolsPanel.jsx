import React, { useState } from "react";
import QuickQuote from "./QuickQuote";
import TrackingWidget from "./TrackingWidget";
import { Calculator, Search } from "lucide-react";

export default function HomeToolsPanel() {
  const [tab, setTab] = useState("track");

  return (
    <div className="bg-white border border-[#E5E5E5] shadow-[0_30px_60px_-30px_rgba(30,0,141,0.25)] relative">
      <div className="flex border-b border-[#E5E5E5]" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "track"}
          onClick={() => setTab("track")}
          data-testid="tab-track"
          className={`flex-1 py-5 px-6 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            tab === "track"
              ? "text-[#1E008D] bg-white border-b-2 border-[#1E008D] -mb-px"
              : "text-[#6B6B6B] hover:text-[#1E008D] bg-[#FAFAFA]"
          }`}
        >
          <Search size={16} /> Rastrear pedido
        </button>
        <button
          role="tab"
          aria-selected={tab === "quote"}
          onClick={() => setTab("quote")}
          data-testid="tab-quote"
          className={`flex-1 py-5 px-6 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            tab === "quote"
              ? "text-[#1E008D] bg-white border-b-2 border-[#1E008D] -mb-px"
              : "text-[#6B6B6B] hover:text-[#1E008D] bg-[#FAFAFA]"
          }`}
        >
          <Calculator size={16} /> Cotizar envío
        </button>
      </div>
      <div className="p-0">
        {tab === "track" ? (
          <div className="p-8 md:p-10">
            <TrackingWidget inline />
          </div>
        ) : (
          <div className="border-0">
            <QuickQuoteInner />
          </div>
        )}
      </div>
    </div>
  );
}

// We keep QuickQuote's own card chrome, but render it without an outer border
function QuickQuoteInner() {
  return (
    <div className="[&>div]:bg-transparent [&>div]:border-0 [&>div]:shadow-none">
      <QuickQuote />
    </div>
  );
}
