import { prisma } from "@/lib/prisma";
import { ClientAlbumGrid } from "@/components/client-album/ClientAlbumGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Album",
  description: "Private client wedding albums.",
};

export default async function ClientAlbumPage() {
  const albums = await prisma.clientAlbum
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div>
      <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Private Galleries
          </p>
          <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
            Client Album
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/65">
            Access your private wedding gallery. Enter your album password if
            required.
          </p>
        </div>
      </section>
      <ClientAlbumGrid albums={albums} />
    </div>
  );
}
