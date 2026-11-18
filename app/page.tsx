"use client";

import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Banknote,
  FileText,
  MessageCircle,
  Send,
  ShieldCheck,
  Truck,
  Video,
} from "lucide-react";
import Catalog from "@/components/Catalog";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import WatchImage from "@/components/WatchArt";
import WatchModal from "@/components/WatchModal";
import { TELEGRAM_URL, WATCHES, type Watch } from "@/data/watches";
import { EMPTY_FILTERS, type Filters } from "@/lib/filters";
import {
  TIKTOK_LABEL,
  TIKTOK_URL,
  customQuoteLink,
  generalInquiryLink,
} from "@/lib/whatsapp";

const HERO_WATCH = WATCHES[0];

/** Casas relojeras disponibles bajo pedido, mostradas en el bloque de Telegram. */
const TELEGRAM_BRANDS = [
  "Rolex",
  "Omega",
  "Patek Philippe",
  "Audemars Piguet",
  "Cartier",
  "Tudor",
  "TAG Heuer",
  "Breitling",
  "IWC",
  "Richard Mille",
  "Panerai",
  "Hublot",
];

const PILLARS = [
  {
    icon: BadgeDollarSign,
    title: "Precios Directos de Importador",
    text: "Gestionamos cada pieza en origen sin cadenas de intermediarios, garantizando valoración justa sin márgenes inflados.",
  },
  {
    icon: Video,
    title: "Verificación en Video HD Antes del Envío",
    text: "Inspeccionas tu reloj exacto en video de alta definición —esfera, bisel, cierre y marcha— antes de autorizar el despacho.",
  },
  {
    icon: ShieldCheck,
    title: "Envío Gratis a Todo Ecuador",
    text: "Entrega asegurada sin costo adicional en Quito y envíos nacionales gratuitos a cualquier provincia del país.",
  },
];

const PURCHASE_INFO = [
  {
    icon: Banknote,
    title: "Formas de pago",
    items: ["Transferencia bancaria", "Depósito", "Efectivo en Quito", "Western Union desde el exterior"],
  },
  {
    icon: FileText,
    title: "Respaldo y reserva",
    items: [
      "El pedido bajo gestión directa se confirma con el 100%",
      "Contrato privado de compraventa disponible a solicitud del cliente",
    ],
  },
  {
    icon: Truck,
    title: "Envíos",
    items: [
      "Envío gratis a todo Ecuador",
      "Entrega personalizada en Quito",
      "Envíos internacionales cotizados por destino vía WhatsApp",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Garantía",
    items: ["1 año de garantía mecánica en todos nuestros relojes"],
  },
];

const REQUEST_STEPS = [
  {
    title: "Envíanos una foto o referencia",
    text: "Comparte por WhatsApp una captura de pantalla, enlace o el número de referencia del modelo que deseas.",
  },
  {
    title: "Recibe tu cotización directa",
    text: "Confirmamos disponibilidad en origen, cotización personalizada y tiempo estimado de entrega (10 a 15 días).",
  },
  {
    title: "Aprueba en video HD y recibe",
    text: "Verificas tu pieza en video HD antes del envío. Luego coordinamos la entrega en Quito o envío gratuito a tu ciudad.",
  },
];

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selected, setSelected] = useState<Watch | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("motion-ok");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const pickFromMenu = (brand: string, collection?: string) => {
    setFilters({ ...EMPTY_FILTERS, brands: [brand], collection: collection ?? null });
    document.getElementById("catalogo")?.scrollIntoView();
  };

  return (
    <>
      {/* Apertura: telón con la firma que se retira al cargar (solo CSS, ver globals.css). */}
      <div aria-hidden="true" className="intro-curtain">
        <span className="intro-mark">LUXSTOREC</span>
        <span className="intro-rule" />
      </div>

      <Navbar onPick={pickFromMenu} />

      <main>
        {/* ============================== PORTADA ============================== */}
        <section id="inicio" className="hero-bg overflow-hidden pt-16">
          <div className="mx-auto grid max-w-7xl items-center gap-x-10 gap-y-6 px-5 pb-16 pt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <p className="eyebrow hero-in mb-6">Boutique privada · Quito, Ecuador</p>
              <h1 className="hero-title font-serif text-[clamp(3.1rem,8vw,6.75rem)] leading-[0.98] tracking-[-0.02em]">
                {"Alta Relojería Sin Sobreprecios".split(" ").flatMap((word, i) => [
                  <span key={`${word}-${i}`} className="hero-word">
                    <span className={i >= 2 ? "italic" : undefined} style={{ animationDelay: `${1150 + i * 110}ms` }}>
                      {word}
                    </span>
                  </span>,
                  " ",
                ])}
              </h1>
              <p className="hero-in hero-in-2 mt-7 max-w-xl text-lg leading-relaxed text-ash">
                Gestión directa de piezas de colección sin intermediarios, con entrega en 10 a 15 días.
                Antes de cada despacho recibes una verificación en video HD de tu reloj exacto para tu
                total conformidad.
              </p>
              <div className="hero-in hero-in-3 mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Send aria-hidden="true" className="h-4 w-4 shrink-0" />
                  Ver Videos de Control de Calidad
                </a>
                <a
                  href={customQuoteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                  Pedir un Modelo Específico por WhatsApp
                </a>
              </div>
            </div>

            <div className="hero-frame hero-aura mx-auto w-full max-w-[19rem] lg:max-w-md">
              <div className="hero-photo relative aspect-[4/5] overflow-hidden rounded-[6px] border border-line">
                <WatchImage watch={HERO_WATCH} uid="hero" live />
                <div aria-hidden="true" className="hero-glint" />
              </div>
              <button
                type="button"
                onClick={() => setSelected(HERO_WATCH)}
                className="mx-auto mt-3 block text-center text-sm text-ash transition-colors hover:text-accent"
              >
                <span className="block text-bone">
                  {HERO_WATCH.brand} {HERO_WATCH.model}
                </span>
                <span className="mt-1 block underline decoration-line underline-offset-4">
                  Ref. {HERO_WATCH.reference}, ver ficha técnica
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================== BARRA DE VENTAJAS ========================== */}
        <section aria-label="Por qué elegir LUXSTOREC" className="border-y border-line">
          <div className="mx-auto grid max-w-7xl divide-y divide-line px-5 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="reveal py-9 md:px-8 md:py-12 md:first:pl-0 md:last:pr-0">
                <Icon aria-hidden="true" strokeWidth={1.5} className="h-7 w-7 text-accent" />
                <h2 className="mt-5 font-serif text-2xl leading-snug">{title}</h2>
                <p className="mt-3 leading-relaxed text-ash">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CATÁLOGO COMPLETO EN TELEGRAM ===================== */}
        <section aria-labelledby="telegram-title" className="px-5 pt-20 lg:px-8 lg:pt-28">
          <div className="reveal telegram-panel mx-auto grid max-w-7xl gap-12 rounded-[4px] border border-line px-6 py-12 md:px-14 md:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
            <div>
              <p className="eyebrow">Canal privado en Telegram</p>
              <h2 id="telegram-title" className="mt-5 font-serif text-4xl leading-[1.06] md:text-5xl">
                Mira nuestro catálogo completo y videos de control de calidad
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ash">
                En el canal publicamos los videos reales de cada pieza antes del despacho y todas
                las referencias que gestionamos bajo pedido.
              </p>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-9"
              >
                <Send aria-hidden="true" className="h-4 w-4 shrink-0" />
                Abrir el Canal de Telegram
              </a>
            </div>
            <div>
              <p className="eyebrow">Casas relojeras disponibles</p>
              <ul className="mt-5 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
                {TELEGRAM_BRANDS.map((brand) => (
                  <li
                    key={brand}
                    className="border-b border-r border-line px-4 py-5 font-serif text-[1.35rem] leading-tight"
                  >
                    {brand}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ============================== CATÁLOGO ============================== */}
        <Catalog filters={filters} onChange={setFilters} onOpen={setSelected} />

        {/* ========================= COMPRA Y ENVÍOS ========================= */}
        <section id="compra" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
          <p className="eyebrow mb-4">Servicio</p>
          <h2 className="reveal font-serif text-4xl md:text-5xl">Compra y Envíos</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ash">
            Atención personalizada desde Quito para todo el país: confirmas disponibilidad, eliges tu
            método de pago y recibes tu pieza con respaldo escrito.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PURCHASE_INFO.map(({ icon: Icon, title, items }) => (
              <div key={title} className="reveal rounded-[4px] border border-line bg-carbon p-6">
                <Icon aria-hidden="true" strokeWidth={1.5} className="h-7 w-7 text-accent" />
                <h3 className="mt-5 font-serif text-2xl">{title}</h3>
                <ul className="mt-4 space-y-2.5 leading-relaxed text-ash">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ========================== PEDIDO ESPECIAL ========================== */}
        <section id="pedido-especial" className="px-5 pb-20 lg:px-8 lg:pb-28">
          <div className="reveal mx-auto grid max-w-7xl gap-12 rounded-[6px] border border-accent/35 bg-carbon px-6 py-12 md:px-14 md:py-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
                ¿Buscas una referencia que no ves en catálogo?
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ash">
                Envíanos por WhatsApp una foto o el nombre de cualquier reloj y gestionamos su
                cotización directa bajo pedido.
              </p>
              <a
                href={customQuoteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-9"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                Enviar Foto o Nombre por WhatsApp
              </a>
            </div>

            <ol className="divide-y divide-line border-y border-line">
              {REQUEST_STEPS.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 py-6">
                  <span aria-hidden="true" className="font-serif text-3xl leading-none text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ash">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      {/* ============================== PIE DE PÁGINA ============================== */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-ash md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="flex items-center gap-3 font-serif text-base tracking-[0.22em] text-bone">
              <Logo className="h-7 w-7" />
              LUXSTOREC
            </p>
            <p className="mt-2">Firma privada de relojería de colección. Quito, Ecuador.</p>
            <p className="mt-2 text-xs">
              Imágenes referenciales.{" "}
              <a
                href="/relojes/creditos.txt"
                className="underline decoration-line underline-offset-4 transition-colors hover:text-accent"
              >
                Créditos de las fotos
              </a>
            </p>
          </div>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-x-7 gap-y-2">
            <a href="#catalogo" className="transition-colors hover:text-accent">
              Catálogo
            </a>
            <a href="#compra" className="transition-colors hover:text-accent">
              Compra y Envíos
            </a>
            <a href="#pedido-especial" className="transition-colors hover:text-accent">
              Pedido Especial
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              Telegram
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {TIKTOK_LABEL}
            </a>
            <a
              href={customQuoteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp */}
      <a
        href={generalInquiryLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar a LUXSTOREC por WhatsApp"
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-obsidian shadow-lg shadow-black/50 transition-transform hover:scale-105"
      >
        <MessageCircle aria-hidden="true" className="h-6 w-6" />
      </a>

      <WatchModal watch={selected} onClose={() => setSelected(null)} />
    </>
  );
}
