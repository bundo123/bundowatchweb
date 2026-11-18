import { DEFAULT_MEDIA_URL, type Watch } from "@/data/watches";

export const WHATSAPP_NUMBER = "593987447806";
export const TIKTOK_URL = "https://tiktok.com";
export const TIKTOK_LABEL = "TikTok (@593watches)";
export const SHOP_NAME = "LUXSTOREC";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function watchInquiryLink(watch: Watch): string {
  return whatsappLink(
    [
      `Hola ${SHOP_NAME}, quisiera consultar con un asesor sobre esta pieza:`,
      "",
      `Marca: ${watch.brand}`,
      `Modelo: ${watch.model}`,
      `Referencia: ${watch.reference}`,
      `Disponibilidad: ${watch.availability}`,
      "",
      "¿Me pueden brindar información y cotización?",
    ].join("\n"),
  );
}

export function mediaLink(watch: Watch): string {
  return watch.mediaUrl || DEFAULT_MEDIA_URL;
}

export const customQuoteLink = whatsappLink(
  `Hola ${SHOP_NAME}, busco un modelo específico. Les envío la foto o referencia para que me lo coticen bajo pedido.`,
);

export const generalInquiryLink = whatsappLink(
  `Hola ${SHOP_NAME}, quisiera asesoría sobre su catálogo de relojes.`,
);
