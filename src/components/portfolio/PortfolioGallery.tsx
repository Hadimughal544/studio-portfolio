"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { PortfolioItem } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

type Props = {
  items: PortfolioItem[];
  showFilters?: boolean;
  className?: string;
};

export function PortfolioGallery({
  items,
  showFilters = true,
  className,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  const categories = useMemo(() => {
    const fromData = [...new Set(items.map((item) => item.category))];
    return ["all", ...fromData];
  }, [items]);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <>
      {showFilters && (
        <section className="py-12">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-4 sm:px-6 lg:px-8">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2 text-xs uppercase tracking-[0.15em] transition ${
                  activeCategory === category
                    ? "bg-gold-500 text-black"
                    : "border border-border-theme text-muted hover:border-gold-400/50 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className={cn(showFilters ? "pb-24" : undefined, className)}>
        <div
          className={cn(
            showFilters && "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          )}
        >
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-muted-subtle">
              No portfolio items yet. Check back soon!
            </p>
          ) : (
            <motion.div
              layout
              className="columns-1 gap-4 sm:columns-2 lg:columns-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <motion.button
                    layout
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => setLightbox(item)}
                    className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm bg-surface-muted text-left"
                  >
                    <div className="relative">
                      {item.mediaType === "VIDEO" ? (
                        <video
                          src={item.mediaUrl}
                          poster={item.thumbnailUrl ?? undefined}
                          className="aspect-[4/5] w-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.title || "Portfolio image"}
                          className="w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}
                      {item.title && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <p className="font-serif text-lg text-foreground">
                            {item.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-6 top-6 text-muted hover:text-foreground"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[85vh] max-w-5xl overflow-hidden rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.mediaType === "VIDEO" ? (
                <video
                  src={lightbox.mediaUrl}
                  poster={lightbox.thumbnailUrl ?? undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="max-h-[85vh] w-full"
                />
              ) : (
                <img
                  src={lightbox.mediaUrl}
                  alt={lightbox.title || "Portfolio image"}
                  className="max-h-[85vh] w-full object-contain"
                />
              )}
              {(lightbox.title || lightbox.description) && (
                <div className="bg-black/80 p-4 text-center">
                  {lightbox.title && (
                    <h3 className="font-serif text-2xl text-foreground">
                      {lightbox.title}
                    </h3>
                  )}
                  {lightbox.description && (
                    <p className="mt-2 text-sm text-muted">
                      {lightbox.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
