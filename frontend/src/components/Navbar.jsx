import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User, ChevronDown, LogOut, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/servicios/empresas", label: "Empresas" },
  { to: "/servicios/personas", label: "Personas" },
  { to: "/cobertura", label: "Cobertura" },
  { to: "/tienda", label: "Tienda" },
  { to: "/blog", label: "Insights" },
];

function UserMenu({ user, dark, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  const initials = (user.name || user.email || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="user-menu-button"
        className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-white" : "text-[#2D2D2D]"} hover:text-[#1E008D] transition-colors`}
      >
        <div className="w-8 h-8 rounded-full bg-[#1E008D] text-white text-[11px] font-semibold flex items-center justify-center overflow-hidden">
          {user.picture ? <img src={user.picture} alt="" className="w-full h-full object-cover" /> : initials}
        </div>
        <span className="hidden xl:inline max-w-[120px] truncate">{user.name?.split(" ")[0] || user.email}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E5E5E5] shadow-2xl py-2 z-50">
          <div className="px-4 py-3 border-b border-[#E5E5E5]">
            <div className="font-display text-base text-[#2D2D2D] truncate">{user.name || "Cliente PMM"}</div>
            <div className="text-xs font-mono text-[#6B6B6B] truncate">{user.email}</div>
          </div>
          <Link to="/cuenta" data-testid="menu-cuenta" className="flex items-center gap-3 px-4 py-3 text-sm text-[#2D2D2D] hover:bg-[#FAFAFA]">
            <User size={14} /> Mi cuenta
          </Link>
          <Link to="/cuenta" className="flex items-center gap-3 px-4 py-3 text-sm text-[#2D2D2D] hover:bg-[#FAFAFA]">
            <Package size={14} /> Mis pedidos
          </Link>
          <button onClick={onLogout} data-testid="menu-logout" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50">
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalCount, setOpen: setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const transparent = onHome && !scrolled;
  const textColor = transparent ? "text-white" : "text-[#2D2D2D]";
  const textMuted = transparent ? "text-white/70" : "text-[#6B6B6B]";

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${transparent ? "bg-transparent" : "glass-nav"}`}
    >
      <div className="container-pmm flex items-center justify-between h-20">
        <Link to="/" data-testid="logo-link" className="flex items-center group shrink-0">
          <img src={transparent ? `${process.env.PUBLIC_URL}/pmm-blanco.svg` : `${process.env.PUBLIC_URL}/pmm-azul.svg`} alt="PMM" className="h-9 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-[13px] font-medium tracking-wide nav-underline transition-colors ${
                  isActive
                    ? (transparent ? "text-white" : "text-[#1E008D]")
                    : transparent
                      ? "text-white/70 hover:text-white"
                      : "text-[#6B6B6B] hover:text-[#2D2D2D]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setCartOpen(true)}
            data-testid="cart-button"
            className={`relative p-2 ${textColor} hover:text-[#3DAE2B] transition-colors`}
            aria-label="Carrito"
          >
            <ShoppingBag size={20} />
            {totalCount > 0 && (
              <span data-testid="cart-badge" className="absolute -top-1 -right-1 bg-[#3DAE2B] text-white text-[10px] font-mono min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">{totalCount}</span>
            )}
          </button>

          {user ? (
            <UserMenu user={user} dark={transparent} onLogout={onLogout} />
          ) : (
            <Link to="/login" data-testid="nav-login" className={`text-[13px] font-medium ${transparent ? "text-white/70 hover:text-white" : "text-[#6B6B6B] hover:text-[#2D2D2D]"}`}>
              Iniciar sesión
            </Link>
          )}

          <Link
            to="/facturacion"
            data-testid="nav-facturacion"
            className={`text-[13px] font-medium ${transparent ? "text-white/70 hover:text-white" : "text-[#6B6B6B] hover:text-[#2D2D2D]"}`}
          >
            Facturación
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
          <Link to="/facturacion" className="block text-[#2D2D2D] hover:text-[#1E008D] text-base font-medium">Facturación</Link>
          <button onClick={() => { setCartOpen(true); setOpen(false); }} className="flex items-center gap-2 text-[#2D2D2D] text-base font-medium">
            <ShoppingBag size={18} /> Carrito {totalCount > 0 && `(${totalCount})`}
          </button>
          {user ? (
            <>
              <Link to="/cuenta" className="block text-[#2D2D2D] hover:text-[#1E008D] text-base font-medium">Mi cuenta</Link>
              <button onClick={onLogout} className="block text-red-600 text-base font-medium text-left">Cerrar sesión</button>
            </>
          ) : (
            <Link to="/login" className="block text-[#1E008D] text-base font-semibold">Iniciar sesión</Link>
          )}
        </div>
      )}
    </header>
  );
}
