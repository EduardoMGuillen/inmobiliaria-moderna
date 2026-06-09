import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import type { Property } from "@/lib/types";

export function absoluteUrl(path: string) {
  return new URL(path, BRAND.siteUrl).toString();
}

export function buildAgentJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: BRAND.name,
    image: absoluteUrl(BRAND.logo),
    logo: absoluteUrl(BRAND.logo),
    "@id": BRAND.siteUrl,
    url: BRAND.siteUrl,
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Colonia Moderna",
      addressLocality: "San Pedro Sula",
      addressRegion: "Cortés",
      postalCode: "21102",
      addressCountry: "HN",
    },
    areaServed: {
      "@type": "Country",
      name: "Honduras",
    },
    priceRange: "$$",
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
  };
}

export function buildPropertyMetadata(property: Property): Metadata {
  const title = `${property.title} en ${property.municipio} | ${BRAND.shortName}`;
  const details = property.details?.slice(0, 3).join(" · ") ?? "";
  const description = `${property.category} en ${property.status} — ${property.municipio}, ${property.department}. ${property.price}.${details ? ` ${details}.` : ""}`;
  const url = absoluteUrl(`/inmueble/${property.id}`);

  return {
    title,
    description,
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
  title: `${BRAND.name} | Compra, Renta y Vende en Honduras`,
  description: `${BRAND.name} — ${BRAND.description} Casas, apartamentos, terrenos y bodegas en venta y renta en Honduras.`,
  alternates: { canonical: BRAND.siteUrl },
  openGraph: {
    title: `${BRAND.name} | Bienes Raíces en Honduras`,
    description: BRAND.tagline,
    url: BRAND.siteUrl,
    type: "website",
    locale: "es_HN",
    siteName: BRAND.name,
    images: [{ url: absoluteUrl(BRAND.logo), alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} | Bienes Raíces en Honduras`,
    description: BRAND.tagline,
    images: [absoluteUrl(BRAND.logo)],
  },
};

export const inmueblesMetadata: Metadata = {
  title: `Inmuebles en Venta y Renta | ${BRAND.name}`,
  description:
    "Explora casas, apartamentos, terrenos y bodegas en venta y renta en Honduras. Propiedades en San Pedro Sula, Cortés y todo el país.",
  alternates: { canonical: absoluteUrl("/inmuebles") },
  openGraph: {
    title: `Inmuebles en Venta y Renta | ${BRAND.name}`,
    description:
      "Catálogo de propiedades en venta y renta en Honduras. Encuentra tu inmueble ideal con Secaira.",
    url: absoluteUrl("/inmuebles"),
    type: "website",
    locale: "es_HN",
    siteName: BRAND.name,
    images: [{ url: absoluteUrl(BRAND.logo), alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Inmuebles en Venta y Renta | ${BRAND.name}`,
    description: "Catálogo de propiedades en venta y renta en Honduras.",
    images: [absoluteUrl(BRAND.logo)],
  },
};
