import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Phone, Clock, X } from "lucide-react";

// Custom blue marker icon using inline SVG -> data URL
const truckSvg = `
<svg xmlns='http://www.w3.org/2000/svg' width='40' height='52' viewBox='0 0 40 52'>
  <defs><filter id='s' x='-50%' y='-50%' width='200%' height='200%'>
    <feDropShadow dx='0' dy='2' stdDeviation='2' flood-opacity='0.35'/></filter></defs>
  <path d='M20 0C9 0 0 9 0 20c0 14 20 32 20 32s20-18 20-32C40 9 31 0 20 0z' fill='%231E008D' filter='url(%23s)'/>
  <circle cx='20' cy='20' r='10' fill='white'/>
  <text x='20' y='25' text-anchor='middle' font-family='Inter, sans-serif' font-size='12' font-weight='700' fill='%231E008D'>P</text>
</svg>`;

const activeSvg = truckSvg.replace("%231E008D", "%233DAE2B");

const blueIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${truckSvg.replace(/\n/g, "")}`,
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -48],
});

const greenIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${activeSvg.replace(/\n/g, "")}`,
  iconSize: [44, 58],
  iconAnchor: [22, 58],
  popupAnchor: [0, -54],
});

function MapFlyTo({ position, zoom = 12 }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom, { duration: 1.4 });
    }
  }, [position, zoom, map]);
  return null;
}

export default function SucursalesMap({ branches }) {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const markerRefs = useRef({});

  const filtered = branches.filter((b) =>
    !filter ||
    b.ciudad.toLowerCase().includes(filter.toLowerCase()) ||
    b.estado.toLowerCase().includes(filter.toLowerCase()) ||
    b.cp.startsWith(filter)
  );

  const handleSelect = (b) => {
    setSelected(b);
    const ref = markerRefs.current[b.id];
    if (ref) {
      setTimeout(() => ref.openPopup(), 700);
    }
  };

  const target = selected || null;

  return (
    <div data-testid="sucursales-map-wrapper" className="grid grid-cols-1 lg:grid-cols-12 border border-[#E5E5E5] bg-white shadow-[0_30px_60px_-30px_rgba(30,0,141,0.18)]">
      {/* Sidebar */}
      <aside className="lg:col-span-4 xl:col-span-3 border-r border-[#E5E5E5] flex flex-col max-h-[640px] lg:max-h-[720px]">
        <div className="p-6 border-b border-[#E5E5E5]">
          <div className="text-overline mb-3">Directorio</div>
          <h3 className="font-display text-2xl text-[#2D2D2D] mb-4">Encuentra tu sucursal</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              data-testid="map-search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Ciudad, estado o CP"
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] focus:border-[#1E008D] py-2.5 pl-9 pr-3 text-[#2D2D2D] placeholder-[#B8B8B8] font-mono text-xs focus:outline-none"
            />
            {filter && (
              <button onClick={() => setFilter("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1E008D]">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B]">
            {filtered.length} {filtered.length === 1 ? "sucursal" : "sucursales"}
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-[#6B6B6B] font-mono">
              Sin resultados. Prueba otra ciudad o estado.
            </div>
          )}
          {filtered.map((b) => {
            const active = selected?.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => handleSelect(b)}
                data-testid={`map-branch-${b.id}`}
                className={`w-full text-left p-5 border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors group ${active ? "bg-[#1E008D]/[0.04] border-l-4 border-l-[#1E008D]" : "border-l-4 border-l-transparent"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-overline text-[10px]">{b.estado}</div>
                  <div className={`font-mono text-[10px] ${active ? "text-[#3DAE2B]" : "text-[#999999]"}`}>CP {b.cp}</div>
                </div>
                <div className={`font-display-medium text-base mb-1 ${active ? "text-[#1E008D]" : "text-[#2D2D2D]"} group-hover:text-[#1E008D] transition-colors`}>
                  {b.ciudad}
                </div>
                <div className="text-[12px] text-[#6B6B6B] leading-snug line-clamp-2">{b.direccion}</div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Map */}
      <div className="lg:col-span-8 xl:col-span-9 relative h-[480px] lg:h-[720px]">
        <MapContainer
          center={[23.6345, -102.5528]}
          zoom={5}
          scrollWheelZoom={true}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {target && <MapFlyTo position={[target.lat, target.lng]} zoom={13} />}
          {filtered.map((b) => (
            <Marker
              key={b.id}
              position={[b.lat, b.lng]}
              icon={selected?.id === b.id ? greenIcon : blueIcon}
              ref={(ref) => {
                if (ref) markerRefs.current[b.id] = ref;
              }}
              eventHandlers={{
                click: () => setSelected(b),
              }}
            >
              <Popup>
                <div className="font-body" style={{ minWidth: 220 }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#1E008D", marginBottom: 6 }}>
                    {b.estado}
                  </div>
                  <div style={{ fontWeight: 600, color: "#2D2D2D", fontSize: 16, marginBottom: 6 }}>{b.nombre}</div>
                  <div style={{ color: "#6B6B6B", fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>{b.direccion}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#2D2D2D" }}>
                    <div><Phone size={12} style={{ display: "inline", marginRight: 6, color: "#1E008D" }} />{b.telefono}</div>
                    <div><Clock size={12} style={{ display: "inline", marginRight: 6, color: "#1E008D" }} />{b.horario}</div>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", color: "#3DAE2B", marginTop: 4 }}>CP {b.cp}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
