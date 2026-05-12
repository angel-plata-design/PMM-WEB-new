import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://pmm.com.mx";
const DEFAULT_OG = "https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg";

export default function Seo({
  title,
  description,
  path = "/",
  image = DEFAULT_OG,
  type = "website",
  jsonLd,
}) {
  const fullTitle = title
    ? `${title} | PMM — Paquetería y Mensajería`
    : "PMM — Tu socio logístico en México | Paquetería y Mensajería";
  const url = `${SITE_URL}${path}`;
  const desc =
    description ||
    "PMM Paquetería y Mensajería: envíos, rastreo, cotización y cobertura nacional en México. 30+ años transportando emociones.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="es_MX" />
      <meta property="og:site_name" content="PMM" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
