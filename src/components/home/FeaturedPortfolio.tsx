"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { PortfolioItem } from "@/generated/prisma/client";

type Props = {
  items: PortfolioItem[];
};

export function FeaturedPortfolio({ items }: Props) {
  if (items.length === 0) {
    return (
      <section className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Portfolio
          </p>
          <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
            Weddings by Ayaan Qadeer
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Featured work will appear here once added from the admin panel.
          </p>
          <Link
            href="/portfolio"
            className="mt-8 inline-block text-sm uppercase tracking-[0.2em] text-gold-400 hover:text-gold-300"
          >
            View Full Portfolio →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
              Portfolio
            </p>
            <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
              Featured Work
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="text-sm uppercase tracking-[0.2em] text-gold-400 hover:text-gold-300"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-white/5"
            >
              {item.mediaType === "VIDEO" ? (
                <>
                  <video
                    src={item.mediaUrl}
                    poster={item.thumbnailUrl ?? undefined}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 transition group-hover:bg-black/10">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Play className="ml-1 text-white" fill="white" size={22} />
                    </span>
                  </div>
                </>
              ) : (
                <div
                  className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.mediaUrl}')` }}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-300">
                  {item.category}
                </p>
                <h3 className="mt-1 font-serif text-xl text-white">{item.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
