import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import CartDrawer from "@/components/CartDrawer";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import Cotizador from "@/pages/Cotizador";
import Rastreo from "@/pages/Rastreo";
import Cobertura from "@/pages/Cobertura";
import Servicios from "@/pages/Servicios";
import GuiasPrepagadas from "@/pages/GuiasPrepagadas";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import Sucursales from "@/pages/Sucursales";
import Facturacion from "@/pages/Facturacion";
import Contacto from "@/pages/Contacto";
import Tienda from "@/pages/Tienda";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";
import AuthCallback from "@/pages/AuthCallback";

function AppShell() {
  const location = useLocation();
  // Process Google OAuth callback synchronously before any other route
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  // Hide chrome on /auth/callback and auth pages? Keep navbar/footer except on full-bleed auth.
  const fullBleed = ["/login", "/registro", "/auth/callback"].includes(location.pathname);

  return (
    <>
      {!fullBleed && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cotizador" element={<Cotizador />} />
          <Route path="/rastreo" element={<Rastreo />} />
          <Route path="/cobertura" element={<Cobertura />} />
          <Route path="/servicios/empresas" element={<Servicios audience="empresas" />} />
          <Route path="/servicios/personas" element={<Servicios audience="personas" />} />
          <Route path="/guias-prepagadas" element={<GuiasPrepagadas />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/facturacion" element={<Facturacion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/tienda" element={<ProtectedRoute><Tienda /></ProtectedRoute>} />
          <Route path="/carrito" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/cuenta" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </main>
      {!fullBleed && <Footer />}
      {!fullBleed && <WhatsAppFab />}
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <div className="App min-h-screen bg-[#FAFAFA] text-[#2D2D2D]">
            <BrowserRouter>
              <AppShell />
            </BrowserRouter>
          </div>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
