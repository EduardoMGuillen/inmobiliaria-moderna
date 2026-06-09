import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-gold-400/10 bg-black py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Image
            src={BRAND.logo}
            alt={BRAND.name}
            width={120}
            height={120}
            className="h-24 w-auto object-contain"
          />
          <p className="mt-4 max-w-md text-sm text-white/50">
            {BRAND.name} — Expertos en bienes raíces en Honduras.
          </p>
          <div className="mt-6 flex gap-6">
            <Link href="/" className="text-sm text-white/60 hover:text-gold-400">
              Inicio
            </Link>
            <Link href="/inmuebles" className="text-sm text-white/60 hover:text-gold-400">
              Inmuebles
            </Link>
            <Link href="/#contacto" className="text-sm text-white/60 hover:text-gold-400">
              Contacto
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-gold-400/10 pt-8 text-sm text-white/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.</p>
          <p>
            <a
              href={BRAND.nexusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold-400 transition hover:underline"
            >
              Powered by Nexus Global Suministros
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
