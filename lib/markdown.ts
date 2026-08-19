import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";
import readingTime from "reading-time";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

// Detects a language/meta hint like ```cpp title="position.h" and extracts a
// display filename, falling back to a friendly language label.
function langLabel(lang: string | undefined) {
  const map: Record<string, string> = {
    cpp: "C++",
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
    bash: "Shell",
    sh: "Shell",
    text: "Plain text",
    plaintext: "Plain text",
  };
  if (!lang) return "Code";
  return map[lang] ?? lang;
}

/**
 * Wraps h2/h3 text (already id'd by rehype-slug) in a self-link so every
 * section heading is clickable and scrolls to itself — with a small
 * hover-revealed permalink mark in the corner.
 */
function rehypeHeadingLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (!/^h[2-3]$/.test(node.tagName)) return;
      const id = node.properties?.id as string | undefined;
      if (!id) return;

      const originalChildren = node.children;
      const link: Element = {
        type: "element",
        tagName: "a",
        properties: { href: `#${id}`, className: ["heading-link"], "data-heading-link": "" },
        children: [
          ...originalChildren,
          {
            type: "element",
            tagName: "span",
            properties: { className: ["heading-mark"] },
            children: [{ type: "text", value: " #" }],
          },
        ],
      };
      node.children = [link];
    });
  };
}

/**
 * rehype-pretty-code wraps each code block's <pre> — this plugin then
 * wraps THAT in the figure/titlebar/copy-button chrome matching the
 * reference design, and injects a filename tab (from a `title="..."`
 * meta string when present, or the language name otherwise).
 */
function rehypeCodeChrome() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      // rehype-pretty-code emits <figure data-rehype-pretty-code-figure>
      // containing an optional <figcaption data-rehype-pretty-code-title>
      // and a <pre>. Replace that whole figure with our own chrome.
      if (
        node.tagName !== "figure" ||
        node.properties?.["data-rehype-pretty-code-figure"] === undefined ||
        !parent ||
        index === undefined
      )
        return;

      const figcaption = node.children.find(
        (c): c is Element => c.type === "element" && c.tagName === "figcaption"
      );
      const pre = node.children.find(
        (c): c is Element => c.type === "element" && c.tagName === "pre"
      );
      if (!pre) return;

      const dataLang = (pre.properties?.["data-language"] as string) ?? "";
      let title = "";
      if (figcaption) {
        title = figcaption.children
          .filter((c): c is { type: "text"; value: string } => c.type === "text")
          .map((c) => c.value)
          .join("");
      }
      if (!title) title = langLabel(dataLang);

      const figure: Element = {
        type: "element",
        tagName: "figure",
        properties: {
          className: ["code-figure"],
          "data-lang": dataLang,
        },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["code-inner"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["code-tab"] },
                children: [{ type: "text", value: title }],
              },
              {
                type: "element",
                tagName: "button",
                properties: {
                  className: ["code-copy"],
                  type: "button",
                  "aria-label": "Copy code",
                  "data-copy": "",
                },
                children: [
                  {
                    type: "element",
                    tagName: "svg",
                    properties: {
                      viewBox: "0 0 256 256",
                      className: ["icon-copy"],
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "path",
                        properties: {
                          d: "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z",
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    type: "element",
                    tagName: "svg",
                    properties: {
                      viewBox: "0 0 256 256",
                      className: ["icon-check"],
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "path",
                        properties: {
                          d: "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z",
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              pre,
            ],
          },
        ],
      };

      parent.children[index] = figure;
    });
  };
}

export async function getHeadings(markdown: string): Promise<Heading[]> {
  const { content } = matter(markdown); // strip frontmatter first
  const headings: Heading[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(() => (tree: Root) => {
      visit(tree, "element", (node: Element) => {
        if (/^h[2-3]$/.test(node.tagName)) {
          const depth = Number(node.tagName[1]);
          const text = node.children
            .filter((c): c is { type: "text"; value: string } => c.type === "text")
            .map((c) => c.value)
            .join("")
            .trim();
          const slug = (node.properties?.id as string) ?? "";
          if (text) headings.push({ depth, text, slug });
        }
      });
    })
    .use(rehypeStringify)
    .process(content); // ← was `markdown`
  void file;
  return headings;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const { content } = matter(markdown); // strip frontmatter first
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: "vesper",
      keepBackground: false,
      defaultLang: "text",
    })
    .use(rehypeHeadingLinks)
    .use(rehypeCodeChrome)
    .use(rehypeStringify)
    .process(content); // ← was `markdown`

  return String(file);
}

export interface PostMeta {
  slug: string;
  title: string;
  subtitle: string;
  updated: string;
  cover: string;
  readingMinutes: number;
}

export function getPostSource(slug: string): string {
  const file = path.join(process.cwd(), "content", `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  return raw.replace(/^\uFEFF/, ""); // strip BOM if present
}

export function getPostMeta(slug: string, source: string): PostMeta {
  const { data, content } = matter(source);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title ?? slug,
    subtitle: data.subtitle ?? "",
    updated: data.updated ?? "",
    cover: data.cover ?? "/banner-4.png", // fallback keeps old behavior if a post omits it
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };
}


export function getAllPostsMeta(): PostMeta[] {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const source = getPostSource(slug);
      return getPostMeta(slug, source);
    })
    // newest first — assumes `updated` sorts lexicographically or you swap in real Date parsing
    .sort((a, b) => (a.updated < b.updated ? 1 : -1));
}