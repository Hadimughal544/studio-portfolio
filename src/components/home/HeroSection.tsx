"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80')",
        }}
      />

      {/* Extra Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-4 text-xs uppercase tracking-[0.4em] text-gold-300 preserve-gold"
        >
          Lahore, Pakistan
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-serif text-5xl leading-tight text-white sm:text-6xl md:text-7xl"
        >
          Welcome to
          <br />
          <span className="text-gold-300 preserve-gold">
            {" "}
            Almir Wedding Films
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          Where dreams come to life and love stories unfold beautifully.
          Premium wedding photography & cinematography crafted with passion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/portfolio"
            className="rounded-full bg-gold-500 px-8 py-3 text-sm uppercase tracking-[0.2em] text-black transition hover:bg-gold-400"
          >
            View Portfolio
          </Link>

          <Link
            href="/booking"
            className="rounded-full border border-white/40 px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:border-gold-400 hover:text-gold-300"
          >
            Book Your Date
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="animate-bounce text-gold-400/70" size={24} />
      </motion.div>
    </section>
  );
}