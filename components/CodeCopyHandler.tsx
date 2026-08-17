"use client";

import { useEffect } from "react";

export default function CodeCopyHandler() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "button.code-copy"
      );
      if (!btn) return;
      const figure = btn.closest(".code-figure");
      const code = figure?.querySelector("pre code");
      if (!code) return;
      const text = code.textContent ?? "";
      navigator.clipboard.writeText(text).then(() => {
        btn.setAttribute("data-copied", "true");
        setTimeout(() => btn.removeAttribute("data-copied"), 1500);
      });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
