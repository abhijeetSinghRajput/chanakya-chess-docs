"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/markdown";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => Boolean(el));

    observer.current = new IntersectionObserver(
      (entries) => {
        // pick the entry closest to the top of the viewport that's visible
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSlug(top.target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: [0, 1] }
    );

    elements.forEach((el) => observer.current?.observe(el));
    return () => observer.current?.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${slug}`);
    setActiveSlug(slug);
  };

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="hidden lg:block">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[color:var(--ink-mute)] mb-3">
        On this page
      </p>
      <ul>
        {headings.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              onClick={(e) => handleClick(e, h.slug)}
              className="toc-link"
              data-active={activeSlug === h.slug}
              data-depth={h.depth}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
