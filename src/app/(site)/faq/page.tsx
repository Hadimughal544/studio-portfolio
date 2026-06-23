import { prisma } from "@/lib/prisma";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about our wedding services.",
};

export default async function FAQPage() {
  const faqs = await prisma.faqItem
    .findMany({ orderBy: { sortOrder: "asc" } })
    .catch(() => []);

  return (
    <div>
      <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Questions
          </p>
          <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
            FAQ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/65">
            Everything you need to know about booking, packages, and our wedding
            photography process.
          </p>
        </div>
      </section>
      <FAQAccordion faqs={faqs} />
    </div>
  );
}
