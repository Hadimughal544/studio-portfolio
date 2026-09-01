"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Package } from "@/generated/prisma/client";
import type { AddonPricingInput } from "@/lib/validations";
import { CUSTOM_BOOKING_DAYS_KEY } from "@/lib/constants";
import { computeCustomTotal } from "@/lib/pricing";
import { DayCountSelector } from "@/components/booking/DayCountSelector";
import { formatPrice } from "@/lib/utils";

type Props = {
  packages: Package[];
  addonPricing: AddonPricingInput;
};

type CustomDayCounts = {
  photographers: number;
  videographers: number;
  drone: number;
  albums: number;
};

const defaultDayCounts = (): CustomDayCounts => ({
  photographers: 1,
  videographers: 1,
  drone: 0,
  albums: 1,
});

export function PackagesGrid({ packages, addonPricing }: Props) {
  if (packages.length === 0) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-xl px-4 text-center text-muted">
          <p>Packages will be available soon. Please check back or contact us directly.</p>
          <Link
            href="/booking"
            className="mt-6 inline-block text-sm uppercase tracking-[0.2em] text-gold-400"
          >
            Contact Us →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {packages.map((pkg, index) => (
          <motion.article
            key={pkg.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col rounded-sm border p-8 ${
              pkg.isPopular
                ? "border-gold-400/60 bg-gradient-to-b from-gold-400/10 to-transparent"
                : "border-border-theme bg-surface-muted"
            }`}
          >
            {pkg.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-black">
                Most Popular
              </span>
            )}
            <h2 className="font-serif text-3xl text-foreground">{pkg.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {pkg.description}
            </p>
            <p className="mt-8 font-serif text-4xl text-gold-300">
              {formatPrice(pkg.price)}
            </p>
            <ul className="mt-8 flex-1 space-y-3">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                  <Check className="mt-0.5 shrink-0 text-gold-400" size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={`/booking?packageId=${pkg.id}`}
              className={`mt-10 block rounded-full py-3 text-center text-sm uppercase tracking-[0.2em] transition ${
                pkg.isPopular
                  ? "bg-gold-500 text-black hover:bg-gold-400"
                  : "border border-border-theme text-foreground hover:border-gold-400 hover:text-gold-300"
              }`}
            >
              Book This Package
            </Link>
          </motion.article>
        ))}
      </div>

      <CustomizePanel addonPricing={addonPricing} />
    </section>
  );
}

function CustomizePanel({ addonPricing }: { addonPricing: AddonPricingInput }) {
  const router = useRouter();
  const [dayConfigs, setDayConfigs] = useState<CustomDayCounts[]>([
    defaultDayCounts(),
  ]);

  const addonFields: {
    key: keyof CustomDayCounts;
    label: string;
    unitPrice: number;
  }[] = [
    { key: "photographers", label: "Photographers", unitPrice: addonPricing.photographer },
    { key: "videographers", label: "Videographers", unitPrice: addonPricing.videographer },
    { key: "drone", label: "Drone Coverage", unitPrice: addonPricing.drone },
    { key: "albums", label: "Albums", unitPrice: addonPricing.album },
  ];

  function handleDayCountChange(count: number) {
    setDayConfigs((prev) => {
      const next = prev.slice(0, count);
      while (next.length < count) {
        next.push(defaultDayCounts());
      }
      return next;
    });
  }

  function updateDayField(
    dayIndex: number,
    key: keyof CustomDayCounts,
    value: number,
  ) {
    setDayConfigs((prev) =>
      prev.map((day, index) =>
        index === dayIndex ? { ...day, [key]: Math.max(0, value) } : day,
      ),
    );
  }

  const dayTotals = useMemo(
    () => dayConfigs.map((counts) => computeCustomTotal(counts, addonPricing)),
    [dayConfigs, addonPricing],
  );

  const grandTotal = useMemo(
    () => dayTotals.reduce((sum, total) => sum + total, 0),
    [dayTotals],
  );

  function handleContinue() {
    sessionStorage.setItem(CUSTOM_BOOKING_DAYS_KEY, JSON.stringify(dayConfigs));
    router.push(`/booking?customize=1&days=${dayConfigs.length}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-sm border border-gold-400/40 bg-gradient-to-b from-gold-400/10 to-transparent p-8">
        <h2 className="font-serif text-3xl text-foreground">
          Customize Your Package
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Choose how many event days you need, then configure photographers,
          videographers, drone coverage, and albums for each day.
        </p>
        <p className="mt-4 text-sm text-muted-subtle">
          Base package:{" "}
          <span className="text-gold-300">{formatPrice(addonPricing.basePrice)}</span>{" "}
          — added per custom day, then your selections below add on top.
        </p>

        <div className="mt-8">
          <DayCountSelector
            value={dayConfigs.length}
            onChange={handleDayCountChange}
          />
        </div>

        <div className="mt-8 space-y-6">
          {dayConfigs.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="rounded-sm border border-border-theme bg-surface-muted/50 p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="font-serif text-lg text-foreground">
                  Day {dayIndex + 1}
                </h3>
                <p className="text-sm text-gold-300">
                  {formatPrice(dayTotals[dayIndex])}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {addonFields.map(({ key, label, unitPrice }) => (
                  <div key={key}>
                    <label className="form-label">{label}</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={day[key]}
                      onChange={(e) =>
                        updateDayField(dayIndex, key, Number(e.target.value))
                      }
                      className="form-input"
                    />
                    <p className="mt-1 text-xs text-muted-subtle">
                      {formatPrice(unitPrice)} each
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border-theme pt-6">
          <div>
            <p className="font-serif text-3xl text-gold-300">
              {formatPrice(grandTotal)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-subtle">
              Total for {dayConfigs.length}{" "}
              {dayConfigs.length === 1 ? "day" : "days"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="rounded-full bg-gold-500 px-8 py-3 text-sm uppercase tracking-[0.2em] text-black transition hover:bg-gold-400"
          >
            Continue to Booking
          </button>
        </div>
      </div>
    </motion.div>
  );
}
