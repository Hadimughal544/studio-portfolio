import { prisma } from "@/lib/prisma";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages",
  description: "Wedding photography and videography packages in Pakistan.",
};

export default async function PackagesPage() {
  const packages = await prisma.package
    .findMany({ orderBy: { sortOrder: "asc" } })
    .catch(() => []);

  return (
    <div>
      <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Investment
          </p>
          <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
            Our Packages
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/65">
            Tailored wedding coverage packages designed to capture every moment
            of your celebration with cinematic elegance.
          </p>
        </div>
      </section>
      <PackagesGrid packages={packages} />
    </div>
  );
}
