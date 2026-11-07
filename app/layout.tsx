import type { Metadata, Viewport } from "next";
import { PAGE } from "@/lib/copy";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://check.philaraujo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: PAGE.title.en,
  description: PAGE.description.en,
  authors: [{ name: "Phil Araujo" }],
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website", url: SITE, title: PAGE.title.en, description: PAGE.description.en,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: PAGE.title.en, description: PAGE.description.en, images: ["/og-image.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
