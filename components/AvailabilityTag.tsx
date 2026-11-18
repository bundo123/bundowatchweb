import type { Availability } from "@/data/watches";

export default function AvailabilityTag({
  availability,
  className = "",
}: {
  availability: Availability;
  className?: string;
}) {
  const inStock = availability === "Disponible en Boutique";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[3px] border px-2.5 py-1 text-xs font-medium ${
        inStock
          ? "border-champagne/50 bg-champagne/10 text-champagne"
          : "border-line bg-obsidian/60 text-ash"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-champagne" : "bg-ash/60"}`}
      />
      {availability}
    </span>
  );
}
