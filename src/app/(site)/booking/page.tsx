import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAddonPricing } from "@/lib/site-content";
import { ContractForm } from "@/components/booking/ContractForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Book your wedding photography and videography session with Almir Wedding Films.",
  openGraph: {
    title: "Booking | Almir Wedding Films",
    description:
      "Reserve your wedding date with Almir Wedding Films for photography and videography.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Booking | Almir Wedding Films",
    description:
      "Reserve your wedding date with Almir Wedding Films for photography and videography.",
  },
};

export default async function BookingPage() {
  const [packages, addonPricing] = await Promise.all([
    prisma.package.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    getAddonPricing(),
  ]);

  return (
    <div>
      <section className="page-hero py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Reserve Your Date
          </p>
          <h1 className="mt-4 font-serif text-5xl text-foreground sm:text-6xl">
            Book With Us
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Complete your wedding photography contract below — choose your
            package, confirm the details, and sign electronically.
          </p>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-gold-400" />
          </div>
        }
      >
        <ContractForm packages={packages} addonPricing={addonPricing} />
      </Suspense>
    </div>
  );
}
