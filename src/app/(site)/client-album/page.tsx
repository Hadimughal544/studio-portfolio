import { prisma } from "@/lib/prisma";
import { ClientAlbumGrid } from "@/components/client-album/ClientAlbumGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Album",
  description:
    "Private client wedding albums from Almir Wedding Films. Browse your gallery and open the full album.",
  openGraph: {
    title: "Client Album | Almir Wedding Films",
    description:
      "Access private wedding galleries from Almir Wedding Films.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Album | Almir Wedding Films",
    description:
      "Access private wedding galleries from Almir Wedding Films.",
  },
};

export default async function ClientAlbumPage() {
  const albums = await prisma.clientAlbum
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div>
      <section className="page-hero py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Private Galleries
          </p>
          <h1 className="mt-4 font-serif text-5xl text-foreground sm:text-6xl">
            Client Album
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Browse your private wedding gallery and open the full album when you
            are ready.
          </p>
        </div>
      </section>
      <ClientAlbumGrid albums={albums} />
    </div>
  );
}
