import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Two states:
  //  A) On hero (home, not scrolled) -> transparent + white logo + white text
  //  B) Elsewhere or scrolled -> glass-light bg, blue logo, charcoal text
  const transparent = onHome && !scrolled;

  const textColor = transparent ? "text-white" : "text-[#2D2D2D]";
  const textMuted = transparent ? "text-white/70" : "text-[#6B6B6B]";

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        transparent ? "bg-transparent" : "glass-nav"
      }`}
    >
      <div className="container-pmm flex items-center justify-between h-20">
        <Link to="/" data-testid="logo-link" className="flex items-center group">
          <img
            src={transparent ? "/pmm-blanco.svg" : "/pmm-azul.svg"}
            alt="PMM Paquetería y Mensajería"
            className="h-9 w-auto transition-opacity duration-300"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-[13px] font-medium tracking-wide nav-underline transition-colors ${
                  isActive
                    ? (transparent ? "text-white" : "text-[#1E008D]")
                    : `${textMuted} hover:${transparent ? "text-white" : "text-[#2D2D2D]"}`
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <Link
            to="/facturacion"
            data-testid="nav-facturacion"
            className={`text-[13px] font-medium transition-colors ${textMuted} hover:${transparent ? "text-white" : "text-[#2D2D2D]"}`}
          >
            Facturación
          </Link>
          <Link
            to="/cotizador"
            data-testid="cta-cotizar-nav"
            className="btn-primary text-[13px] font-semibold px-5 py-3"
          >
            Cotizar envío
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
          className={`lg:hidden ${textColor}`}
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-[#E5E5E5] px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="block text-[#2D2D2D] hover:text-[#1E008D] text-base font-medium">
              {item.label}
            </Link>
          ))}
          <Link to="/facturacion" className="block text-[#2D2D2D] hover:text-[#1E008D] text-base font-medium">
            Facturación
          </Link>
          <Link to="/cotizador" className="block btn-primary text-center py-3 mt-2 font-semibold">
            Cotizar envío
          </Link>
        </div>
      )}
    </header>
  );
}
