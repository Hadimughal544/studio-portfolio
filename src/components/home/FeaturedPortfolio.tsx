"use client";

import Link from "next/link";
import type { PortfolioItem } from "@/generated/prisma/client";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";

type Props = {
  items: PortfolioItem[];
};

export function FeaturedPortfolio({ items }: Props) {
  if (items.length === 0) {
    return (
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Portfolio
          </p>
          <h2 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
            Almir Wedding Films
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Featured work will appear here once added from the admin panel.
          </p>
          <Link
            href="/portfolio"
            className="mt-8 inline-block text-sm uppercase tracking-[0.2em] text-gold-400 hover:text-gold-300"
          >
            View Full Portfolio →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
              Portfolio
            </p>
            <h2 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
              Featured Work
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="text-sm uppercase tracking-[0.2em] text-gold-400 hover:text-gold-300"
          >
            View All →
          </Link>
        </div>

        <PortfolioGallery items={items} showFilters={false} />
      </div>
    </section>
  );
}
