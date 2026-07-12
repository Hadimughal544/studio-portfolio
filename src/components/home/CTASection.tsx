"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1465495978976-6a5793321409?auto=format&fit=crop&w=2000&q=80')",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.35em] text-gold-300 preserve-gold"
        >
          Let&apos;s Create Magic
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-serif text-4xl text-white sm:text-5xl"
        >
          Ready to Tell Your Love Story?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/85"
        >
          Book a consultation and let our team capture every precious moment of
          your special day with artistry and heart.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <Link
            href="/booking"
            className="inline-flex rounded-full bg-gold-500 px-10 py-4 text-sm uppercase tracking-[0.2em] text-black transition hover:bg-gold-400"
          >
            Book Your Wedding
          </Link>
        </motion.div>
      </div>
    </section>
  );
}