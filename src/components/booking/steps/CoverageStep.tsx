import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { ContractInput } from "@/lib/validations";
import { COVERAGE_TYPES } from "@/lib/constants";
import { Field } from "@/components/booking/FormField";

type Props = {
  register: UseFormRegister<ContractInput>;
  control: Control<ContractInput>;
  errors: FieldErrors<ContractInput>;
};

export function CoverageStep({ register, control, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">
          Photography Coverage
        </h2>
        <p className="mt-1 text-sm text-muted-subtle">
          Select every event you&apos;d like us to cover.
        </p>
      </div>

      <Field label="Coverage" error={errors.coverageTypes?.message}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {COVERAGE_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 rounded-sm border border-border-theme px-3 py-2.5 text-sm text-muted transition hover:border-gold-400/50"
            >
              <input
                type="checkbox"
                value={type}
                {...register("coverageTypes")}
                className="accent-gold-500"
              />
              {type}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Can we post your pictures/videos on our social media (Instagram, Facebook)?">
        <Controller
          name="socialMediaConsent"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="accent-gold-500"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="accent-gold-500"
                />
                No
              </label>
            </div>
          )}
        />
      </Field>
    </div>
  );
}
