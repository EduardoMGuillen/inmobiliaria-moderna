import type { Metadata, Viewport } from "next";
import { Montserrat, Lato } from "next/font/google";
import Script from "next/script";
import { BRAND } from "@/lib/brand";
import { homeMetadata } from "@/lib/seo";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  ...homeMetadata,
  icons: { icon: BRAND.logo, apple: BRAND.logo },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans overflow-x-hidden">
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
