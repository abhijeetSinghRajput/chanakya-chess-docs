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
        <div className="relative overflow-hidden border-b border-[color:var(--hairline)]">
          <BitboardMotif />
          <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-14 text-center">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[color:var(--brass)] mb-5">
              Engine notes
            </p>
            <h1 className="font-display text-[2.1rem] leading-[1.12] sm:text-[2.75rem] font-medium text-[color:var(--ink)] text-balance">
              {meta.title}
            </h1>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-[color:var(--ink-mute)] max-w-xl mx-auto text-balance">
              {meta.subtitle}
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 text-[13px] text-[color:var(--ink-mute)]">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="size-4" />
                {meta.readingMinutes} min read
              </span>
              <span className="h-3 w-px bg-[color:var(--hairline)]" />
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
                className="mt-8 hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-[color:var(--ink-mute)] hover:text-[color:var(--brass)] transition-colors"
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

        <footer className="border-t border-[color:var(--hairline)]">
          <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[color:var(--ink-mute)]">
            <span>Written while debugging Chanakya&apos;s NNUE port.</span>
            <Link
              href="/blog/integrating-stockfish-nnue"
              className="font-mono text-[color:var(--brass)] hover:underline underline-offset-4"
            >
              #{slug}
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
