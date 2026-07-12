import { prisma } from "@/lib/prisma";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Almir Wedding Films wedding photography and videography services.",
  openGraph: {
    title: "FAQ | Almir Wedding Films",
    description:
      "Answers to common questions about our wedding photography and videography services.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Almir Wedding Films",
    description:
      "Answers to common questions about our wedding photography and videography services.",
  },
};

export default async function FAQPage() {
  const faqs = await prisma.faqItem
    .findMany({ orderBy: { sortOrder: "asc" } })
    .catch(() => []);

  return (
    <div>
      <section className="page-hero py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Questions
          </p>
          <h1 className="mt-4 font-serif text-5xl text-foreground sm:text-6xl">
            FAQ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Everything you need to know about booking, packages, and our wedding
            photography process.
          </p>
        </div>
      </section>
      <FAQAccordion faqs={faqs} />
    </div>
  );
}
