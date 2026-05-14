import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="bg-[#1E008D] text-white relative overflow-hidden">
      <div className="container-pmm pt-24 pb-12 relative z-10">
        {/* Big CTA */}
        <div className="border-b border-white/10 pb-20 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="text-overline-on-dark mb-6">Hablemos</div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white">
              ¿Listo para mover<br />
              <em className="text-[#3DAE2B] not-italic">lo que importa</em>?
            </h2>
          </div>
          <Link
            to="/contacto"
            data-testid="footer-cta-contacto"
            className="inline-flex items-center gap-3 group shrink-0"
          >
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/70 group-hover:text-white">
              Contáctanos
            </span>
            <div className="w-14 h-14 rounded-full border border-white/30 group-hover:bg-[#3DAE2B] group-hover:border-[#3DAE2B] flex items-center justify-center transition-all">
              <ArrowUpRight className="text-white" size={20} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2">
            <img src={`${process.env.PUBLIC_URL}/pmm-blanco.svg`} alt="PMM" className="h-10 w-auto mb-6" />
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Paquetería y Mensajería. Tu socio logístico en México con más de 30 años transportando emociones a cada rincón del país.
            </p>
          </div>

          <div>
            <div className="text-overline-on-dark mb-5">Servicios</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/servicios/empresas" className="text-white/70 hover:text-white">Empresas (B2B)</Link></li>
              <li><Link to="/servicios/personas" className="text-white/70 hover:text-white">Personas</Link></li>
              <li><Link to="/guias-prepagadas" className="text-white/70 hover:text-white">Guías Prepagadas</Link></li>
              <li><Link to="/cotizador" className="text-white/70 hover:text-white">Cotizador</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-overline-on-dark mb-5">Soporte</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/rastreo" className="text-white/70 hover:text-white">Rastrear envío</Link></li>
              <li><Link to="/cobertura" className="text-white/70 hover:text-white">Cobertura</Link></li>
              <li><Link to="/cobertura" className="text-white/70 hover:text-white">Cobertura y sucursales</Link></li>
              <li><Link to="/facturacion" className="text-white/70 hover:text-white">Facturación</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-white">Insights</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-overline-on-dark mb-5">Contacto</div>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2"><Phone size={14} className="mt-1 shrink-0" /><span>800 PMM (766) </span></li>
              <li className="flex gap-2"><Mail size={14} className="mt-1 shrink-0" /><span>atencion@pmm.com.mx</span></li>
              <li className="flex gap-2"><MapPin size={14} className="mt-1 shrink-0" /><span>16+ estados, 29+ ciudades</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-white/10">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            © {new Date().getFullYear()} PMM Paquetería y Mensajería · Orgullosamente Mexicanos
          </div>
          <div className="flex gap-6 text-xs text-white/50">
            <a href="#" className="hover:text-white">Aviso de privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">#TransportandoEmociones</a>
          </div>
        </div>
      </div>

      {/* Massive watermark */}
      <div className="absolute -bottom-16 left-0 right-0 text-[20vw] font-display leading-none text-white/[0.03] select-none pointer-events-none">
        PMM
      </div>
    </footer>
  );
}
