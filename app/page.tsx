import Link from "next/link";
import {
  DownloadIcon,
  TerminalSquareIcon,
  GaugeIcon,
  GitBranchIcon,
} from "lucide-react";

const REPO = "https://github.com/abhijeetsinghrajput/chanakya";
const RELEASES = `${REPO}/releases`;

type Build = {
  os: "Windows" | "Linux" | "macOS";
  arch: string;
  file: string;
  note: string;
};

const BUILDS: Build[] = [
  {
    os: "Windows",
    arch: "x86-64",
    file: "chanakya-windows-x64.exe",
    note: "AVX2 build, static-linked",
  },
  {
    os: "Linux",
    arch: "x86-64",
    file: "chanakya-linux-x64",
    note: "AVX2 build, static-linked",
  },
  {
    os: "macOS",
    arch: "arm64 / x86-64",
    file: "chanakya-macos-universal",
    note: "Universal binary",
  },
];

export default function ChanakyaHomePage() {
  return (
    <div className="min-h-screen">
      <div className="grain-bg" />

      <main className="relative z-10">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          <BitboardField />

          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-y-6 px-6 pt-40 pb-20 text-center">
            <span className="font-mono text-[11px] tracking-[0.2em] text-(--brass) uppercase">
              UCI chess engine · C++
            </span>
            <h1 className="font-display text-balance text-[2.4rem] leading-[1.08] sm:text-[3.4rem] font-medium text-(--ink)">
              Chanakya
            </h1>
            <p className="max-w-xl text-pretty text-[1.05rem] leading-relaxed text-(--ink-mute)">
              A bitboard chess engine built from first principles — alpha-beta
              search, NNUE evaluation, tuned and tested one SPRT match at a
              time.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#downloads"
                className="inline-flex items-center gap-2 rounded-sm border border-(--brass) bg-(--brass) px-5 py-2.5 font-mono text-[13px] text-(--bg) transition-opacity hover:opacity-90"
              >
                <DownloadIcon className="size-4" />
                Download
              </a>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-(--hairline) px-5 py-2.5 font-mono text-[13px] text-(--ink) transition-colors hover:border-(--brass) hover:text-(--brass)"
              >
                <GitBranchIcon className="size-4" />
                Source
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Stat strip ---------- */}
        <section className="border-y border-(--hairline)">
          <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-(--hairline)">
            <Stat label="Search" value="PVS + LMR" />
            <Stat label="Eval" value="NNUE" />
            <Stat label="Move gen" value="Bitboard" />
          </div>
        </section>

        {/* ---------- Downloads ---------- */}
        <section id="downloads" className="mx-auto max-w-3xl px-6 py-20">
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <h2 className="font-display text-[1.7rem] text-(--ink)">
              Get the engine
            </h2>
            <p className="max-w-md text-(--ink-mute)">
              Native builds, published from GitHub Releases. Point your
              favourite UCI-compatible GUI at the binary and you&apos;re
              playing.
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
                    <span className="font-display text-[1.15rem] text-(--ink)">
                      {b.os}
                    </span>
                    <DownloadIcon className="size-4 text-(--ink-mute) transition-colors group-hover:text-(--brass)" />
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-(--ink-mute)">
                    {b.arch}
                  </p>
                </div>

                <div className="mt-6">
                  <p className="truncate font-mono text-[12px] text-(--ink-mute)">
                    {b.file}
                  </p>
                  <p className="mt-1 text-[12px] text-(--ink-mute)">
                    {b.note}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <p className="mt-6 text-center text-[12px] text-(--ink-mute)">
            All builds are pulled from the latest{" "}
            <a
              href={RELEASES}
              target="_blank"
              rel="noreferrer"
              className="text-(--brass) hover:underline underline-offset-4"
            >
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
                Running it
              </h2>
            </div>
            <ol className="space-y-4 text-(--ink-mute)">
              <li className="flex gap-3">
                <span className="font-mono text-(--brass)">1.</span>
                <span>
                  Download the build for your platform above and make it
                  executable (
                  <code className="rounded-sm bg-(--hairline)/40 px-1.5 py-0.5 font-mono text-[12px] text-(--ink)">
                    chmod +x
                  </code>{" "}
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
                  <code className="rounded-sm bg-(--hairline)/40 px-1.5 py-0.5 font-mono text-[12px] text-(--ink)">
                    uci
                  </code>
                  ,{" "}
                  <code className="rounded-sm bg-(--hairline)/40 px-1.5 py-0.5 font-mono text-[12px] text-(--ink)">
                    position
                  </code>{" "}
                  and{" "}
                  <code className="rounded-sm bg-(--hairline)/40 px-1.5 py-0.5 font-mono text-[12px] text-(--ink)">
                    go
                  </code>{" "}
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
              Built and tuned via self-play SPRT testing.
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
      <span className="font-display text-[1.05rem] text-(--ink)">
        {value}
      </span>
      <span className="font-mono text-[10px] tracking-[0.15em] text-(--ink-mute) uppercase">
        {label}
      </span>
    </div>
  );
}

/**
 * An 8x8 bitboard rendered as a faint field behind the hero — the same
 * structure the engine's move generation and evaluation are built on.
 * A handful of cells are lit to suggest an occupancy mask, nothing more.
 */
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