import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  { to: "/servicios/empresas", label: "Empresas" },
  { to: "/servicios/personas", label: "Personas" },
  { to: "/cobertura", label: "Cobertura" },
  { to: "/rastreo", label: "Rastreo" },
  { to: "/guias-prepagadas", label: "Guías Prepagadas" },
  { to: "/blog", label: "Insights" },
  { to: "/sucursales", label: "Sucursales" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container-pmm flex items-center justify-between h-20">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#E30613] flex items-center justify-center font-display text-2xl text-white tracking-tighter group-hover:rotate-3 transition-transform">
            P
          </div>
          <div className="leading-none">
            <div className="font-display text-2xl text-white tracking-tight">PMM</div>
            <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500">
              Transportando emociones
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-[13px] font-medium tracking-wide red-line transition-colors ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/facturacion"
            data-testid="nav-facturacion"
            className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Facturación
          </Link>
          <Link
            to="/cotizador"
            data-testid="cta-cotizar-nav"
            className="bg-[#E30613] hover:bg-[#FF1A27] text-white text-[13px] font-semibold px-5 py-3 transition-all active:scale-95"
          >
            Cotizar envío
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
          className="lg:hidden text-white"
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-nav border-t border-white/5 px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block text-zinc-300 hover:text-white text-base font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/facturacion" className="block text-zinc-300 hover:text-white text-base font-medium">
            Facturación
          </Link>
          <Link
            to="/cotizador"
            className="block w-full bg-[#E30613] text-white text-center py-3 mt-2 font-semibold"
          >
            Cotizar envío
          </Link>
        </div>
      )}
    </header>
  );
}
