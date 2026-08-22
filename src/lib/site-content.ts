import { prisma } from "@/lib/prisma";
import { DEFAULT_ADDON_PRICING } from "@/lib/constants";
import type { AddonPricingInput } from "@/lib/validations";

export async function getSiteContentMap(prefix: string) {
  const rows = await prisma.siteContent
    .findMany({ where: { key: { startsWith: prefix } } })
    .catch(() => []);
  return new Map(rows.map((row) => [row.key, row.value]));
}

export async function setSiteContentValues(values: Record<string, string>) {
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    ),
  );
}

export async function getAddonPricing(): Promise<AddonPricingInput> {
  const row = await prisma.siteContent
    .findUnique({ where: { key: "addon_pricing" } })
    .catch(() => null);

  if (!row) return { ...DEFAULT_ADDON_PRICING };

  try {
    return { ...DEFAULT_ADDON_PRICING, ...JSON.parse(row.value) };
  } catch {
    return { ...DEFAULT_ADDON_PRICING };
  }
}
