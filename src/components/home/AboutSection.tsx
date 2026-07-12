"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="bg-cream py-24 text-black">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] overflow-hidden rounded-sm"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80')",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-gold-500">
            About
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Crafting Timeless
            <br />
            Wedding Memories
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-black/70">
            <p>
              Almir Wedding Films is a team of dedicated creatives based in
              Lahore, Pakistan. We bring a wealth of expertise to every
              celebration with a photography and videography journey.
            </p>
            <p>
              At Almir Wedding Films, your satisfaction is our highest priority.
              We pour our passion and creativity into crafting imagery that
              stands out and speaks with its own unique voice.
            </p>
            <p>
              Welcome to a world where weddings are not just events, they are the
              beginning of a lifetime of cherished memories.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
