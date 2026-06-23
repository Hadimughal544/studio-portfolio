import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedPortfolio } from "@/components/home/FeaturedPortfolio";
import { CTASection } from "@/components/home/CTASection";

export const dynamic = "force-dynamic";

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
      <HeroSection />
      <AboutSection />
      <FeaturedPortfolio items={featuredItems} />
      <CTASection />
    </>
  );
}
