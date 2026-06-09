"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { Property } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";
import { MotionSection } from "./MotionSection";
import Link from "next/link";

const PER_PAGE = 3;

export function FeaturedCarousel() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [gallery, setGallery] = useState<{ images: string[]; title: string } | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    fetch("/api/properties?featured=1")
      .then((r) => r.json())
      .then((data) => {
        setProperties(Array.isArray(data) ? data.slice(0, 5) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(properties.length / PER_PAGE));
  const visible = properties.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const next = useCallback(() => {
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  const prev = useCallback(() => {
    setPage((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (properties.length <= PER_PAGE) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [properties.length, next]);

  const openGallery = (images: string[], title: string) => {
    setGallery({ images, title });
    setGalleryIndex(0);
  };

  return (
    <section id="destacados" className="scroll-mt-28 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionSection>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">
              Selección premium
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Inmuebles <span className="text-gradient">destacados</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/60 sm:text-base">
              Las mejores propiedades seleccionadas por nuestro equipo de expertos.
            </p>
          </div>
        </MotionSection>

        {loading ? (
          <div className="mt-12 flex justify-center sm:mt-14">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          </div>
        ) : properties.length === 0 ? (
          <p className="mt-12 text-center text-white/50 sm:mt-14">
            No hay inmuebles destacados por el momento.
          </p>
        ) : (
          <div className="relative mt-10 sm:mt-14">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                  >
                    <PropertyCard property={property} onGalleryOpen={openGallery} compact />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-gold-400/30 bg-black/90 p-3 text-lg text-gold-400 backdrop-blur transition hover:bg-gold-400/10 lg:flex"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-gold-400/30 bg-black/90 p-3 text-lg text-gold-400 backdrop-blur transition hover:bg-gold-400/10 lg:flex"
                  aria-label="Siguiente"
                >
                  ›
                </button>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={prev}
                    className="rounded-full border border-gold-400/30 bg-surface-elevated px-4 py-2 text-sm text-gold-400 lg:hidden"
                  >
                    ‹ Anterior
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === page ? "w-8 bg-gold-400" : "w-2 bg-white/30"
                        }`}
                        aria-label={`Página ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    className="rounded-full border border-gold-400/30 bg-surface-elevated px-4 py-2 text-sm text-gold-400 lg:hidden"
                  >
                    Siguiente ›
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/inmuebles"
            className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-6 py-3 text-sm font-semibold text-gold-400 transition hover:bg-gold-400/10 sm:px-8"
          >
            Ver todos los inmuebles →
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setGallery(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 text-3xl text-white/80 hover:text-white"
              onClick={() => setGallery(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-surface-elevated px-3 py-2 text-white sm:left-4 sm:px-4"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIndex((i) => (i - 1 + gallery.images.length) % gallery.images.length);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-lg bg-surface-elevated px-3 py-2 text-white sm:right-4 sm:px-4"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIndex((i) => (i + 1) % gallery.images.length);
              }}
            >
              ›
            </button>
            <div className="max-h-[85vh] w-full max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={gallery.images[galleryIndex]}
                alt={gallery.title}
                width={1200}
                height={800}
                className="mx-auto max-h-[65vh] w-auto rounded-xl object-contain sm:max-h-[70vh]"
                unoptimized
              />
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {gallery.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 sm:h-16 sm:w-16 ${
                      i === galleryIndex ? "border-gold-400" : "border-transparent opacity-60"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
