import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import CartDrawer from "@/components/CartDrawer";

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

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <div className="App min-h-screen bg-[#FAFAFA] text-[#2D2D2D]">
          <BrowserRouter>
            <Navbar />
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
                <Route path="/tienda" element={<Tienda />} />
                <Route path="/carrito" element={<Cart />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppFab />
            <CartDrawer />
          </BrowserRouter>
        </div>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
