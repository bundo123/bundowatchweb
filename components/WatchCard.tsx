"use client";

import { MessageCircle, Video } from "lucide-react";
import type { Watch } from "@/data/watches";
import { mediaLink, watchInquiryLink } from "@/lib/whatsapp";
import AvailabilityTag from "./AvailabilityTag";
import WatchImage from "./WatchArt";

interface WatchCardProps {
  watch: Watch;
  onOpen: (watch: Watch) => void;
  index?: number;
}

export default function WatchCard({ watch, onOpen, index = 0 }: WatchCardProps) {
  return (
    <article
      style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}
      className="card-in group relative flex flex-col overflow-hidden rounded-[4px] border border-line bg-carbon transition-colors duration-300 hover:border-accent/40"
    >
      <div className="watch-stage relative aspect-[4/5] overflow-hidden">
        <div
          className={`absolute inset-0 ${watch.image ? "" : "px-4 pb-3 pt-11"} transition-transform duration-700 ease-out group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
        >
          <div className="relative h-full w-full">
            <WatchImage watch={watch} uid="card" />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent"
        />
        <AvailabilityTag availability={watch.availability} className="absolute left-4 top-4" />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <p className="text-sm font-medium text-accent">{watch.brand}</p>
        <h3 className="mt-1 font-serif text-2xl leading-snug">
          <button
            type="button"
            onClick={() => onOpen(watch)}
            className="text-left after:absolute after:inset-0 after:content-['']"
          >
            {watch.model}
          </button>
        </h3>
        <p className="mt-1.5 text-sm text-ash">
          Ref. {watch.reference} · {watch.dimensions}
        </p>

        <p className="mt-auto pt-5 text-sm font-medium text-bone/90">
          Consultar con un asesor
        </p>

        <a
          href={watchInquiryLink(watch)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary relative z-10 mt-3 w-full"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          Consultar con un Asesor
        </a>
        <a
          href={mediaLink(watch)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline relative z-10 mt-2.5 w-full"
        >
          <Video aria-hidden="true" className="h-4 w-4 shrink-0" />
          Ver Video de Inspección
        </a>
      </div>
    </article>
  );
}
