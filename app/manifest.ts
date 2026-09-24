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
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
