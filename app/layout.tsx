import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], axes: ["opsz"], variable: "--font-newsreader", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://antifirm.com"),
  title: `${site.name} Podcast`,
  description: site.description,
  openGraph: { title: `${site.name} Podcast`, description: site.description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>
        <a href="#main" className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-brand-lime focus:px-4 focus:py-3 focus:text-background-primary">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
