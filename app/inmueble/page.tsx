"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BRAND } from "@/lib/brand";
import type { Property } from "@/lib/types";

function InmuebleDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/properties?id=${encodeURIComponent(id)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-28">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-28 text-center">
        <h1 className="font-display text-2xl text-white">Inmueble no encontrado</h1>
        <Link href="/inmuebles" className="mt-4 text-gold-400 hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [property.image];
  const waText =
    property.whatsappText ||
    `Hola, me interesa el inmueble: ${property.title} (${property.price})`;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <Link href="/inmuebles" className="mb-6 inline-flex text-sm text-gold-400 hover:underline">
        ← Volver al catálogo
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold-400/20">
            <Image
              src={images[activeImage]}
              alt={property.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                property.status === "venta"
                  ? "bg-red-600 text-white"
                  : "bg-gold-400 text-black"
              }`}
            >
              {property.status}
            </span>
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === activeImage ? "border-gold-400" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-sm font-medium uppercase tracking-wider text-gold-400">
            {property.category}
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 text-white/60">
            {property.municipio}, {property.department}
          </p>
          <p className="mt-4 font-display text-4xl font-semibold text-gradient">{property.price}</p>

          {property.details?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-white">Detalles</h2>
              <ul className="mt-3 space-y-2">
                {property.details.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-white/70">
                    <span className="text-gold-400">✓</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {property.amenities?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-white">Amenidades</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-lg bg-surface-elevated px-3 py-1.5 text-sm text-white/70"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={
                BRAND.whatsapp
                  ? `${BRAND.whatsapp}?text=${encodeURIComponent(waText)}`
                  : `tel:${BRAND.phoneRaw}`
              }
              target={BRAND.whatsapp ? "_blank" : undefined}
              rel={BRAND.whatsapp ? "noopener noreferrer" : undefined}
              className="inline-flex items-center justify-center rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              {BRAND.whatsapp ? "Contactar por WhatsApp" : "Llamar"}
            </a>
            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center rounded-full border border-gold-400/40 px-8 py-3.5 text-sm font-semibold text-gold-400 transition hover:bg-gold-400/10"
            >
              Agendar visita
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InmueblePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center pt-28">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
            </div>
          }
        >
          <InmuebleDetail />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
