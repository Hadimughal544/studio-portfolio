import { prisma } from "@/lib/prisma";
import { getSiteContentMap } from "@/lib/site-content";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedPortfolio } from "@/components/home/FeaturedPortfolio";
import { CTASection } from "@/components/home/CTASection";
import type { Metadata } from "next";

export const revalidate = 60;

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
  const [featuredItems, heroContent] = await Promise.all([
    prisma.portfolioItem
      .findMany({
        where: { featured: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 6,
      })
      .catch(() => []),
    getSiteContentMap("hero."),
  ]);

  const heroMediaType = heroContent.get("hero.mediaType");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        heading={heroContent.get("hero.heading") || undefined}
        description={heroContent.get("hero.description") || undefined}
        locationLabel={heroContent.get("hero.locationLabel") || undefined}
        mediaUrl={heroContent.get("hero.mediaUrl") || undefined}
        mediaType={heroMediaType === "VIDEO" ? "VIDEO" : undefined}
      />
      <AboutSection />
      <FeaturedPortfolio items={featuredItems} />
      <CTASection />
    </>
  );
}
