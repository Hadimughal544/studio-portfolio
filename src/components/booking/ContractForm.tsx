"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import type { Package } from "@/generated/prisma/client";
import {
  contractSchema,
  type AddonPricingInput,
  type ContractInput,
} from "@/lib/validations";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ClientDetailsStep } from "@/components/booking/steps/ClientDetailsStep";
import { CoverageStep } from "@/components/booking/steps/CoverageStep";
import { DaysStep } from "@/components/booking/steps/DaysStep";
import { ReviewStep } from "@/components/booking/steps/ReviewStep";
import { SignatureStep } from "@/components/booking/steps/SignatureStep";

type Props = {
  packages: Package[];
  addonPricing: AddonPricingInput;
};

const STEP_FIELDS: (keyof ContractInput)[][] = [
  ["brideName", "groomName", "bookedFrom", "clientPhone", "clientEmail"],
  ["coverageTypes", "socialMediaConsent"],
  ["days"],
  [],
  ["signatureName", "agreedToTerms"],
];

const defaultDay = (): ContractInput["days"][number] => ({
  dayNumber: 1,
  coverageLabel: "",
  location: "",
  dateTime: "",
  selectionType: "PACKAGE",
  packageId: "",
  photographers: 0,
  videographers: 0,
  drone: 0,
});

export function ContractForm({ packages, addonPricing }: Props) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    watch,
    setValue,
    trigger,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContractInput>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      brideName: "",
      groomName: "",
      bookedFrom: "BOTH",
      clientPhone: "",
      clientEmail: "",
      coverageTypes: [],
      socialMediaConsent: true,
      days: [defaultDay()],
      signatureName: "",
      agreedToTerms: false,
    },
  });

  const fieldArray = useFieldArray({ control, name: "days" });

  useEffect(() => {
    if (searchParams.get("customize") !== "1") return;
    setValue("days.0.selectionType", "CUSTOM");
    setValue("days.0.packageId", "");
    setValue(
      "days.0.photographers",
      Number(searchParams.get("photographers") ?? 0),
    );
    setValue(
      "days.0.videographers",
      Number(searchParams.get("videographers") ?? 0),
    );
    setValue("days.0.drone", Number(searchParams.get("drone") ?? 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step - 1]);
    if (valid) setStep((s) => Math.min(s + 1, 5));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function onSubmit(data: ContractInput) {
    setError(null);
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to submit contract");
      }

      setSubmitted(true);
      reset();
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (submitted) {
    return (
      <section className="py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg rounded-sm border border-gold-400/40 bg-surface-muted p-10 text-center"
        >
          <CheckCircle className="mx-auto text-gold-400" size={48} />
          <h2 className="mt-6 font-serif text-3xl text-foreground">
            Contract Submitted!
          </h2>
          <p className="mt-3 text-muted">
            Thank you for booking with us. We&apos;ll be in touch shortly to
            confirm your booking fee and finalize the details.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 text-sm uppercase tracking-[0.2em] text-gold-500 hover:text-gold-400 dark:text-gold-400 dark:hover:text-gold-300"
          >
            Submit Another Contract
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <StepIndicator current={step} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-sm border border-border-theme bg-surface-muted p-6 sm:p-8"
        >
          {step === 1 && <ClientDetailsStep register={register} errors={errors} />}
          {step === 2 && (
            <CoverageStep register={register} control={control} errors={errors} />
          )}
          {step === 3 && (
            <DaysStep
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              fieldArray={fieldArray}
              packages={packages}
              addonPricing={addonPricing}
            />
          )}
          {step === 4 && (
            <ReviewStep watch={watch} packages={packages} addonPricing={addonPricing} />
          )}
          {step === 5 && <SignatureStep register={register} errors={errors} />}

          {error && (
            <p className="form-error mt-6 rounded-sm px-4 py-3 text-sm">{error}</p>
          )}

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-border-theme pt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="rounded-full border border-border-theme px-6 py-2.5 text-sm uppercase tracking-[0.15em] text-muted transition hover:text-foreground disabled:opacity-40"
            >
              Back
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-gold-500 px-8 py-2.5 text-sm uppercase tracking-[0.15em] text-black transition hover:bg-gold-400"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-full bg-gold-500 px-8 py-2.5 text-sm uppercase tracking-[0.15em] text-black transition hover:bg-gold-400 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Submitting...
                  </>
                ) : (
                  "Sign & Submit"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
