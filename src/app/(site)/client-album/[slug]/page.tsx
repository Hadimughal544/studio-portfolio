import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await prisma.clientAlbum.findUnique({ where: { slug } });
  if (!album) return { title: "Album Not Found" };
  return { title: album.title };
}

export default async function ClientAlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await prisma.clientAlbum.findUnique({ where: { slug } });

  if (!album) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
          Client Album
        </p>
        <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
          {album.title}
        </h1>
        {album.description && (
          <p className="mx-auto mt-4 max-w-2xl text-white/65">{album.description}</p>
        )}
        <div className="mt-12 rounded-sm border border-white/10 bg-white/[0.03] p-12 text-white/50">
          Album gallery content can be linked here (external gallery URL or S3
          folder integration).
        </div>
      </div>
    </div>
  );
}
