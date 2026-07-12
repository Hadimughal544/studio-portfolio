import { prisma } from "@/lib/prisma";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse Almir Wedding Films wedding photography and videography portfolio across Pakistan.",
  openGraph: {
    title: "Portfolio | Almir Wedding Films",
    description:
      "A curated collection of wedding love stories captured with passion across Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Almir Wedding Films",
    description:
      "A curated collection of wedding love stories captured with passion across Pakistan.",
  },
};

export default async function PortfolioPage() {
  const items = await prisma.portfolioItem
    .findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);

  return (
    <div>
      <section className="page-hero py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Our Work
          </p>
          <h1 className="mt-4 font-serif text-5xl text-foreground sm:text-6xl">
            Portfolio
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            A curated collection of love stories, captured with passion and
            precision across Pakistan.
          </p>
        </div>
      </section>
      <PortfolioGallery items={items} />
    </div>
  );
}
