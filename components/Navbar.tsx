"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { ACTIVE_BRANDS, collectionsOf } from "@/data/watches";
import { TIKTOK_LABEL, TIKTOK_URL, customQuoteLink } from "@/lib/whatsapp";
import Logo from "./Logo";

interface NavbarProps {
  onPick: (brand: string, collection?: string) => void;
}

export default function Navbar({ onPick }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const pick = (brand: string, collection?: string) => {
    setOpen(false);
    onPick(brand, collection);
  };

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-40 border-b border-line bg-obsidian/75 backdrop-blur-md"
    >
      <div aria-hidden="true" className="scroll-progress" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <a href="#inicio" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo className="h-9 w-9 shrink-0" />
          <span className="font-serif text-xl font-medium tracking-[0.24em]">
            LUX<span className="text-accent">STOREC</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mega-menu"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-bone/90 transition-colors hover:text-accent"
          >
            Marcas y Colecciones
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 text-sm text-ash transition-colors hover:text-accent"
          >
            {TIKTOK_LABEL}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={customQuoteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hidden min-h-10 py-2 sm:inline-flex"
          >
            Cotizar Modelo Especial
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mega-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú de marcas y colecciones"}
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-[3px] border border-line text-bone md:hidden"
          >
            {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mega-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-obsidian"
        >
          <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-9 px-5 py-9 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-8">
            {ACTIVE_BRANDS.map((brand) => (
              <div key={brand.name}>
                <button
                  type="button"
                  onClick={() => pick(brand.name)}
                  className="font-serif text-2xl transition-colors hover:text-accent"
                >
                  {brand.name}
                </button>
                <p className="mt-1 text-sm text-ash">{brand.tagline}</p>
                <ul className="mt-4 border-t border-line pt-3">
                  {collectionsOf(brand.name).map((collection) => (
                    <li key={collection}>
                      <button
                        type="button"
                        onClick={() => pick(brand.name, collection)}
                        className="w-full py-2 text-left text-sm text-bone/85 transition-colors hover:text-accent"
                      >
                        {collection}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5 md:hidden">
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block border-t border-line py-4 text-sm text-ash transition-colors hover:text-accent"
            >
              {TIKTOK_LABEL}
            </a>
          </div>
          <div className="px-5 pb-7 sm:hidden">
            <a
              href={customQuoteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Cotizar Modelo Especial
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
