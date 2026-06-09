import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-gold-400/10 bg-black py-12 sm:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <Image
          src={BRAND.logo}
          alt={BRAND.name}
          width={160}
          height={160}
          className="mx-auto h-28 w-auto object-contain sm:h-32"
        />
        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
          {BRAND.name}
          <br />
          Expertos en bienes raíces en Honduras.
        </p>
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Link href="/" className="text-sm text-white/60 transition hover:text-gold-400 sm:text-base">
            Inicio
          </Link>
          <Link href="/inmuebles" className="text-sm text-white/60 transition hover:text-gold-400 sm:text-base">
            Inmuebles
          </Link>
          <Link href="/#contacto" className="text-sm text-white/60 transition hover:text-gold-400 sm:text-base">
            Contacto
          </Link>
        </nav>

        <div className="mt-10 w-full border-t border-gold-400/10 pt-8">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.
          </p>
          <p className="mt-3 text-sm text-white/40">
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
