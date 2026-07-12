import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await prisma.clientAlbum.findUnique({ where: { slug } });
  if (!album) return { title: "Album Not Found" };

  const title = album.title || "Client Album";
  const description = `Private wedding album by Almir Wedding Films${album.title ? `: ${album.title}` : ""}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Almir Wedding Films`,
      description,
      images: album.coverUrl ? [{ url: album.coverUrl }] : [{ url: "/icon.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Almir Wedding Films`,
      description,
      images: album.coverUrl ? [album.coverUrl] : ["/icon.png"],
    },
  };
}

export default async function ClientAlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await prisma.clientAlbum.findUnique({ where: { slug } });

  if (!album) notFound();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
          Client Album
        </p>
        <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
          {album.title || "Client Album"}
        </h1>

        {album.coverUrl && (
          <div
            className="mx-auto mt-10 aspect-[4/5] max-w-md overflow-hidden rounded-sm bg-cover bg-center sm:aspect-[3/4]"
            style={{ backgroundImage: `url('${album.coverUrl}')` }}
          />
        )}

        {album.albumUrl && (
          <a
            href={album.albumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-gold-500 px-6 py-3 text-xs uppercase tracking-[0.15em] text-black transition hover:bg-gold-400"
          >
            View Album
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
