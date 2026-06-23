"use client";

import { useState } from "react";
import { Lock, ExternalLink } from "lucide-react";
import type { ClientAlbum } from "@/generated/prisma/client";

type Props = {
  albums: ClientAlbum[];
};

export function ClientAlbumGrid({ albums }: Props) {
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});

  if (albums.length === 0) {
    return (
      <section className="py-24 text-center text-white/50">
        Client albums will appear here once created by the admin.
      </section>
    );
  }

  function tryUnlock(album: ClientAlbum) {
    if (!album.password) {
      setUnlocked((prev) => ({ ...prev, [album.id]: true }));
      return;
    }
    if (passwords[album.id] === album.password) {
      setUnlocked((prev) => ({ ...prev, [album.id]: true }));
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2 sm:px-6">
        {albums.map((album) => {
          const isUnlocked = unlocked[album.id] || !album.password;

          return (
            <article
              key={album.id}
              className="overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]"
            >
              <div
                className="aspect-[16/10] bg-cover bg-center"
                style={{
                  backgroundImage: album.coverUrl
                    ? `url('${album.coverUrl}')`
                    : "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                }}
              />
              <div className="p-6">
                <h2 className="font-serif text-2xl text-white">{album.title}</h2>
                {album.description && (
                  <p className="mt-2 text-sm text-white/60">{album.description}</p>
                )}

                {!isUnlocked ? (
                  <div className="mt-5 flex gap-2">
                    <div className="relative flex-1">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                        size={16}
                      />
                      <input
                        type="password"
                        placeholder="Album password"
                        value={passwords[album.id] ?? ""}
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            [album.id]: e.target.value,
                          }))
                        }
                        className="w-full rounded-sm border border-white/15 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-gold-400/50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => tryUnlock(album)}
                      className="rounded-sm bg-gold-500 px-4 text-xs uppercase tracking-[0.15em] text-black"
                    >
                      Unlock
                    </button>
                  </div>
                ) : (
                  <a
                    href={`/client-album/${album.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-gold-400 hover:text-gold-300"
                  >
                    View Album
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
