import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Send, Video } from "lucide-react";
import AvailabilityTag from "@/components/AvailabilityTag";
import Logo from "@/components/Logo";
import WatchImage from "@/components/WatchArt";
import { TELEGRAM_URL, WATCHES, type Watch } from "@/data/watches";
import { TIKTOK_LABEL, TIKTOK_URL, mediaLink, watchInquiryLink } from "@/lib/whatsapp";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxstorec.vercel.app";

/** Solo existen las fichas del catálogo: cualquier otra dirección responde 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return WATCHES.map((watch) => ({ slug: watch.id }));
}

function findWatch(slug: string): Watch | undefined {
  return WATCHES.find((watch) => watch.id === slug);
}

function metaDescription(watch: Watch): string {
  return (
    `${watch.brand} ${watch.model} (ref. ${watch.reference}): caja de ${watch.dimensions} en ` +
    `${watch.specs.caseMaterial}, movimiento ${watch.movement.toLowerCase()} ${watch.caliber}. ` +
    `${watch.availability} en LUXSTOREC, con verificación en video HD antes del despacho y envío gratis en Quito y todo Ecuador.`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const watch = findWatch(slug);
  if (!watch) return {};

  const title = `${watch.brand} ${watch.model} Ref. ${watch.reference} en Quito y Ecuador | LUXSTOREC`;
  const description = metaDescription(watch);
  const images = watch.image
    ? [{ url: watch.image, width: 800, height: 1000, alt: `${watch.brand} ${watch.model}, ref. ${watch.reference}` }]
    : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/reloj/${watch.id}` },
    openGraph: {
      type: "website",
      locale: "es_EC",
      url: `/reloj/${watch.id}`,
      siteName: "LUXSTOREC",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: watch.image ? [watch.image] : undefined,
    },
  };
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const watch = findWatch(slug);
  if (!watch) notFound();

  const specs: [string, string][] = [
    ["Referencia", watch.reference],
    ["Colección", watch.collection],
    ["Género", watch.gender],
    ["Caja", watch.specs.caseMaterial],
    ["Diámetro", watch.dimensions],
    ["Cristal", watch.specs.crystal],
    ["Movimiento", watch.movement],
    ["Calibre", watch.caliber],
    ["Reserva de marcha", watch.specs.powerReserve],
    ["Hermeticidad", watch.specs.waterResistance],
    ["Brazalete", watch.specs.bracelet],
    ["Disponibilidad", watch.availability],
  ];

  const sameBrand = WATCHES.filter((w) => w.brand === watch.brand && w.id !== watch.id);
  const related = [
    ...sameBrand.filter((w) => w.collection === watch.collection),
    ...sameBrand.filter((w) => w.collection !== watch.collection),
  ].slice(0, 4);

  const url = `${SITE_URL}/reloj/${watch.id}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${watch.brand} ${watch.model}`,
      description: watch.description,
      sku: watch.reference,
      mpn: watch.reference,
      category: "Relojes de pulsera",
      brand: { "@type": "Brand", name: watch.brand },
      url,
      ...(watch.image ? { image: `${SITE_URL}${watch.image}` } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Catálogo", item: `${SITE_URL}/#catalogo` },
        { "@type": "ListItem", position: 3, name: `${watch.brand} ${watch.model}`, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-serif text-base tracking-[0.22em] text-bone"
          >
            <Logo className="h-7 w-7" />
            LUXSTOREC
          </Link>
          <Link
            href="/#catalogo"
            className="flex items-center gap-2 text-sm text-ash transition-colors hover:text-accent"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8 lg:pb-28 lg:pt-12">
        <nav aria-label="Ruta de navegación" className="text-sm text-ash">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="transition-colors hover:text-accent">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#catalogo" className="transition-colors hover:text-accent">
                Catálogo
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-bone/90">
              {watch.brand} {watch.model}
            </li>
          </ol>
        </nav>

        <article className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="watch-stage relative aspect-[4/5] overflow-hidden rounded-[4px] border border-line">
              <div className={`absolute inset-0 ${watch.image ? "" : "p-8 md:p-12"}`}>
                <div className="relative h-full w-full">
                  <WatchImage watch={watch} uid="ficha" />
                </div>
              </div>
              {watch.image && (
                <p className="absolute bottom-3 left-4 rounded-[3px] bg-black/60 px-2 py-1 text-xs text-ash">
                  Imagen referencial
                </p>
              )}
            </div>
          </div>

          <div>
            <AvailabilityTag availability={watch.availability} />
            <p className="mt-5 text-sm font-medium text-accent">
              {watch.brand}
              {watch.nickname && <span className="text-ash"> · &ldquo;{watch.nickname}&rdquo;</span>}
            </p>
            <h1 className="mt-1 font-serif text-4xl leading-[1.08] md:text-5xl">{watch.model}</h1>
            <p className="mt-3 text-ash">
              Ref. {watch.reference} · {watch.dimensions} · Quito y todo Ecuador
            </p>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-bone/85">{watch.description}</p>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <a
                href={watchInquiryLink(watch)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5 shrink-0" />
                Consultar por WhatsApp
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Send aria-hidden="true" className="h-4 w-4 shrink-0" />
                Canal de Telegram
              </a>
              {mediaLink(watch) !== TELEGRAM_URL && (
                <a
                  href={mediaLink(watch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Video aria-hidden="true" className="h-4 w-4 shrink-0" />
                  Ver Video de Inspección
                </a>
              )}
            </div>
            <p className="mt-3 text-sm text-ash">
              El mensaje de WhatsApp ya incluye la marca, el modelo y la referencia.
            </p>

            <h2 className="mt-12 font-serif text-3xl">Ficha técnica</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[9.5rem_minmax(0,1fr)] gap-4 py-3">
                  <dt className="text-ash">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 font-serif text-3xl">Compra y envío</h2>
            <ul className="mt-5 space-y-3 leading-relaxed text-ash">
              {[
                "Verificas tu pieza exacta en video HD antes de autorizar el despacho.",
                "Entrega personalizada en Quito y envío gratis a todo Ecuador.",
                "1 año de garantía mecánica y contrato privado de compraventa a solicitud.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="relacionados" className="mt-20 lg:mt-28">
            <h2 id="relacionados" className="font-serif text-3xl md:text-4xl">
              Más piezas de {watch.brand}
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((other) => (
                <li
                  key={other.id}
                  className="group relative overflow-hidden rounded-[4px] border border-line bg-carbon transition-colors duration-300 hover:border-accent/40"
                >
                  <div className="watch-stage relative aspect-[4/5] overflow-hidden">
                    <div className={`absolute inset-0 ${other.image ? "" : "px-4 pb-3 pt-6"}`}>
                      <div className="relative h-full w-full">
                        <WatchImage watch={other} uid="relacionado" />
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-5">
                    <h3 className="font-serif text-xl leading-snug">
                      <Link
                        href={`/reloj/${other.id}`}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {other.model}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-sm text-ash">
                      Ref. {other.reference} · {other.dimensions}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

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
            <Link href="/#catalogo" className="transition-colors hover:text-accent">
              Catálogo
            </Link>
            <Link href="/#compra" className="transition-colors hover:text-accent">
              Compra y Envíos
            </Link>
            <Link href="/#preguntas" className="transition-colors hover:text-accent">
              Preguntas Frecuentes
            </Link>
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
          </nav>
        </div>
      </footer>
    </>
  );
}
