export const dynamic = 'force-static';
import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Studio Tecnico Garofalo",
    short_name: "ST Garofalo",
    description: "Progettazione, visualizzazione e servizi tecnici.",
    start_url: "/",
    display: "browser",
    background_color: "#0d0d0c",
    theme_color: "#0d0d0c",
    lang: "it",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
