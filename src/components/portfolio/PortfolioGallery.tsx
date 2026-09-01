"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PortfolioItem } from "@/generated/prisma/client";
import { cn, optimizeCloudinaryUrl } from "@/lib/utils";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const fromData = [...new Set(items.map((item) => item.category))];
    return ["all", ...fromData];
  }, [items]);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const activeItem =
    lightboxIndex == null ? null : filtered[lightboxIndex] ?? null;

  const go = (delta: number) =>
    setLightboxIndex((i) =>
      i == null ? i : (i + delta + filtered.length) % filtered.length,
    );

  useEffect(() => {
    if (lightboxIndex == null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filtered.length]);

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
                {filtered.map((item, index) => (
                  <motion.button
                    layout
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => setLightboxIndex(index)}
                    className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm bg-surface-muted text-left"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      {item.mediaType === "VIDEO" ? (
                        <AutoplayVideoTile
                          src={optimizeCloudinaryUrl(item.mediaUrl, 800)}
                          poster={
                            item.thumbnailUrl
                              ? optimizeCloudinaryUrl(item.thumbnailUrl)
                              : item.thumbnailUrl
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <Image
                          src={optimizeCloudinaryUrl(item.mediaUrl)}
                          alt={item.title || "Portfolio image"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
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
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-6 top-6 z-[110] text-muted hover:text-foreground"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={28} />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 z-[110] -translate-y-1/2 p-2 text-white/70 transition hover:text-white sm:left-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  className="absolute right-2 top-1/2 z-[110] -translate-y-1/2 p-2 text-white/70 transition hover:text-white sm:right-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            <motion.div
              key={activeItem.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex max-h-[95vh] max-w-[95vw] flex-col items-center overflow-hidden rounded-sm"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1);
                else if (info.offset.x > 80) go(-1);
              }}
            >
              {activeItem.mediaType === "VIDEO" ? (
                <video
                  src={optimizeCloudinaryUrl(activeItem.mediaUrl)}
                  poster={
                    activeItem.thumbnailUrl
                      ? optimizeCloudinaryUrl(activeItem.thumbnailUrl)
                      : undefined
                  }
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="block max-h-[85vh] w-auto max-w-[95vw] object-contain"
                />
              ) : (
                // Fullscreen viewer: a plain <img> lets the media size itself to
                // the viewport (next/image `fill` needs a fixed-size parent and
                // would upscale portrait shots). The URL is already Cloudinary-
                // optimised via optimizeCloudinaryUrl.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={optimizeCloudinaryUrl(activeItem.mediaUrl, 1600)}
                  alt={activeItem.title || "Portfolio image"}
                  className="block max-h-[85vh] w-auto max-w-[95vw] object-contain"
                  draggable={false}
                />
              )}
              {(activeItem.title || activeItem.description) && (
                <div className="w-full shrink-0 bg-black/80 px-4 py-2 text-center">
                  {activeItem.title && (
                    <h3 className="font-serif text-base text-foreground">
                      {activeItem.title}
                    </h3>
                  )}
                  {activeItem.description && (
                    <p className="mt-0.5 text-xs text-muted">
                      {activeItem.description}
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

function AutoplayVideoTile({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string | null;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster ?? undefined}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
