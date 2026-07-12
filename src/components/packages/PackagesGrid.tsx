"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Package } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/utils";

type Props = {
  packages: Package[];
};

export function PackagesGrid({ packages }: Props) {
  if (packages.length === 0) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-xl px-4 text-center text-muted">
          <p>Packages will be available soon. Please check back or contact us directly.</p>
          <Link
            href="/booking"
            className="mt-6 inline-block text-sm uppercase tracking-[0.2em] text-gold-400"
          >
            Contact Us →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {packages.map((pkg, index) => (
          <motion.article
            key={pkg.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col rounded-sm border p-8 ${
              pkg.isPopular
                ? "border-gold-400/60 bg-gradient-to-b from-gold-400/10 to-transparent"
                : "border-border-theme bg-surface-muted"
            }`}
          >
            {pkg.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-black">
                Most Popular
              </span>
            )}
            <h2 className="font-serif text-3xl text-foreground">{pkg.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {pkg.description}
            </p>
            <p className="mt-8 font-serif text-4xl text-gold-300">
              {formatPrice(pkg.price)}
            </p>
            <ul className="mt-8 flex-1 space-y-3">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                  <Check className="mt-0.5 shrink-0 text-gold-400" size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/booking"
              className={`mt-10 block rounded-full py-3 text-center text-sm uppercase tracking-[0.2em] transition ${
                pkg.isPopular
                  ? "bg-gold-500 text-black hover:bg-gold-400"
                  : "border border-border-theme text-foreground hover:border-gold-400 hover:text-gold-300"
              }`}
            >
              Book This Package
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
