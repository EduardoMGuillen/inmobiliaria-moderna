import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import Script from "next/script";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const display = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Lato({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: `${BRAND.name} | Compra, Renta y Vende en Honduras`,
  description:
    "Secaira Soluciones Inmobiliarias - Expertos en bienes raíces en Honduras. Casas, apartamentos, terrenos y bodegas en venta y renta.",
  icons: { icon: BRAND.logo, apple: BRAND.logo },
  openGraph: {
    title: `${BRAND.name} | Bienes Raíces en Honduras`,
    description: BRAND.tagline,
    images: [{ url: BRAND.logo, alt: BRAND.name }],
    locale: "es_HN",
    siteName: BRAND.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${BRAND.gaId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${BRAND.gaId}');
          `}
        </Script>
      </body>
    </html>
  );
}
