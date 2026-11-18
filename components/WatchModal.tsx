"use client";

import { useEffect, useRef } from "react";
import { MessageCircle, Video, X } from "lucide-react";
import type { Watch } from "@/data/watches";
import { mediaLink, watchInquiryLink } from "@/lib/whatsapp";
import AvailabilityTag from "./AvailabilityTag";
import WatchImage from "./WatchArt";

interface WatchModalProps {
  watch: Watch | null;
  onClose: () => void;
}

export default function WatchModal({ watch, onClose }: WatchModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (watch && !dialog.open) dialog.showModal();
    if (!watch && dialog.open) dialog.close();
  }, [watch]);

  const specs: [string, string][] = watch
    ? [
        ["Referencia", watch.reference],
        ["Género", watch.gender],
        ["Caja", watch.specs.caseMaterial],
        ["Dimensiones", watch.dimensions],
        ["Cristal", watch.specs.crystal],
        ["Movimiento", watch.movement],
        ["Calibre", watch.caliber],
        ["Reserva de marcha", watch.specs.powerReserve],
        ["Hermeticidad", watch.specs.waterResistance],
        ["Brazalete", watch.specs.bracelet],
      ]
    : [];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="watch-modal-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-5xl overflow-y-auto rounded-[6px] border border-line bg-carbon p-0 text-bone backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {watch && (
        <div className="relative">
          <div className="sticky top-0 z-20 h-0">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-obsidian/80 text-ash transition-colors hover:border-accent hover:text-accent"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="watch-stage relative min-h-[20rem] md:min-h-[30rem]">
              <div className={`absolute inset-0 ${watch.image ? "" : "p-8 md:p-12"}`}>
                <div className="relative h-full w-full">
                  <WatchImage watch={watch} uid="modal" />
                </div>
              </div>
              {watch.image && (
                <p className="absolute bottom-3 left-4 rounded-[3px] bg-black/60 px-2 py-1 text-xs text-ash">
                  Imagen referencial
                </p>
              )}
            </div>

            <div className="flex flex-col px-6 pb-7 pt-7 md:px-10 md:pb-8 md:pt-9">
              <AvailabilityTag availability={watch.availability} className="self-start" />
              <p className="mt-5 text-sm font-medium text-accent">
                {watch.brand}
                {watch.nickname && <span className="text-ash"> · &ldquo;{watch.nickname}&rdquo;</span>}
              </p>
              <h2 id="watch-modal-title" className="mt-1 font-serif text-3xl leading-tight md:text-4xl">
                {watch.model}
              </h2>
              <p className="mt-4 max-w-prose leading-relaxed text-ash">{watch.description}</p>

              <p className="mt-6 text-base font-medium text-accent">
                Consultar con un asesor
              </p>

              <h3 className="mt-5 text-sm font-semibold text-bone">Especificaciones técnicas</h3>
              <dl className="mt-3 divide-y divide-line border-y border-line text-sm">
                {specs.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-4 py-2.5">
                    <dt className="text-ash">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <a
                href={watchInquiryLink(watch)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-6 w-full"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5 shrink-0" />
                Consultar con un Asesor
              </a>
              <a
                href={mediaLink(watch)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline mt-2.5 w-full"
              >
                <Video aria-hidden="true" className="h-5 w-5 shrink-0" />
                Ver Video de Inspección
              </a>
              <p className="mt-3 text-center text-sm text-ash">
                El mensaje de WhatsApp ya incluye la marca, el modelo y la referencia.
              </p>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
