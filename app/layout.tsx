import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site";
import "./globals.css";
export const metadata: Metadata = {
  // Safari's automatic telephone links alter the HTML before React hydrates,
  // including the VAT number. Real contact links are already explicit.
  formatDetection: { telephone: false, email: false, address: false },
  title: siteConfig.title,
  description: siteConfig.description,
  ...(siteConfig.url
    ? { metadataBase: new URL(siteConfig.url), alternates: { canonical: "/" } }
    : {}),
  robots: { index: Boolean(siteConfig.url), follow: true },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: siteConfig.name,
    title: "Dall’idea alla realtà. | Studio Tecnico Garofalo",
    description: siteConfig.description,
    ...(siteConfig.url
      ? {
          url: siteConfig.url,
          images: [
            {
              url: "/images/og.jpg",
              width: 1200,
              height: 630,
              alt: "Render di un soggiorno - Studio Tecnico Garofalo",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    ...(siteConfig.url ? { images: ["/images/og.jpg"] } : {}),
  },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  themeColor: "#0d0d0c",
  colorScheme: "dark",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <a className="skip-link" href="#contenuto">
          Vai al contenuto
        </a>
        {children}
      </body>
    </html>
  );
}
