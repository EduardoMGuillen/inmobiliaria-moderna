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
      className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:left-3 sm:top-3 sm:px-3 sm:text-xs ${
        isVenta ? "bg-red-600/90 text-white" : "bg-gold-400/90 text-black"
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
    <article className="group flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-gold-400/20 bg-surface-card shadow-card transition hover:border-gold-400/40 hover:shadow-glow">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
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
          <span className="absolute right-2 top-2 rounded-full bg-gold-400 px-2 py-1 text-[10px] font-bold text-black sm:right-3 sm:top-3 sm:px-2.5 sm:text-xs">
            ★ Destacado
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-gold-400">
          {property.category}
        </span>
        <h3 className="mt-1 break-words font-display text-lg font-semibold leading-snug text-white sm:text-xl">
          {property.title}
        </h3>
        <p className="mt-1 truncate text-sm text-white/60">
          {property.municipio}, {property.department}
        </p>
        <p className="mt-3 break-words font-display text-xl font-semibold text-gradient sm:text-2xl">
          {property.price}
        </p>

        {!compact && property.details?.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {property.details.slice(0, 3).map((d) => (
              <li
                key={d}
                className="max-w-full truncate rounded-lg bg-surface-elevated px-2.5 py-1 text-xs text-white/70"
              >
                {d}
              </li>
            ))}
          </ul>
        )}

          <div
            className={`mt-auto grid w-full min-w-0 gap-2 pt-4 ${
              images.length > 1 && onGalleryOpen ? "grid-cols-1 sm:grid-cols-[1fr_auto_auto]" : "grid-cols-1"
            }`}
          >
            <Link
              href={`/inmueble/${property.id}`}
              className="inline-flex w-full items-center justify-center rounded-lg bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 sm:col-span-1"
            >
              Ver detalles
            </Link>
            {images.length > 1 && onGalleryOpen && (
              <button
                type="button"
                onClick={() => onGalleryOpen(images, property.title)}
                className="inline-flex items-center justify-center rounded-lg border border-gold-400/40 px-4 py-2.5 text-sm font-medium text-gold-400 transition hover:bg-gold-400/10"
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
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-gold-400/40 hover:text-gold-400"
            >
              Contactar
            </a>
          </div>
      </div>
    </article>
  );
}
