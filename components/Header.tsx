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
      <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-2 rounded-2xl border border-gold-400/20 bg-black/80 px-3 py-2.5 shadow-lg backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-3"
        >
          <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Image
              src={BRAND.logo}
              alt={BRAND.name}
              width={56}
              height={56}
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
            />
            <span className="hidden font-display text-base font-semibold uppercase tracking-wider text-white md:block">
              <span className="text-gradient">Secaira</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
            {nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.replace("/#", "/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-semibold transition hover:text-gold-400 ${
                    isActive ? "text-gold-400" : "text-white/85"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="hidden rounded-full border border-gold-400/40 px-4 py-2.5 text-sm font-semibold text-gold-400 transition hover:bg-gold-400/10 sm:inline-flex lg:text-base lg:px-5"
            >
              Iniciar sesión
            </Link>
            {(BRAND.whatsapp || BRAND.phone) && (
              <a
                href={BRAND.whatsapp || `tel:${BRAND.phoneRaw}`}
                target={BRAND.whatsapp ? "_blank" : undefined}
                rel={BRAND.whatsapp ? "noopener noreferrer" : undefined}
                className="hidden rounded-full bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 md:inline-flex lg:px-5 lg:text-base"
              >
                {BRAND.whatsapp ? "WhatsApp" : "Llamar"}
              </a>
            )}
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/30 bg-surface-elevated text-white lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="mt-2 overflow-hidden rounded-2xl border border-gold-400/20 bg-black/95 shadow-xl backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3.5 text-base font-semibold text-white/90 hover:bg-gold-400/10 hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-xl border border-gold-400/30 px-4 py-3.5 text-center text-base font-semibold text-gold-400 hover:bg-gold-400/10"
                >
                  Iniciar sesión
                </Link>
                {(BRAND.whatsapp || BRAND.phone) && (
                  <a
                    href={BRAND.whatsapp || `tel:${BRAND.phoneRaw}`}
                    target={BRAND.whatsapp ? "_blank" : undefined}
                    rel={BRAND.whatsapp ? "noopener noreferrer" : undefined}
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-full bg-gold-gradient py-3.5 text-center text-base font-semibold text-black"
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
