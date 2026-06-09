"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { Property } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";
import { MotionSection } from "./MotionSection";
import Link from "next/link";

export function FeaturedCarousel() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
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

  const next = useCallback(() => {
    if (properties.length) setCurrent((c) => (c + 1) % properties.length);
  }, [properties.length]);

  const prev = useCallback(() => {
    if (properties.length) setCurrent((c) => (c - 1 + properties.length) % properties.length);
  }, [properties.length]);

  useEffect(() => {
    if (properties.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [properties.length, next]);

  const openGallery = (images: string[], title: string) => {
    setGallery({ images, title });
    setGalleryIndex(0);
  };

  return (
    <section id="destacados" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionSection>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">
              Selección premium
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Inmuebles <span className="text-gradient">destacados</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Las mejores propiedades seleccionadas por nuestro equipo de expertos.
            </p>
          </div>
        </MotionSection>

        {loading ? (
          <div className="mt-14 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          </div>
        ) : properties.length === 0 ? (
          <p className="mt-14 text-center text-white/50">No hay inmuebles destacados por el momento.</p>
        ) : (
          <div className="relative mt-14">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="mx-auto max-w-md sm:max-w-lg lg:max-w-xl"
                >
                  <PropertyCard
                    property={properties[current]}
                    onGalleryOpen={openGallery}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {properties.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-gold-400/30 bg-black/80 p-3 text-gold-400 backdrop-blur transition hover:bg-gold-400/10 sm:-left-4"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-gold-400/30 bg-black/80 p-3 text-gold-400 backdrop-blur transition hover:bg-gold-400/10 sm:-right-4"
                  aria-label="Siguiente"
                >
                  ›
                </button>
                <div className="mt-6 flex justify-center gap-2">
                  {properties.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === current ? "w-8 bg-gold-400" : "w-2 bg-white/30"
                      }`}
                      aria-label={`Ir a slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/inmuebles"
            className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-8 py-3 text-sm font-semibold text-gold-400 transition hover:bg-gold-400/10"
          >
            Ver todos los inmuebles →
          </Link>
        </div>
      </div>

      {/* Gallery Modal */}
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
              className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
              onClick={() => setGallery(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-surface-elevated px-4 py-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIndex((i) => (i - 1 + gallery.images.length) % gallery.images.length);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-surface-elevated px-4 py-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIndex((i) => (i + 1) % gallery.images.length);
              }}
            >
              ›
            </button>
            <div className="max-h-[80vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={gallery.images[galleryIndex]}
                alt={gallery.title}
                width={1200}
                height={800}
                className="max-h-[70vh] w-auto rounded-xl object-contain"
                unoptimized
              />
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {gallery.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
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
