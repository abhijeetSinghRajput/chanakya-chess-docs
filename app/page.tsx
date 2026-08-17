import Link from "next/link";
import BitboardMotif from "@/components/BitboardMotif";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="grain-bg" />
      <main className="relative z-10">
        <div className="relative overflow-hidden border-b border-[color:var(--hairline)]">
          <BitboardMotif />
          <div className="relative mx-auto max-w-2xl px-6 pt-28 pb-24 text-center">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--brass)] mb-5">
              A bitboard chess engine
            </p>
            <h1 className="font-display text-[2.4rem] sm:text-[3.1rem] leading-[1.08] font-medium text-[color:var(--ink)] text-balance">
              Chanakya
            </h1>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-[color:var(--ink-mute)] max-w-md mx-auto text-balance">
              A UCI-compatible engine with alpha-beta search, NNUE evaluation,
              and notes from the bugs along the way.
            </p>
            <div className="mt-9">
              <Link
                href="/blog/integrating-stockfish-nnue"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-panel)] px-5 py-2.5 text-[13px] font-medium text-[color:var(--ink)] hover:border-[color:var(--brass)] hover:text-[color:var(--brass)] transition-colors"
              >
                Read the latest engine notes
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
