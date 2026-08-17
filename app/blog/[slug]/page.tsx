import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getHeadings,
  getPostMeta,
  getPostSource,
  markdownToHtml,
} from "@/lib/markdown";
import TableOfContents from "@/components/TableOfContents";
import CodeCopyHandler from "@/components/CodeCopyHandler";
import BitboardMotif from "@/components/BitboardMotif";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import Image from "next/image";

export function generateStaticParams() {
  return [{ slug: "integrating-stockfish-nnue" }];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let source: string;
  try {
    source = getPostSource(slug);
  } catch {
    notFound();
  }

  const meta = getPostMeta(slug, source);
  const headings = await getHeadings(source);
  const html = await markdownToHtml(source);

  return (
    <div className="min-h-screen">
      <div className="grain-bg" />
      <CodeCopyHandler />

      <main className="relative z-10">
        {/* ---------- Hero ---------- */}
        <div className="relative">
          <div
            className="absolute inset-0 z-[-1] w-full h-80 overflow-hidden bg-(--bg)"
            style={{
              maskImage: "linear-gradient(black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(black 40%, transparent 100%)",
            }}
          >
            <Image
              src="/banner-4.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="pointer-events-none select-none object-cover mix-blend-overlay grayscale halftone"
            />
          </div>

          <header className="mx-auto flex w-full max-w-3xl flex-col items-center gap-y-5 px-6 pt-56 text-center">
            <h1 className="font-display text-balance text-[2.1rem] leading-[1.12] sm:text-[2.75rem] font-medium text-(--ink)">
              {meta.title}
            </h1>
            <p className="max-w-xl text-pretty text-[1.05rem] leading-relaxed text-(--ink-mute)">
              {meta.subtitle}
            </p>
          </header>

          <div className="mt-16 px-6">
            <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-evenly gap-x-4 gap-y-2 text-[13px] text-(--ink-mute)">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="size-4" />
                {meta.readingMinutes} min read
              </span>
              <span>Updated {meta.updated}</span>
            </div>
          </div>
        </div>

        {/* ---------- Body: TOC rail + article ---------- */}
        <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-12">
          <aside className="relative">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
              <Link
                href="/"
                className="mt-8 hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-(--ink-mute) hover:text-(--brass) transition-colors"
              >
                <ArrowLeftIcon />
                Back to Chanakya
              </Link>
            </div>
          </aside>

          <article
            className="prose-article max-w-2xl min-w-0"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <footer className="border-t border-(--hairline)">
          <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-(--ink-mute)">
            <span>Written while debugging Chanakya&apos;s NNUE port.</span>
            <Link
              href="/blog/integrating-stockfish-nnue"
              className="font-mono text-(--brass) hover:underline underline-offset-4"
            >
              #{slug}
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
