import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedPortfolio } from "@/components/home/FeaturedPortfolio";
import { CTASection } from "@/components/home/CTASection";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://almirweddingfilms.com";

export const metadata: Metadata = {
  title: {
    absolute: "Almir Wedding Films | Wedding Photography Pakistan",
  },
  description:
    "Premium wedding photography and videography in Lahore, Pakistan. Capturing love stories with elegance and artistry since 2008.",
  openGraph: {
    title: "Almir Wedding Films | Wedding Photography Pakistan",
    description:
      "Premium wedding photography and videography in Lahore, Pakistan.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Almir Wedding Films | Wedding Photography Pakistan",
    description:
      "Premium wedding photography and videography in Lahore, Pakistan.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Almir Wedding Films",
  description:
    "Premium wedding photography and videography in Lahore, Pakistan.",
  url: siteUrl,
  email: "almirweddingfilms@gmail.com",
  telephone: "+923214107323",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office # 41 2nd Floor AL-LATIF CENTRE GULBERG III",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  areaServed: ["Lahore", "Pakistan"],
  sameAs: [
    "https://instagram.com/almirweddingfilms",
    "https://www.tiktok.com/@almirweddingfilms",
  ],
  image: `${siteUrl}/icon.png`,
};

export default async function HomePage() {
  const featuredItems = await prisma.portfolioItem
    .findMany({
      where: { featured: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    })
    .catch(() => []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <AboutSection />
      <FeaturedPortfolio items={featuredItems} />
      <CTASection />
    </>
  );
}
