import React from "react";
import { Link } from "react-router-dom";

export default function PageHeader({ overline, title, description, breadcrumbs = [], image }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 border-b border-white/5 overflow-hidden bg-[#2D2D2D] text-white">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E008D] via-[#1E008D]/70 to-[#1E008D]/30" />
        </>
      )}
      <div className="container-pmm relative z-10">
        {breadcrumbs.length > 0 && (
          <nav className="mb-8 text-xs font-mono uppercase tracking-[0.2em] text-white/60">
            <Link to="/" className="hover:text-white">Inicio</Link>
            {breadcrumbs.map((b, i) => (
              <span key={i}>
                <span className="mx-3">/</span>
                {b.to ? <Link to={b.to} className="hover:text-white">{b.label}</Link> : <span className="text-white">{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {overline && <div className="text-overline-on-dark mb-6">{overline}</div>}
        <h1 className="font-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-8 text-white/85 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
