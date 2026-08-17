import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Integrating Stockfish NNUE into Your Own Engine — Chanakya",
  description:
    "Bolt Stockfish's NNUE evaluation onto any board representation through one small adapter interface — no rewrite required.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..600,0,0&family=Fraunces:ital,opsz,wght@1,9..144,400..500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
