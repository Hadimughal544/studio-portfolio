"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/generated/prisma/client";

type Props = {
  faqs: FaqItem[];
};

export function FAQAccordion({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) {
    return (
      <section className="py-24 text-center text-muted-subtle">
        FAQs will be added soon.
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl space-y-3 px-4 sm:px-6">
        {faqs.map((faq) => {
          const open = openId === faq.id;
          return (
            <article
              key={faq.id}
              className="overflow-hidden rounded-sm border border-border-theme bg-surface-muted"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-serif text-lg text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`shrink-0 text-gold-400 transition ${open ? "rotate-180" : ""}`}
                  size={20}
                />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="border-t border-border-theme px-6 py-5 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </section>
  );
}
