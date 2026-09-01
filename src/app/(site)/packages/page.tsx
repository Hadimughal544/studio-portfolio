import { prisma } from "@/lib/prisma";
import { getAddonPricing } from "@/lib/site-content";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Wedding photography and videography packages by Almir Wedding Films in Pakistan.",
  openGraph: {
    title: "Packages | Almir Wedding Films",
    description:
      "Explore wedding photography and videography packages tailored for your celebration.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Packages | Almir Wedding Films",
    description:
      "Explore wedding photography and videography packages tailored for your celebration.",
  },
};

export default async function PackagesPage() {
  const [packages, addonPricing] = await Promise.all([
    prisma.package.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    getAddonPricing(),
  ]);

  return (
    <div>
      <section className="page-hero py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Investment
          </p>
          <h1 className="mt-4 font-serif text-5xl text-foreground sm:text-6xl">
            Our Packages
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Tailored wedding coverage packages designed to capture every moment
            of your celebration with cinematic elegance.
          </p>
        </div>
      </section>
      <PackagesGrid packages={packages} addonPricing={addonPricing} />
    </div>
  );
}
