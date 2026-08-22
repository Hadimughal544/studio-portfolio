import { Plus, Trash2 } from "lucide-react";
import type {
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { Package } from "@/generated/prisma/client";
import type { AddonPricingInput, ContractInput } from "@/lib/validations";
import { COVERAGE_TYPES } from "@/lib/constants";
import { computeCustomTotal } from "@/lib/pricing";
import { Field } from "@/components/booking/FormField";
import { cn, formatPrice } from "@/lib/utils";

type Props = {
  register: UseFormRegister<ContractInput>;
  watch: UseFormWatch<ContractInput>;
  setValue: UseFormSetValue<ContractInput>;
  errors: FieldErrors<ContractInput>;
  fieldArray: UseFieldArrayReturn<ContractInput, "days", "id">;
  packages: Package[];
  addonPricing: AddonPricingInput;
};

const emptyDay = (dayNumber: number): ContractInput["days"][number] => ({
  dayNumber: Math.min(dayNumber, 4) as 1 | 2 | 3 | 4,
  coverageLabel: "",
  location: "",
  dateTime: "",
  selectionType: "PACKAGE",
  packageId: "",
  photographers: 0,
  videographers: 0,
  drone: 0,
});

export function DaysStep({
  register,
  watch,
  setValue,
  errors,
  fieldArray,
  packages,
  addonPricing,
}: Props) {
  const { fields, append, remove } = fieldArray;
  const selectedCoverage = watch("coverageTypes");
  const coverageOptions = selectedCoverage?.length
    ? selectedCoverage
    : COVERAGE_TYPES;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">Event Days</h2>
        <p className="mt-1 text-sm text-muted-subtle">
          Add each event day (up to 4), its location, and the package that
          applies to it — a different package can be chosen per day.
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => {
          const selectionType = watch(`days.${index}.selectionType`);
          const packageId = watch(`days.${index}.packageId`);
          const dayErrors = errors.days?.[index];

          return (
            <div
              key={field.id}
              className="rounded-sm border border-border-theme bg-surface-muted p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg text-foreground">
                  Day {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-sm p-1.5 text-red-400 hover:bg-red-500/10"
                    aria-label="Remove day"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Event" error={dayErrors?.coverageLabel?.message}>
                  <select
                    {...register(`days.${index}.coverageLabel`)}
                    defaultValue=""
                    className="form-input"
                  >
                    <option value="" disabled>
                      Select event
                    </option>
                    {coverageOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Location" error={dayErrors?.location?.message}>
                  <input
                    {...register(`days.${index}.location`)}
                    className="form-input"
                    placeholder="Venue or city"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Date & Time" error={dayErrors?.dateTime?.message}>
                  <input
                    type="datetime-local"
                    {...register(`days.${index}.dateTime`)}
                    className="form-input"
                  />
                </Field>
              </div>

              <div className="mt-5">
                <label className="form-label">Package for this day</label>
                <div className="flex flex-wrap gap-3">
                  {packages.map((pkg) => {
                    const checked = selectionType === "PACKAGE" && packageId === pkg.id;
                    return (
                      <label
                        key={pkg.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2.5 text-sm transition",
                          checked
                            ? "border-gold-400 text-gold-300"
                            : "border-border-theme text-muted hover:border-gold-400/50",
                        )}
                      >
                        <input
                          type="radio"
                          value={pkg.id}
                          checked={checked}
                          onChange={() => {
                            setValue(`days.${index}.packageId`, pkg.id, {
                              shouldValidate: true,
                            });
                            setValue(`days.${index}.selectionType`, "PACKAGE", {
                              shouldValidate: true,
                            });
                          }}
                          className="accent-gold-500"
                        />
                        {pkg.name} — {formatPrice(pkg.price)}
                      </label>
                    );
                  })}
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2.5 text-sm transition",
                      selectionType === "CUSTOM"
                        ? "border-gold-400 text-gold-300"
                        : "border-border-theme text-muted hover:border-gold-400/50",
                    )}
                  >
                    <input
                      type="radio"
                      value="CUSTOM"
                      checked={selectionType === "CUSTOM"}
                      onChange={() => {
                        setValue(`days.${index}.selectionType`, "CUSTOM", {
                          shouldValidate: true,
                        });
                        setValue(`days.${index}.packageId`, "", {
                          shouldValidate: true,
                        });
                      }}
                      className="accent-gold-500"
                    />
                    Customize
                  </label>
                </div>
                {dayErrors?.packageId?.message && selectionType === "PACKAGE" && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {dayErrors.packageId.message}
                  </p>
                )}
              </div>

              {selectionType === "CUSTOM" && (
                <CustomFields
                  index={index}
                  register={register}
                  watch={watch}
                  addonPricing={addonPricing}
                />
              )}
            </div>
          );
        })}
      </div>

      {fields.length < 4 && (
        <button
          type="button"
          onClick={() => append(emptyDay(fields.length + 1))}
          className="inline-flex items-center gap-2 rounded-sm border border-dashed border-border-theme px-4 py-2.5 text-sm text-muted transition hover:border-gold-400/50 hover:text-foreground"
        >
          <Plus size={16} />
          Add Another Day
        </button>
      )}
    </div>
  );
}

function CustomFields({
  index,
  register,
  watch,
  addonPricing,
}: {
  index: number;
  register: UseFormRegister<ContractInput>;
  watch: UseFormWatch<ContractInput>;
  addonPricing: AddonPricingInput;
}) {
  const photographers = watch(`days.${index}.photographers`) ?? 0;
  const videographers = watch(`days.${index}.videographers`) ?? 0;
  const drone = watch(`days.${index}.drone`) ?? 0;

  const total = computeCustomTotal(
    { photographers, videographers, drone },
    addonPricing,
  );

  return (
    <div className="mt-5 rounded-sm border border-gold-400/30 bg-gold-400/5 p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <NumberField
          label="Photographers"
          registration={register(`days.${index}.photographers`, {
            valueAsNumber: true,
          })}
        />
        <NumberField
          label="Videographers"
          registration={register(`days.${index}.videographers`, {
            valueAsNumber: true,
          })}
        />
        <NumberField
          label="Drone"
          registration={register(`days.${index}.drone`, {
            valueAsNumber: true,
          })}
        />
      </div>
      <p className="mt-3 text-sm text-gold-300">
        Estimated: {formatPrice(total)}{" "}
        <span className="text-xs text-muted-subtle">
          (incl. base price {formatPrice(addonPricing.basePrice)})
        </span>
      </p>
    </div>
  );
}

function NumberField({
  label,
  registration,
}: {
  label: string;
  registration: ReturnType<UseFormRegister<ContractInput>>;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-muted-subtle">
        {label}
      </label>
      <input type="number" min={0} max={10} {...registration} className="form-input" />
    </div>
  );
}
