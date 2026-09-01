"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

/** Simple 1-based pager for client-side paginated admin lists. */
export function Pagination({ page, pageCount, onPageChange }: Props) {
  if (pageCount <= 1) return null;

  const go = (next: number) =>
    onPageChange(Math.min(pageCount, Math.max(1, next)));

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="mt-6 flex items-center justify-center gap-1 text-sm">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="rounded-sm p-2 text-muted-subtle hover:text-foreground disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <span key={p} className="flex items-center">
            {prev && p - prev > 1 && (
              <span className="px-1 text-muted-subtle">…</span>
            )}
            <button
              type="button"
              onClick={() => go(p)}
              aria-current={p === page ? "page" : undefined}
              className={
                p === page
                  ? "min-w-8 rounded-sm bg-gold-500 px-2 py-1 text-black"
                  : "min-w-8 rounded-sm px-2 py-1 text-muted hover:text-foreground"
              }
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page === pageCount}
        className="rounded-sm p-2 text-muted-subtle hover:text-foreground disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
