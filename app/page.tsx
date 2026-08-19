import Link from "next/link";
import Image from "next/image";
import {
  DownloadIcon,
  TerminalSquareIcon,
  GaugeIcon,
  GitBranchIcon,
  TrophyIcon,
  CpuIcon,
} from "lucide-react";
import FeaturedBlogs from "@/components/FeaturedBlogs";

const REPO = "https://github.com/abhijeetsinghrajput/chanakya";
const RELEASES = `${REPO}/releases`;

type Build = {
  os: "Windows" | "Linux" | "macOS";
  arch: string;
  file: string;
  note: string;
};

const BUILDS: Build[] = [
  { os: "Windows", arch: "x86-64", file: "chanakya-windows-x64.exe", note: "AVX2 build, static-linked" },
  { os: "Linux", arch: "x86-64", file: "chanakya-linux-x64", note: "AVX2 build, static-linked" },
  { os: "macOS", arch: "arm64 / x86-64", file: "chanakya-macos-universal", note: "Universal binary" },
];

export default function ChanakyaHomePage() {
  return (
    <div className="min-h-screen">
      <div className="grain-bg" />

      <main className="relative z-10">
        {/* ---------- Hero — primary h1, keyword-dense but natural ---------- */}
        <section className="relative overflow-hidden">
          <BitboardField />

          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-y-6 px-6 pt-28 pb-20 text-center">
            <Image
              src="/chanakya-logo.png"
              alt="Chanakya chess engine logo"
              width={200}
              height={200}
              className="rounded-md opacity-90"
            />
            <span className="font-mono text-[11px] tracking-[0.2em] text-(--brass) uppercase">
              NNUE · Bitboard · UCI
            </span>
            <h1 className="font-display text-balance text-[2.2rem] leading-[1.1] sm:text-[3.1rem] font-medium text-(--ink)">
              <span className="text-(--brass)">Chanakya</span> — India&apos;s Top Chess Engine
            </h1>
            <p className="max-w-xl text-pretty text-[1.05rem] leading-relaxed text-(--ink-mute)">
              A 3100+ Elo bitboard chess engine, built from first principles in
              India — alpha-beta search, NNUE evaluation, tuned one SPRT match
              at a time.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#downloads"
                className="inline-flex items-center gap-2 rounded-sm border border-(--brass) bg-(--brass) px-5 py-2.5 font-mono text-[13px] text-(--bg) transition-opacity hover:opacity-90"
              >
                <DownloadIcon className="size-4" />
                Download Chanakya
              </a>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-(--hairline) px-5 py-2.5 font-mono text-[13px] text-(--ink) transition-colors hover:border-(--brass) hover:text-(--brass)"
              >
                <svg width="24" height="24" viewBox="0 0 671 671" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M335.5 55.917C268.921 55.6659 204.439 79.1826 153.653 122.236C102.867 165.289 69.1128 225.053 58.4625 290.775C47.8122 356.497 60.9652 423.862 95.5551 480.751C130.145 537.639 183.901 580.317 247.152 601.105C261.131 603.341 265.604 594.674 265.604 587.125V539.876C188.16 556.651 171.664 503.25 171.664 503.25C166.443 485.886 155.124 470.993 139.792 461.313C114.35 443.979 141.749 444.538 141.749 444.538C150.525 445.673 158.931 448.778 166.338 453.619C173.746 458.46 179.963 464.914 184.525 472.496C192.291 486.305 205.195 496.49 220.431 500.836C235.666 505.181 252.001 503.336 265.884 495.702C267.158 481.528 273.396 468.26 283.498 458.237C223.667 452.087 157.126 428.042 157.126 321.521C156.317 293.604 166.335 266.455 185.084 245.754C176.572 221.694 177.572 195.291 187.88 171.944C187.88 171.944 211.365 164.395 264.765 199.902C310.55 187.595 358.773 187.595 404.557 199.902C457.958 163.836 481.443 171.944 481.443 171.944C491.75 195.291 492.751 221.694 484.238 245.754C502.987 266.455 513.005 293.604 512.197 321.521C512.197 428.322 446.774 451.807 384.427 458.797C391.142 465.546 396.337 473.652 399.664 482.573C402.991 491.493 404.373 501.021 403.718 510.52V587.125C403.718 594.674 408.192 603.621 422.45 601.105C485.586 580.353 539.264 537.791 573.861 481.048C608.459 424.306 621.712 357.095 611.245 291.467C600.778 225.838 567.276 166.084 516.744 122.919C466.213 79.7536 401.958 55.9999 335.5 55.917Z" 
                    fill="currentColor"
                  />
                </svg>
                Source on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Stat strip ---------- */}
        <section className="border-y border-(--hairline)" aria-label="Engine specifications">
          <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-(--hairline)">
            <Stat label="Rating" value="3100+ Elo" />
            <Stat label="Eval" value="NNUE" />
            <Stat label="Move gen" value="Bitboard" />
          </div>
        </section>

        {/* ---------- NNUE section — target: "NNUE" ---------- */}
        <section id="nnue" className="mx-auto max-w-3xl px-6 py-16">
          <div className="mb-6 flex items-center gap-2">
            <CpuIcon className="size-4 text-(--brass)" />
            <h2 className="font-display text-[1.5rem] text-(--ink)">
              NNUE evaluation, done right
            </h2>
          </div>
          <p className="leading-relaxed text-(--ink-mute)">
            Chanakya uses an NNUE (Efficiently Updatable Neural Network)
            evaluation function in the same family as Stockfish&apos;s — a
            small, incrementally-updated network that scores positions far
            more accurately than classical hand-tuned heuristics, without the
            speed cost of a full network forward-pass on every node.
          </p>
          <p className="mt-4 leading-relaxed text-(--ink-mute)">
            If you&apos;re building your own engine and want the same jump in
            playing strength, the write-up below walks through adopting
            Stockfish-style NNUE in any bitboard engine — regardless of your
            board representation or search architecture.
          </p>
          <Link
            href="/blog/integrating-stockfish-nnue"
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-[13px] text-(--brass) hover:underline underline-offset-4"
          >
            Read: Integrating Stockfish NNUE into your own engine →
          </Link>
        </section>

        {/* ---------- Rating / credibility section — target: "elo 3100+", "Indian top engine" ---------- */}
        <section className="border-t border-(--hairline)">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="mb-6 flex items-center gap-2">
              <TrophyIcon className="size-4 text-(--brass)" />
              <h2 className="font-display text-[1.5rem] text-(--ink)">
                3100+ Elo, tested by self-play
              </h2>
            </div>
            <p className="leading-relaxed text-(--ink-mute)">
              Every change to Chanakya is validated with SPRT (Sequential
              Probability Ratio Test) self-play before it ships — the same
              methodology top open-source engines use to confirm a patch is
              a genuine strength gain and not noise.
            </p>
            {/* Replace this with a real, linkable source the moment you have one */}
            <p className="mt-4 leading-relaxed text-(--ink-mute)">
              Built and maintained in India, Chanakya is developed with the
              goal of becoming the strongest Indian-built UCI chess engine —
              full source, build logs, and rating-list results are public on
              GitHub.
            </p>
          </div>
        </section>

        {/* ---------- Blogs ---------- */}
        <FeaturedBlogs />

        {/* ---------- Downloads ---------- */}
        <section id="downloads" className="mx-auto max-w-3xl px-6 py-20">
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <h2 className="font-display text-[1.7rem] text-(--ink)">
              Download Chanakya
            </h2>
            <p className="max-w-md text-(--ink-mute)">
              Free, native builds published from GitHub Releases. Point any
              UCI-compatible GUI at the binary and you&apos;re playing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {BUILDS.map((b) => (
              <a
                key={b.os}
                href={RELEASES}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between rounded-sm border border-(--hairline) p-5 transition-colors hover:border-(--brass)"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[1.15rem] text-(--ink)">{b.os}</span>
                    <DownloadIcon className="size-4 text-(--ink-mute) transition-colors group-hover:text-(--brass)" />
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-(--ink-mute)">{b.arch}</p>
                </div>
                <div className="mt-6">
                  <p className="truncate font-mono text-[12px] text-(--ink-mute)">{b.file}</p>
                  <p className="mt-1 text-[12px] text-(--ink-mute)">{b.note}</p>
                </div>
              </a>
            ))}
          </div>

          <p className="mt-6 text-center text-[12px] text-(--ink-mute)">
            All builds are pulled from the latest{" "}
            <a href={RELEASES} target="_blank" rel="noreferrer" className="text-(--brass) hover:underline underline-offset-4">
              GitHub release
            </a>
            . Check the release notes for version history and checksums.
          </p>
        </section>

        {/* ---------- How to run ---------- */}
        <section className="border-t border-(--hairline)">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="mb-8 flex items-center gap-2">
              <TerminalSquareIcon className="size-4 text-(--brass)" />
              <h2 className="font-display text-[1.3rem] text-(--ink)">
                Running Chanakya
              </h2>
            </div>
            <ol className="space-y-4 text-(--ink-mute)">
              <li className="flex gap-3">
                <span className="font-mono text-(--brass)">1.</span>
                <span>
                  Download the build for your platform above and make it
                  executable (
                  <code className="rounded-sm bg-(--hairline)/40 px-1.5 py-0.5 font-mono text-[12px] text-(--ink)">chmod +x</code>{" "}
                  on Linux/macOS).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-(--brass)">2.</span>
                <span>
                  Open any UCI-compatible GUI — Arena, CuteChess, or Nibbler
                  all work — and add Chanakya as an engine, pointing at the
                  binary.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-(--brass)">3.</span>
                <span>
                  Or drive it directly from a terminal: it speaks UCI over
                  stdin/stdout, so{" "}
                  <code className="rounded-sm bg-(--hairline)/40 px-1.5 py-0.5 font-mono text-[12px] text-(--ink)">uci</code>,{" "}
                  <code className="rounded-sm bg-(--hairline)/40 px-1.5 py-0.5 font-mono text-[12px] text-(--ink)">position</code>{" "}
                  and{" "}
                  <code className="rounded-sm bg-(--hairline)/40 px-1.5 py-0.5 font-mono text-[12px] text-(--ink)">go</code>{" "}
                  work as-is.
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="border-t border-(--hairline)">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-6 py-10 text-[13px] text-(--ink-mute) sm:flex-row">
            <span className="flex items-center gap-1.5">
              <GaugeIcon className="size-3.5" />
              Built and tuned via self-play SPRT testing in India.
            </span>
            <Link
              href="/blog/integrating-stockfish-nnue"
              className="font-mono text-(--brass) hover:underline underline-offset-4"
            >
              Read the NNUE write-up →
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <span className="font-display text-[1.05rem] text-(--ink)">{value}</span>
      <span className="font-mono text-[10px] tracking-[0.15em] text-(--ink-mute) uppercase">{label}</span>
    </div>
  );
}

function BitboardField() {
  const lit = new Set([3, 11, 12, 19, 26, 33, 40, 44, 51, 58]);
  const cells = Array.from({ length: 64 }, (_, i) => i);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[-1] mx-auto grid w-full max-w-2xl grid-cols-8 opacity-[0.35]"
      style={{
        maskImage: "linear-gradient(black 0%, transparent 85%)",
        WebkitMaskImage: "linear-gradient(black 0%, transparent 85%)",
      }}
      aria-hidden
    >
      {cells.map((i) => {
        const row = Math.floor(i / 8);
        const isLit = lit.has(i);
        return (
          <div
            key={i}
            className="aspect-square border border-(--hairline)"
            style={{
              background: isLit
                ? "color-mix(in srgb, var(--brass) 55%, transparent)"
                : (row + i) % 2 === 0
                  ? "color-mix(in srgb, var(--ink) 3%, transparent)"
                  : "transparent",
            }}
          />
        );
      })}
    </div>
  );
}