"use client";

import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Banknote,
  FileText,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Truck,
  Video,
} from "lucide-react";
import Catalog from "@/components/Catalog";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import WatchModal from "@/components/WatchModal";
import { TELEGRAM_URL, WATCHES, type Watch } from "@/data/watches";
import { EMPTY_FILTERS, type Filters } from "@/lib/filters";
import {
  TIKTOK_LABEL,
  TIKTOK_URL,
  customQuoteLink,
  generalInquiryLink,
} from "@/lib/whatsapp";

/** Reloj de la foto de portada. */
const HERO_WATCH = WATCHES.find((w) => w.id === "rolex-datejust-41-verde-menta") ?? WATCHES[0];

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

/** Preguntas frecuentes. También alimentan el JSON-LD `FAQPage`. */
const FAQ = [
  {
    question: "¿Cómo funciona la compra y reserva de relojes en Quito y Ecuador?",
    answer:
      "Nos escribes por WhatsApp con la pieza que te interesa y un asesor confirma disponibilidad y cotización. Las piezas marcadas como Disponible en Boutique se coordinan para entrega en Quito o envío a tu ciudad; las de Bajo Reserva se gestionan en origen, con un tiempo estimado de 10 a 15 días. El pedido bajo gestión directa se confirma con el 100% del valor y puedes pagar por transferencia bancaria, depósito, efectivo en Quito o Western Union desde el exterior.",
  },
  {
    question: "¿Qué movimientos y calibres trabajan en sus piezas de colección?",
    answer:
      "Cada ficha del catálogo indica el movimiento de la pieza (automático, cuerda manual o cuarzo), su calibre, la reserva de marcha y la hermeticidad. Antes del despacho compruebas la marcha del reloj en video y todos nuestros relojes incluyen 1 año de garantía mecánica.",
  },
  {
    question: "¿Cómo funciona la verificación en video HD antes del despacho?",
    answer:
      "Antes de enviar tu reloj grabamos un video en alta definición de la pieza exacta que vas a recibir: esfera, bisel, cierre y marcha. Lo revisas con calma y solo cuando lo apruebas autorizamos el despacho. Los videos de control de calidad también se publican en nuestro canal de Telegram.",
  },
  {
    question: "¿Realizan envíos asegurados a Guayaquil, Cuenca y otras provincias?",
    answer:
      "Sí. El envío es gratis y asegurado a todo Ecuador, incluidas Guayaquil, Cuenca y cualquier otra provincia. En Quito hacemos entrega personalizada. Los envíos internacionales se cotizan por destino vía WhatsApp.",
  },
  {
    question: "¿Puedo solicitar un modelo o referencia específica que no esté en el catálogo?",
    answer:
      "Sí. Envíanos por WhatsApp una foto, un enlace o el número de referencia del reloj que buscas. Confirmamos disponibilidad en origen, te enviamos una cotización personalizada y el tiempo estimado de entrega (10 a 15 días), y verificas la pieza en video HD antes del envío.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

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
        <section id="inicio" className="hero relative isolate flex overflow-hidden pt-16">
          {/* Foto a sangre: ocupa toda la portada y el texto va encima. */}
          <div aria-hidden="true" className="hero-photo absolute inset-x-0 -top-10 bottom-[auto] h-[min(56svh,30rem)] -z-10 md:h-auto md:bottom-0 md:left-[22%]">
            <picture>
              <source media="(min-width: 768px)" srcSet="/portada.jpg" />
              <img
                src="/portada-movil.jpg"
                alt=""
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center md:object-left"
              />
            </picture>
            <div className="hero-sweep" />
          </div>
          <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

          <div className="mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-12 pt-[min(47svh,25rem)] md:justify-center md:pb-24 md:pt-20 lg:px-8">
            <div className="max-w-[42rem]">
              <p className="eyebrow hero-in mb-6">Boutique privada · Quito, Ecuador</p>
              <h1 className="hero-title font-serif text-[clamp(2.9rem,7vw,6rem)] leading-[0.98] tracking-[-0.02em]">
                {"Alta Relojería Sin Sobreprecios".split(" ").flatMap((word, i) => [
                  <span key={`${word}-${i}`} className="hero-word">
                    <span className={i >= 2 ? "italic" : undefined} style={{ animationDelay: `${1150 + i * 110}ms` }}>
                      {word}
                    </span>
                  </span>,
                  " ",
                ])}
              </h1>
              <span aria-hidden="true" className="hero-rule mt-7 block h-px w-24" />
              <p className="hero-in hero-in-2 mt-7 max-w-xl text-lg leading-relaxed text-bone/80">
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
              <button
                type="button"
                onClick={() => setSelected(HERO_WATCH)}
                className="hero-in hero-in-3 mt-9 block text-left text-sm text-ash transition-colors hover:text-accent"
              >
                En la foto: <span className="text-bone">{HERO_WATCH.brand} {HERO_WATCH.collection}</span>.{" "}
                <span className="underline decoration-line underline-offset-4">Ver ficha técnica</span>
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

        {/* ======================== PREGUNTAS FRECUENTES ======================== */}
        <section
          id="preguntas"
          aria-labelledby="preguntas-title"
          className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20 lg:px-8 lg:pb-28"
        >
          <div>
            <h2 id="preguntas-title" className="reveal font-serif text-4xl md:text-5xl">
              Preguntas Frecuentes
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-ash">
              Lo que más nos consultan antes de reservar una pieza en Quito y el resto de Ecuador.
            </p>
            <a
              href={generalInquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-8"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
              Hacer otra Pregunta
            </a>
          </div>
          <div className="border-t border-line">
            {FAQ.map(({ question, answer }) => (
              <details key={question} className="faq-item group border-b border-line">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-serif text-2xl leading-snug transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                  {question}
                  <Plus
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="mt-1 h-5 w-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                  />
                </summary>
                <p className="max-w-[65ch] pb-7 pr-10 leading-relaxed text-ash">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

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
            <a href="#preguntas" className="transition-colors hover:text-accent">
              Preguntas Frecuentes
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
