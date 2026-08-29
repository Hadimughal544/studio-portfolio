import { useMemo } from "react";
import type { UseFormWatch } from "react-hook-form";
import type { Package } from "@/generated/prisma/client";
import type { AddonPricingInput, ContractInput } from "@/lib/validations";
import { STUDIO_INFO } from "@/lib/constants";
import {
  computeContractTotal,
  computeCustomTotal,
  computePaymentSplit,
} from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

type Props = {
  watch: UseFormWatch<ContractInput>;
  packages: Package[];
  addonPricing: AddonPricingInput;
};

function getDaySubtotal(
  day: ContractInput["days"][number],
  packages: Package[],
  addonPricing: AddonPricingInput,
) {
  if (day.selectionType === "PACKAGE") {
    const pkg = packages.find((p) => p.id === day.packageId);
    return {
      label: pkg ? `Package: ${pkg.name}` : "Package",
      amount: pkg?.price ?? 0,
    };
  }

  return {
    label: `Custom: ${day.photographers ?? 0} photographer(s), ${day.videographers ?? 0} videographer(s), ${day.drone ?? 0} drone, ${day.albums ?? 0} album(s)`,
    amount: computeCustomTotal(day, addonPricing),
  };
}

export function ReviewStep({ watch, packages, addonPricing }: Props) {
  const days = watch("days");
  const totalFee = useMemo(
    () => computeContractTotal(days, packages, addonPricing),
    [days, packages, addonPricing],
  );

  const dayBreakdown = useMemo(
    () => days.map((day, index) => ({
      dayNumber: index + 1,
      coverageLabel: day.coverageLabel,
      ...getDaySubtotal(day, packages, addonPricing),
    })),
    [days, packages, addonPricing],
  );

  const { bookingFeeAmount: bookingFee, eventDayAmount, albumDeliveryAmount } =
    computePaymentSplit(totalFee);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">
          Review & Payment Terms
        </h2>
        <p className="mt-1 text-sm text-muted-subtle">
          Please review your total investment and our terms & conditions.
        </p>
      </div>

      <div className="rounded-sm border border-border-theme bg-surface-muted p-5">
        <h3 className="font-serif text-lg text-foreground">Day Breakdown</h3>
        <div className="mt-4 space-y-3">
          {dayBreakdown.map((day) => (
            <div
              key={day.dayNumber}
              className="flex flex-wrap items-start justify-between gap-3 border-b border-border-theme pb-3 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="text-sm text-foreground">
                  Day {day.dayNumber}
                  {day.coverageLabel ? ` — ${day.coverageLabel}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-subtle">{day.label}</p>
              </div>
              <p className="text-sm text-gold-300">{formatPrice(day.amount)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-sm border border-gold-400/40 bg-gold-400/5 p-6">
        <p className="font-serif text-3xl text-gold-300">
          {formatPrice(totalFee)}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-subtle">
          Total Fee
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-muted-subtle">
              Booking Fee (50%)
            </dt>
            <dd className="mt-1 text-foreground">{formatPrice(bookingFee)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-muted-subtle">
              Due on Event Day (40%)
            </dt>
            <dd className="mt-1 text-foreground">
              {formatPrice(eventDayAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-muted-subtle">
              Due on Album Delivery (10%)
            </dt>
            <dd className="mt-1 text-foreground">
              {formatPrice(albumDeliveryAmount)}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="font-serif text-lg text-foreground">
          Terms & Conditions
        </h3>
        <div className="mt-3 max-h-64 overflow-y-auto rounded-sm border border-border-theme bg-surface-muted p-5 text-sm leading-relaxed text-muted">
          <ol className="list-decimal space-y-3 pl-4">
            <li>
              The Client hereby engages {STUDIO_INFO.name} to cover the
              event(s) detailed above for the total fee shown.
            </li>
            <li>
              The Client agrees to pay the fee in three installments: 50% as
              a booking fee on signing this agreement, 40% due on the day of
              the event, and 10% due at the time of album delivery.
            </li>
            <li>
              This agreement shall be deemed cancelled if all monies are not
              paid on time as stipulated, and {STUDIO_INFO.name} shall have
              no further obligations to the Client.
            </li>
            <li>
              It is the Client&apos;s responsibility to obtain permission for
              entry to and photography at all applicable locations, and to
              advise {STUDIO_INFO.name} of any restrictions or policies in
              place at those locations.
            </li>
            <li>
              Songs for videography will be decided by the Client; no
              changes will be accepted if the studio produces the edit on
              its own discretion. Pictures will be available for selection
              one week after the event, and albums/videos will be delivered
              within 30–40 days of picture selection. After that period,{" "}
              {STUDIO_INFO.name} will not be liable for any inconvenience.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
