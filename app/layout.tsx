import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { TELEGRAM_URL, WATCHES } from "@/data/watches";
import { TIKTOK_URL, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxstorec.vercel.app";

const OG_IMAGE = "/relojes/rolex-submariner-126610ln.jpg";

export const viewport: Viewport = {
  themeColor: "#0a0d0c",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LUXSTOREC | Venta de Relojes de Alta Relojería en Quito, Ecuador",
    template: "%s | LUXSTOREC Ecuador",
  },
  description:
    "Venta de relojes de alta relojería en Quito y todo Ecuador: Rolex, Omega, Cartier, Patek Philippe, Audemars Piguet, Tudor, TAG Heuer y Breitling sin sobreprecios. Video de control de calidad antes del despacho y envíos seguros a nivel nacional.",
  keywords: [
    "venta de relojes Quito",
    "venta de relojes de lujo Ecuador",
    "alta relojería Quito",
    "alta relojería Ecuador",
    "relojes originales Quito",
    "envío de relojes a todo Ecuador",
    "TAG Heuer Ecuador",
    "Breitling Navitimer Ecuador",
    "Tudor Black Bay Quito",
    "Hublot Ecuador",
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
    title: "LUXSTOREC | Alta Relojería Sin Sobreprecios en Quito y Ecuador",
    description:
      "Venta de relojes de alta relojería en Quito con envíos seguros a todo Ecuador. Gestión directa y video de control de calidad antes del despacho.",
    images: [{ url: OG_IMAGE, width: 800, height: 1000, alt: "Reloj de buceo de acero con esfera negra" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXSTOREC | Alta Relojería en Quito, Ecuador",
    description:
      "Venta de relojes de alta relojería en Quito con envíos seguros a todo Ecuador e inspección en video antes del despacho.",
    images: [OG_IMAGE],
  },
  other: {
    "geo.region": "EC-P",
    "geo.placename": "Quito",
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
      "Venta de relojes de alta relojería en Quito, Ecuador. Gestión directa sin sobreprecios, video de control de calidad antes del despacho y envíos seguros a nivel nacional.",
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE}`,
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
    sameAs: [TIKTOK_URL, TELEGRAM_URL, `https://wa.me/${WHATSAPP_NUMBER}`],
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
    <html lang="es" className={`${display.variable} ${jakarta.variable}`}>
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
