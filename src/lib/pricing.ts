import type { AddonPricingInput, ContractInput } from "@/lib/validations";

type PackageLike = { id: string; price: number };

type CustomCounts = {
  photographers?: number;
  videographers?: number;
  drone?: number;
  albums?: number;
};

export function computeCustomTotal(
  counts: CustomCounts,
  addonPricing: AddonPricingInput,
) {
  return (
    addonPricing.basePrice +
    (counts.photographers ?? 0) * addonPricing.photographer +
    (counts.videographers ?? 0) * addonPricing.videographer +
    (counts.drone ?? 0) * addonPricing.drone +
    (counts.albums ?? 0) * addonPricing.album
  );
}

export function computeContractTotal(
  days: ContractInput["days"],
  packages: PackageLike[],
  addonPricing: AddonPricingInput,
) {
  return days.reduce((sum, day) => {
    if (day.selectionType === "PACKAGE") {
      const pkg = packages.find((p) => p.id === day.packageId);
      return sum + (pkg?.price ?? 0);
    }
    return sum + computeCustomTotal(day, addonPricing);
  }, 0);
}

export function computePaymentSplit(totalFee: number) {
  const bookingFeeAmount = Math.round(totalFee * 0.5);
  const eventDayAmount = Math.round(totalFee * 0.4);
  const albumDeliveryAmount = totalFee - bookingFeeAmount - eventDayAmount;
  return { bookingFeeAmount, eventDayAmount, albumDeliveryAmount };
}
