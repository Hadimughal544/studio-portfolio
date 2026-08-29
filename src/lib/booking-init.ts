import type { Package } from "@/generated/prisma/client";
import type { ContractInput } from "@/lib/validations";
import { CUSTOM_BOOKING_DAYS_KEY, MAX_EVENT_DAYS } from "@/lib/constants";

type SearchParamsLike = { get: (key: string) => string | null };

type CustomDayConfig = {
  photographers?: number;
  videographers?: number;
  drone?: number;
  albums?: number;
};

export function createDefaultDay(
  dayNumber = 1,
): ContractInput["days"][number] {
  return {
    dayNumber: Math.min(dayNumber, MAX_EVENT_DAYS),
    coverageLabel: "",
    location: "",
    dateTime: "",
    selectionType: "PACKAGE",
    packageId: "",
    photographers: 0,
    videographers: 0,
    drone: 0,
    albums: 0,
  };
}

function buildCustomDaysFromStorage(): ContractInput["days"] | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(CUSTOM_BOOKING_DAYS_KEY);
  if (!stored) return null;

  try {
    const configs = JSON.parse(stored) as CustomDayConfig[];
    if (!Array.isArray(configs) || configs.length === 0) return null;

    return configs.map((config, index) => ({
      ...createDefaultDay(index + 1),
      selectionType: "CUSTOM" as const,
      packageId: "",
      photographers: Number(config.photographers ?? 0),
      videographers: Number(config.videographers ?? 0),
      drone: Number(config.drone ?? 0),
      albums: Number(config.albums ?? 0),
    }));
  } catch {
    return null;
  }
}

function buildCustomDayFromQueryParams(
  searchParams: SearchParamsLike,
): ContractInput["days"] {
  return [
    {
      ...createDefaultDay(1),
      selectionType: "CUSTOM",
      packageId: "",
      photographers: Number(searchParams.get("photographers") ?? 0),
      videographers: Number(searchParams.get("videographers") ?? 0),
      drone: Number(searchParams.get("drone") ?? 0),
      albums: Number(searchParams.get("albums") ?? 0),
    },
  ];
}

export function buildInitialDays(
  searchParams: SearchParamsLike,
  packages: Package[],
): ContractInput["days"] {
  if (searchParams.get("customize") === "1") {
    const fromStorage = buildCustomDaysFromStorage();
    if (fromStorage) return fromStorage;
    return buildCustomDayFromQueryParams(searchParams);
  }

  const packageId = searchParams.get("packageId");
  if (packageId && packages.some((pkg) => pkg.id === packageId)) {
    return [
      {
        ...createDefaultDay(1),
        selectionType: "PACKAGE",
        packageId,
      },
    ];
  }

  return [createDefaultDay()];
}

export function clearCustomBookingDaysStorage() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CUSTOM_BOOKING_DAYS_KEY);
}
