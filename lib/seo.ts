import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import type { Property } from "@/lib/types";

export function absoluteUrl(path: string) {
  return new URL(path, BRAND.siteUrl).toString();
}

export function socialSameAs() {
  return [BRAND.instagram, BRAND.facebook, BRAND.tiktok, BRAND.whatsapp].filter(Boolean);
}

export function buildAgentJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    "@id": `${BRAND.siteUrl}/#organization`,
    name: BRAND.name,
    alternateName: BRAND.alternateName,
    description: BRAND.description,
    image: absoluteUrl(BRAND.logo),
    logo: absoluteUrl(BRAND.logo),
    url: BRAND.siteUrl,
    telephone: BRAND.phone,
    email: BRAND.email,
    priceRange: "$$",
    currenciesAccepted: "HNL, USD",
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.streetAddress,
      addressLocality: BRAND.addressLocality,
      addressRegion: BRAND.addressRegion,
      postalCode: BRAND.postalCode,
      addressCountry: BRAND.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BRAND.latitude,
      longitude: BRAND.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${BRAND.latitude},${BRAND.longitude}`,
    areaServed: [
      { "@type": "Country", name: "Honduras" },
      { "@type": "AdministrativeArea", name: "Cortés" },
      { "@type": "City", name: "San Pedro Sula" },
      { "@type": "City", name: "Choloma" },
      { "@type": "City", name: "La Lima" },
      { "@type": "City", name: "Villanueva" },
    ],
    knowsAbout: [
      "Bienes raíces en Honduras",
      "Casas en venta San Pedro Sula",
      "Apartamentos en renta",
      "Terrenos en venta",
      "Bodegas comerciales",
      "Asesoría inmobiliaria",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BRAND.phone,
      contactType: "customer service",
      areaServed: "HN",
      availableLanguage: ["Spanish"],
    },
    sameAs: socialSameAs(),
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BRAND.siteUrl}/#website`,
    name: BRAND.name,
    alternateName: BRAND.alternateName,
    url: BRAND.siteUrl,
    description: BRAND.description,
    inLanguage: "es-HN",
    publisher: { "@id": `${BRAND.siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BRAND.siteUrl}/inmuebles`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Dónde está ubicada Secaira Soluciones Inmobiliarias?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Secaira Soluciones Inmobiliarias está en ${BRAND.address}, Honduras. Atiende clientes en San Pedro Sula, Cortés y a nivel nacional.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Qué servicios ofrece Secaira Inmobiliaria?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ofrece asesoría para compra, venta y renta de casas, apartamentos, terrenos y bodegas, con acompañamiento profesional en Honduras.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo contacto a Secaira para agendar una cita?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Puedes escribir por WhatsApp al ${BRAND.phone}, enviar un correo a ${BRAND.email}, o agendar una cita desde el formulario en ${BRAND.siteUrl}. También estamos en Instagram @secaira_inmobiliaria, Facebook y TikTok @secairainmobiliaria.`,
        },
      },
      {
        "@type": "Question",
        name: "¿En qué zonas de Honduras trabaja Secaira?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Principalmente en San Pedro Sula y el departamento de Cortés (Choloma, La Lima, Villanueva y alrededores), además de propiedades en otras zonas de Honduras.",
        },
      },
    ],
  };
}

export function buildPropertyJsonLd(property: Property) {
  const images = property.images?.length ? property.images : [property.image];
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: `${property.category} en ${property.municipio}, ${property.department} — ${property.status}`,
    url: absoluteUrl(`/inmueble/${property.id}`),
    image: images,
    offers: {
      "@type": "Offer",
      price: property.price,
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "RealEstateAgent",
      name: BRAND.name,
      url: BRAND.siteUrl,
      telephone: BRAND.phone,
    },
  };
}

export function buildPropertyMetadata(property: Property): Metadata {
  const title = `${property.title} en ${property.municipio} | ${BRAND.shortName}`;
  const details = property.details?.slice(0, 3).join(" · ") ?? "";
  const description = `${property.category} en ${property.status} — ${property.municipio}, ${property.department}. ${property.price}.${details ? ` ${details}.` : ""} Contacta a ${BRAND.shortName} en San Pedro Sula.`;
  const url = absoluteUrl(`/inmueble/${property.id}`);

  return {
    title,
    description,
    keywords: [
      property.title,
      property.category,
      property.municipio,
      property.department,
      property.status,
      "inmobiliaria Honduras",
      "Secaira",
      "San Pedro Sula",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "es_HN",
      siteName: BRAND.name,
      images: [{ url: property.image, alt: property.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [property.image],
    },
  };
}

export const homeMetadata: Metadata = {
  title: `${BRAND.name} | Compra, Renta y Vende en San Pedro Sula, Honduras`,
  description: `${BRAND.description} Agenda una cita al ${BRAND.phone} o visita nuestro catálogo en línea.`,
  keywords: [
    "inmobiliaria San Pedro Sula",
    "Secaira Inmobiliaria",
    "casas en venta Honduras",
    "apartamentos en renta Cortés",
    "terrenos en venta",
    "bodegas San Pedro Sula",
    "bienes raíces Honduras",
    "inmobiliaria Cortés",
  ],
  authors: [{ name: BRAND.name, url: BRAND.siteUrl }],
  creator: BRAND.name,
  publisher: BRAND.name,
  category: "Real Estate",
  alternates: { canonical: BRAND.siteUrl },
  other: {
    "geo.region": "HN-CR",
    "geo.placename": "San Pedro Sula",
    "geo.position": `${BRAND.latitude};${BRAND.longitude}`,
    ICBM: `${BRAND.latitude}, ${BRAND.longitude}`,
  },
  openGraph: {
    title: `${BRAND.name} | Bienes Raíces en San Pedro Sula`,
    description: BRAND.description,
    url: BRAND.siteUrl,
    type: "website",
    locale: "es_HN",
    siteName: BRAND.name,
    images: [{ url: absoluteUrl(BRAND.logo), alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} | Bienes Raíces en Honduras`,
    description: BRAND.description,
    images: [absoluteUrl(BRAND.logo)],
  },
};

export const inmueblesMetadata: Metadata = {
  title: `Inmuebles en Venta y Renta | ${BRAND.name}`,
  description:
    "Explora casas, apartamentos, terrenos y bodegas en venta y renta en San Pedro Sula, Cortés y Honduras. Catálogo actualizado de Secaira Soluciones Inmobiliarias.",
  keywords: [
    "inmuebles en venta San Pedro Sula",
    "casas en renta Honduras",
    "apartamentos Cortés",
    "Secaira inmobiliaria catálogo",
  ],
  alternates: { canonical: absoluteUrl("/inmuebles") },
  openGraph: {
    title: `Inmuebles en Venta y Renta | ${BRAND.name}`,
    description:
      "Catálogo de propiedades en venta y renta en Honduras. Encuentra tu inmueble ideal con Secaira en San Pedro Sula.",
    url: absoluteUrl("/inmuebles"),
    type: "website",
    locale: "es_HN",
    siteName: BRAND.name,
    images: [{ url: absoluteUrl(BRAND.logo), alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Inmuebles en Venta y Renta | ${BRAND.name}`,
    description: "Catálogo de propiedades en venta y renta en San Pedro Sula y Honduras.",
    images: [absoluteUrl(BRAND.logo)],
  },
};
