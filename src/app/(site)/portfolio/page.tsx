import { prisma } from "@/lib/prisma";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse our wedding photography and videography portfolio.",
};

export default async function PortfolioPage() {
  const items = await prisma.portfolioItem
    .findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);

  return (
    <div>
      <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Our Work
          </p>
          <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
            Portfolio
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/65">
            A curated collection of love stories, captured with passion and
            precision across Pakistan.
          </p>
        </div>
      </section>
      <PortfolioGallery items={items} />
    </div>
  );
}
