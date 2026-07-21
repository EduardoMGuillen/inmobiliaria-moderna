"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { CATEGORIES, DEPARTMENTS } from "@/lib/constants";
import type { Property } from "@/lib/types";
import Image from "next/image";

export default function InmueblesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [gallery, setGallery] = useState<{ images: string[]; title: string } | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) => {
    if (category && p.category !== category) return false;
    if (status && p.status !== status) return false;
    if (department && p.department !== department) return false;
    return true;
  });

  const openGallery = useCallback((images: string[], title: string) => {
    setGallery({ images, title });
    setGalleryIndex(0);
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-x-hidden pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Catálogo</p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Todos los <span className="text-gradient">inmuebles</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl px-1 text-sm text-white/60 sm:text-base">
              Explora nuestra selección de propiedades en venta y renta en Honduras.
            </p>
          </div>

          <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            <div className="min-w-0">
              <label className="mb-1 block text-xs text-white/50">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400"
              >
                <option value="">Todas</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-xs text-white/50">Tipo</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400"
              >
                <option value="">Todos</option>
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-xs text-white/50">Departamento</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400"
              >
                <option value="">Todos</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="mt-16 flex justify-center sm:mt-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="mt-16 text-center text-white/50 sm:mt-20">
              No se encontraron inmuebles con los filtros seleccionados.
            </p>
          ) : (
            <div className="mt-8 grid w-full grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {filtered.map((p) => (
                <div key={p.id} className="min-w-0 w-full">
                  <PropertyCard property={p} onGalleryOpen={openGallery} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/95 p-3 sm:p-4"
            onClick={() => setGallery(null)}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 text-3xl text-white/80 sm:right-4 sm:top-4"
              onClick={() => setGallery(null)}
            >
              ×
            </button>
            <div
              className="flex w-full max-w-[min(90vw,960px)] flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery.images[galleryIndex]}
                alt={gallery.title}
                width={1200}
                height={800}
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain sm:max-h-[70vh]"
                unoptimized
              />
              <div className="mt-3 flex w-full max-w-full gap-2 overflow-x-auto pb-2">
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
    </>
  );
}
