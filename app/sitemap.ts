export const dynamic = 'force-static';
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.url
    ? [
        { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
        { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
      ]
    : [];
}
