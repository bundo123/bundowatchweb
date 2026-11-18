"use client";

import { useState } from "react";
import { MessageCircle, Search, X } from "lucide-react";
import { ACTIVE_BRANDS, AVAILABILITIES, GENDERS, MOVEMENTS, WATCHES, type Watch } from "@/data/watches";
import {
  EMPTY_FILTERS,
  SORT_OPTIONS,
  countActive,
  matchesFilters,
  matchesSearch,
  sortWatches,
  toggle,
  type Filters,
  type SortKey,
} from "@/lib/filters";
import { customQuoteLink } from "@/lib/whatsapp";
import WatchCard from "./WatchCard";

interface CatalogProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onOpen: (watch: Watch) => void;
}

export default function Catalog({ filters, onChange, onOpen }: CatalogProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");

  const results = sortWatches(
    WATCHES.filter((w) => matchesFilters(w, filters) && matchesSearch(w, query)),
    sort,
  );
  const active = countActive(filters) + (query.trim() ? 1 : 0);
  const clearAll = () => {
    setQuery("");
    onChange(EMPTY_FILTERS);
  };

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <h2 className="reveal font-serif text-4xl md:text-5xl">Catálogo</h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-ash">
        Selecciona cualquier reloj para consultar su ficha técnica completa. Puedes combinar múltiples filtros.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block sm:w-80">
          <span className="text-sm text-ash">Buscar</span>
          <span className="relative mt-2 block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Marca, modelo, apodo o referencia"
              className="w-full rounded-[3px] border border-line bg-carbon py-2.5 pl-10 pr-3 text-sm text-bone placeholder:text-ash/70"
            />
          </span>
        </label>
        <label className="block sm:w-64">
          <span className="text-sm text-ash">Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="mt-2 block w-full rounded-[3px] border border-line bg-carbon px-3 py-2.5 text-sm text-bone"
          >
            {SORT_OPTIONS.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-7 grid gap-x-10 gap-y-7 border-y border-line py-7 lg:grid-cols-2">
        <FilterGroup label="Casa relojera">
          <Chip
            active={filters.brands.length === 0}
            onClick={() => onChange({ ...filters, brands: [], collection: null })}
          >
            Todas
          </Chip>
          {ACTIVE_BRANDS.map(({ name }) => (
            <Chip
              key={name}
              active={filters.brands.includes(name)}
              onClick={() =>
                onChange({ ...filters, brands: toggle(filters.brands, name), collection: null })
              }
            >
              {name}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Género">
          {GENDERS.map((gender) => (
            <Chip
              key={gender}
              active={filters.genders.includes(gender)}
              onClick={() => onChange({ ...filters, genders: toggle(filters.genders, gender) })}
            >
              {gender}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Movimiento">
          {MOVEMENTS.map((movement) => (
            <Chip
              key={movement}
              active={filters.movements.includes(movement)}
              onClick={() => onChange({ ...filters, movements: toggle(filters.movements, movement) })}
            >
              {movement}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Disponibilidad">
          {AVAILABILITIES.map((availability) => (
            <Chip
              key={availability}
              active={filters.availability.includes(availability)}
              onClick={() =>
                onChange({ ...filters, availability: toggle(filters.availability, availability) })
              }
            >
              {availability}
            </Chip>
          ))}
        </FilterGroup>
      </div>

      <div className="mt-6 flex min-h-10 flex-wrap items-center gap-x-5 gap-y-3">
        <p aria-live="polite" className="text-sm text-ash">
          <span className="font-semibold tabular-nums text-bone">{results.length}</span>{" "}
          {results.length === 1 ? "reloj" : "relojes"}
        </p>
        {filters.collection && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, collection: null })}
            className="flex items-center gap-2 rounded-[3px] border border-accent/50 bg-accent/10 px-3 py-1.5 text-sm text-accent"
          >
            Colección: {filters.collection}
            <X aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">Quitar filtro de colección</span>
          </button>
        )}
        {active > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-bone underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {results.length > 0 && sort === "default" ? (
        /* Orden por defecto: un bloque por casa relojera, con su título. */
        <div>
          {ACTIVE_BRANDS.map((brand) => ({
            ...brand,
            items: results.filter((w) => w.brand === brand.name),
          }))
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <section key={group.name} aria-label={group.name} className="mt-14 first:mt-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
                  <h3 className="font-serif text-3xl md:text-4xl">{group.name}</h3>
                  <p className="eyebrow">
                    {group.tagline ? `${group.tagline} · ` : ""}
                    {group.items.length} {group.items.length === 1 ? "pieza" : "piezas"}
                  </p>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((watch, i) => (
                    <WatchCard key={watch.id} watch={watch} onOpen={onOpen} index={i} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      ) : results.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((watch, i) => (
            <WatchCard key={watch.id} watch={watch} onOpen={onOpen} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[4px] border border-line bg-carbon px-6 py-14 text-center">
          <p className="font-serif text-2xl">Ningún reloj coincide con tu búsqueda</p>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-ash">
            Ajusta los filtros o indícanos qué modelo buscas para cotizarlo directamente bajo pedido.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={clearAll} className="btn btn-outline">
              Limpiar filtros
            </button>
            <a href={customQuoteLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Pedir un Modelo por WhatsApp
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="text-sm text-ash">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-[3px] border px-3 py-2 text-sm transition-colors ${
        active
          ? "border-accent bg-accent font-semibold text-obsidian"
          : "border-line text-bone/85 hover:border-ash hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}
