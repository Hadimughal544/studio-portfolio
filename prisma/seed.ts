import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to your .env file in the project root.",
  );
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@wba.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",  
    },
  });

  const packageCount = await prisma.package.count();
  if (packageCount === 0) {
    await prisma.package.createMany({
      data: [
        {
          name: "Essential",
          description:
            "Perfect for intimate ceremonies. Photography coverage for your special day.",
          price: 150000,
          features: [
            "6 hours photography coverage",
            "1 senior photographer",
            "300+ edited photos",
            "Online gallery delivery",
          ],
          sortOrder: 1,
        },
        {
          name: "Premium",
          description:
            "Our most popular package with full photo and video coverage.",
          price: 350000,
          features: [
            "Full day photo & video coverage",
            "2 photographers + 1 videographer",
            "Cinematic highlight film",
            "500+ edited photos",
            "Premium album",
          ],
          isPopular: true,
          sortOrder: 2,
        },
        {
          name: "Luxury",
          description:
            "The ultimate wedding experience with premium cinematic production.",
          price: 550000,
          features: [
            "Multi-day coverage",
            "Full team of creatives",
            "Drone coverage",
            "Same-day edit",
            "Luxury album & prints",
            "Dedicated project manager",
          ],
          sortOrder: 3,
        },
      ],
    });
  }

  const faqCount = await prisma.faqItem.count();
  if (faqCount === 0) {
    await prisma.faqItem.createMany({
      data: [
        {
          question: "How far in advance should we book?",
          answer:
            "We recommend booking 6-12 months in advance, especially for peak wedding season (November through February) in Pakistan.",
          sortOrder: 1,
        },
        {
          question: "Do you travel outside Karachi?",
          answer:
            "Yes! We cover weddings across Pakistan and internationally. Travel fees may apply depending on location.",
          sortOrder: 2,
        },
        {
          question: "When will we receive our photos and videos?",
          answer:
            "Teaser videos are delivered within 7 days. Full galleries and films are typically delivered within 4-6 weeks.",
          sortOrder: 3,
        },
        {
          question: "Can we customize a package?",
          answer:
            "Absolutely. Every wedding is unique. Contact us and we'll create a tailored package for your needs.",
          sortOrder: 4,
        },
      ],
    });
  }

  console.log("Seed completed.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
