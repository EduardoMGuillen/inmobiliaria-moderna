"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { SocialLinks } from "@/components/SocialLinks";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-hero-mesh" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <Image
              src={BRAND.logo}
              alt={BRAND.name}
              width={500}
              height={500}
              className="mx-auto h-auto w-[min(70vw,420px)] object-contain"
              priority
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2 inline-flex max-w-[95%] items-center gap-2 rounded-full border border-gold-400/30 bg-surface-elevated/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold-400 backdrop-blur sm:px-4 sm:text-xs"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
            Soluciones Inmobiliarias en Honduras
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="max-w-full px-1 font-display text-2xl font-semibold leading-snug tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {BRAND.tagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 max-w-2xl px-1 text-base text-white/70 sm:text-lg"
          >
            {BRAND.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex w-full max-w-md flex-col gap-3 px-1 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4"
          >
            <a
              href="#destacados"
              className="inline-flex w-full items-center justify-center rounded-full bg-gold-gradient px-6 py-3.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-105 sm:w-auto sm:px-8"
            >
              Ver inmuebles destacados
            </a>
            <a
              href="/inmuebles"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-gold-400/50 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:border-gold-400 hover:text-gold-400 sm:w-auto sm:px-8"
            >
              Catálogo completo
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-10"
          >
            <SocialLinks
              iconClassName="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 bg-surface-elevated text-gold-400 transition hover:bg-gold-400/10 hover:text-gold-300"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
