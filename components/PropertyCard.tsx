"use client";

import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { BRAND } from "@/lib/brand";

type PropertyCardProps = {
  property: Property;
  onGalleryOpen?: (images: string[], title: string) => void;
  compact?: boolean;
};

function StatusBadge({ status }: { status: string }) {
  const isVenta = status === "venta";
  return (
    <span
      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        isVenta
          ? "bg-red-600/90 text-white"
          : "bg-gold-400/90 text-black"
      }`}
    >
      {status}
    </span>
  );
}

export function PropertyCard({ property, onGalleryOpen, compact = false }: PropertyCardProps) {
  const images = property.images?.length ? property.images : [property.image];
  const waText =
    property.whatsappText ||
    `Hola, me interesa el inmueble: ${property.title} (${property.price})`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold-400/20 bg-surface-card shadow-card transition hover:border-gold-400/40 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={property.image.startsWith("http")}
        />
        <StatusBadge status={property.status} />
        {property.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-400 px-2.5 py-1 text-xs font-bold text-black">
            ★ Destacado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-gold-400">
          {property.category}
        </span>
        <h3 className="mt-1 font-display text-xl font-semibold text-white">{property.title}</h3>
        <p className="mt-1 text-sm text-white/60">
          {property.municipio}, {property.department}
        </p>
        <p className="mt-3 font-display text-2xl font-semibold text-gradient">{property.price}</p>

        {!compact && property.details?.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {property.details.slice(0, 3).map((d) => (
              <li
                key={d}
                className="rounded-lg bg-surface-elevated px-2.5 py-1 text-xs text-white/70"
              >
                {d}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:flex-wrap">
          <Link
            href={`/inmueble/${property.id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 sm:flex-1"
          >
            Ver detalles
          </Link>
          <div className="flex gap-2">
            {images.length > 1 && onGalleryOpen && (
              <button
                type="button"
                onClick={() => onGalleryOpen(images, property.title)}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-gold-400/40 px-4 py-2.5 text-sm font-medium text-gold-400 transition hover:bg-gold-400/10 sm:flex-none"
              >
                Fotos
              </button>
            )}
            <a
              href={
                BRAND.whatsapp
                  ? `${BRAND.whatsapp}?text=${encodeURIComponent(waText)}`
                  : `tel:${BRAND.phoneRaw}`
              }
              target={BRAND.whatsapp ? "_blank" : undefined}
              rel={BRAND.whatsapp ? "noopener noreferrer" : undefined}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-gold-400/40 hover:text-gold-400 sm:flex-none"
            >
              Contactar
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
