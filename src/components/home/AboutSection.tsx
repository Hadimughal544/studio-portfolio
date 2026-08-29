"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ABOUT_SECTION_IMAGE } from "@/lib/constants";

export function AboutSection() {
  return (
    <section className="bg-cream py-24 text-black">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] overflow-hidden rounded-sm bg-black/5"
        >
          <Image
            src={ABOUT_SECTION_IMAGE}
            alt="Pakistani wedding photography by Almir Wedding Films"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
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
