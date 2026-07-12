"use client";

import { ExternalLink } from "lucide-react";
import type { ClientAlbum } from "@/generated/prisma/client";

type Props = {
  albums: ClientAlbum[];
};

function AlbumLink({ href, className }: { href: string; className: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      View Album
      <ExternalLink size={14} />
    </a>
  );
}

export function ClientAlbumGrid({ albums }: Props) {
  if (albums.length === 0) {
    return (
      <section className="py-24 text-center text-muted-subtle">
        Client albums will appear here once created by the admin.
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-8">
        {albums.map((album) => {
          const albumLink = album.albumUrl ?? "";

          return (
            <article
              key={album.id}
              className="group overflow-hidden rounded-sm border border-border-theme bg-surface-muted"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: album.coverUrl
                      ? `url('${album.coverUrl}')`
                      : "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                  }}
                />
                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-overlay px-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:flex">
                  {album.title && (
                    <h2 className="font-serif text-2xl text-white">
                      {album.title}
                    </h2>
                  )}
                  {albumLink && (
                    <AlbumLink
                      href={albumLink}
                      className="mt-5 inline-flex items-center gap-2 rounded-sm bg-gold-500 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-black transition hover:bg-gold-400"
                    />
                  )}
                </div>
              </div>

              <div className="p-5 lg:hidden">
                {album.title && (
                  <h2 className="font-serif text-xl text-foreground">
                    {album.title}
                  </h2>
                )}
                {albumLink && (
                  <AlbumLink
                    href={albumLink}
                    className="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-gold-400 hover:text-gold-300"
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
