import type { MetadataRoute } from "next";
import { WATCHES } from "@/data/watches";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luxstorec.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Una entrada por reloj: se actualiza sola al añadir piezas a WATCHES.
    ...WATCHES.map((watch) => ({
      url: `${SITE_URL}/reloj/${watch.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
