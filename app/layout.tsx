import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggleButton1, ThemeToggleButton2, ThemeToggleButton3, ThemeToggleButton4, ThemeToggleButton5 } from "@/components/skipper/toggle-button";

const SITE_URL = "https://chanakya-chess.vercel.app"; // ← swap for your real domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chanakya — India's Top NNUE Chess Engine (3100+ Elo)",
    template: "%s — Chanakya",
  },
  description:
    "Chanakya is a 3100+ Elo UCI chess engine built in India, using Stockfish-grade NNUE evaluation on a bitboard core. Free download for Windows, Linux, and macOS — plus a step-by-step guide to integrating NNUE into your own bitboard engine.",
  keywords: [
    "NNUE chess engine",
    "Indian chess engine",
    "top Indian chess engine",
    "3100 elo chess engine",
    "UCI chess engine",
    "bitboard chess engine",
    "integrate NNUE bitboard",
    "Stockfish NNUE tutorial",
    "chess engine download",
    "open source chess engine",
  ],
  authors: [{ name: "Abhijeet Kumar", url: SITE_URL }],
  creator: "Abhijeet Kumar",
  publisher: "Chanakya Chess Engine",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/chanakya-logo.png",
    shortcut: "/chanakya-logo.png",
    apple: "/chanakya-logo.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Chanakya Chess Engine",
    title: "Chanakya — India's Top NNUE Chess Engine (3100+ Elo)",
    description:
      "A 3100+ Elo bitboard chess engine with NNUE evaluation. Free UCI binaries for Windows, Linux, macOS — plus a hands-on guide to adopting NNUE in your own engine.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Chanakya chess engine — NNUE evaluation, 3100+ Elo",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chanakya — India's Top NNUE Chess Engine (3100+ Elo)",
    description:
      "3100+ Elo, NNUE evaluation, bitboard core. Free UCI binaries + a guide to integrating NNUE into your own engine.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Chanakya",
    applicationCategory: "GameApplication",
    operatingSystem: "Windows, Linux, macOS",
    description:
      "Chanakya is a 3100+ Elo UCI chess engine with NNUE evaluation, built on a bitboard move-generation core.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Abhijeet Kumar",
    },
    url: SITE_URL,
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..600,0,0&family=Fraunces:ital,opsz,wght@1,9..144,400..500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">
        <Script
          id="chanakya-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeToggleButton3 className="fixed z-50 top-4 right-4 size-10 p-1" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}