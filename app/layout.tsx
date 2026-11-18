import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { WATCHES } from "@/data/watches";
import { TIKTOK_URL, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxstorec.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LUXSTOREC | Relojes de Lujo y Colección en Quito, Ecuador",
    template: "%s | LUXSTOREC Ecuador",
  },
  description:
    "Firma privada de alta relojería en Quito, Ecuador. Rolex, Cartier, Omega, Patek Philippe y Audemars Piguet sin sobreprecios, con verificación en video HD antes del envío y envío gratis a todo el país.",
  keywords: [
    "relojes de lujo Ecuador",
    "relojes de colección Quito",
    "comprar Rolex Quito",
    "Rolex Submariner Ecuador",
    "Rolex Daytona Panda Ecuador",
    "Cartier Santos Quito",
    "Omega Seamaster Ecuador",
    "Patek Philippe Nautilus Ecuador",
    "Audemars Piguet Royal Oak Quito",
    "LUXSTOREC",
    "593watches",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: SITE_URL,
    siteName: "LUXSTOREC",
    title: "LUXSTOREC | Alta Relojería Sin Sobreprecios en Ecuador",
    description:
      "Catálogo privado de relojería de colección en Quito. Gestión directa, verificación en video HD antes del envío y entregas gratuitas en todo Ecuador.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXSTOREC | Alta Relojería en Quito, Ecuador",
    description:
      "Rolex, Cartier, Omega, Patek Philippe y Audemars Piguet bajo gestión directa con inspección en video HD.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "LUXSTOREC",
    description:
      "Firma privada de relojería de colección en Quito, Ecuador. Gestión directa sin sobreprecios con verificación en video HD antes del envío.",
    url: SITE_URL,
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Quito",
      addressRegion: "Pichincha",
      addressCountry: "EC",
    },
    areaServed: {
      "@type": "Country",
      name: "Ecuador",
    },
    sameAs: [TIKTOK_URL, `https://wa.me/${WHATSAPP_NUMBER}`],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo de Alta Relojería LUXSTOREC",
      itemListElement: WATCHES.map((w, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: `${w.brand} ${w.model}`,
          brand: { "@type": "Brand", name: w.brand },
          sku: w.reference,
          description: w.description,
        },
      })),
    },
  };

  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-obsidian font-sans text-bone antialiased">{children}</body>
    </html>
  );
}
