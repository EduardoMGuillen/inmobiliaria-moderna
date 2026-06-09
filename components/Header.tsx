"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BRAND } from "@/lib/brand";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/inmuebles", label: "Inmuebles" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between rounded-2xl border border-gold-400/20 bg-black/80 px-4 py-3 shadow-lg backdrop-blur-xl"
        >
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={BRAND.logo}
              alt={BRAND.name}
              width={48}
              height={48}
              className="h-10 w-10 rounded-lg object-contain"
            />
            <span className="hidden font-display text-sm font-semibold uppercase tracking-wider text-white sm:block">
              <span className="text-gradient">Secaira</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.replace("/#", "/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition hover:text-gold-400 ${
                    isActive ? "text-gold-400" : "text-white/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {(BRAND.whatsapp || BRAND.phone) && (
            <a
              href={BRAND.whatsapp || `tel:${BRAND.phoneRaw}`}
              target={BRAND.whatsapp ? "_blank" : undefined}
              rel={BRAND.whatsapp ? "noopener noreferrer" : undefined}
              className="hidden rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 sm:inline-flex"
            >
              {BRAND.whatsapp ? "WhatsApp" : "Llamar"}
            </a>
            )}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/30 bg-surface-elevated text-white md:hidden"
              aria-expanded={open}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden rounded-2xl border border-gold-400/20 bg-black/95 shadow-xl backdrop-blur-xl md:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-white/90 hover:bg-gold-400/10 hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                ))}
                {(BRAND.whatsapp || BRAND.phone) && (
                <a
                  href={BRAND.whatsapp || `tel:${BRAND.phoneRaw}`}
                  target={BRAND.whatsapp ? "_blank" : undefined}
                  rel={BRAND.whatsapp ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-gold-gradient py-3 text-center text-sm font-semibold text-black"
                >
                  {BRAND.whatsapp ? "WhatsApp" : "Llamar"}
                </a>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
