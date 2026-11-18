import { ACTIVE_BRANDS, type Availability, type Gender, type Movement, type Watch } from "@/data/watches";

export interface Filters {
  brands: string[];
  genders: Gender[];
  movements: Movement[];
  availability: Availability[];
  collection: string | null;
}

export const EMPTY_FILTERS: Filters = {
  brands: [],
  genders: [],
  movements: [],
  availability: [],
  collection: null,
};

export function matchesFilters(watch: Watch, f: Filters): boolean {
  return (
    (f.brands.length === 0 || f.brands.includes(watch.brand)) &&
    (f.genders.length === 0 || f.genders.includes(watch.gender)) &&
    (f.movements.length === 0 || f.movements.includes(watch.movement)) &&
    (f.availability.length === 0 || f.availability.includes(watch.availability)) &&
    (f.collection === null || f.collection === watch.collection)
  );
}

export function countActive(f: Filters): number {
  return (
    f.brands.length +
    f.genders.length +
    f.movements.length +
    f.availability.length +
    (f.collection ? 1 : 0)
  );
}

export function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export const SORT_OPTIONS = [
  { key: "default", label: "Agrupado por casa relojera" },
  { key: "name", label: "Modelo: A a Z" },
  { key: "brand", label: "Casa relojera: A a Z (lista continua)" },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]["key"];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchesSearch(watch: Watch, query: string): boolean {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize(
    `${watch.brand} ${watch.collection} ${watch.model} ${watch.nickname ?? ""} ${watch.reference}`,
  );
  return words.every((word) => haystack.includes(word));
}

export function sortWatches(watches: Watch[], sort: SortKey): Watch[] {
  const sorted = [...watches];
  if (sort === "default") {
    // Agrupa por casa relojera en el orden del menú, sin alterar el orden interno.
    const order = new Map(ACTIVE_BRANDS.map((b, i) => [b.name, i]));
    sorted.sort((a, b) => (order.get(a.brand) ?? 999) - (order.get(b.brand) ?? 999));
  }
  if (sort === "name") {
    sorted.sort((a, b) => a.model.localeCompare(b.model, "es"));
  }
  if (sort === "brand") {
    sorted.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`, "es"));
  }
  return sorted;
}
