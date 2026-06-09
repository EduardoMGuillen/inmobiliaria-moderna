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
      <main className="min-h-screen pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Catálogo</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Todos los <span className="text-gradient">inmuebles</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Explora nuestra selección de propiedades en venta y renta en Honduras.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <div>
              <label className="mb-1 block text-xs text-white/50">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400"
              >
                <option value="">Todas</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Tipo</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400"
              >
                <option value="">Todos</option>
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Departamento</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="rounded-xl border border-gold-400/20 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-gold-400"
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
            <div className="mt-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="mt-20 text-center text-white/50">
              No se encontraron inmuebles con los filtros seleccionados.
            </p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} onGalleryOpen={openGallery} />
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setGallery(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 text-3xl text-white/80"
              onClick={() => setGallery(null)}
            >
              ×
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
              <div className="mt-3 flex gap-2 overflow-x-auto">
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
    </>
  );
}
