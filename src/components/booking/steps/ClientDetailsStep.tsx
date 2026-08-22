import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ContractInput } from "@/lib/validations";
import { Field } from "@/components/booking/FormField";

type Props = {
  register: UseFormRegister<ContractInput>;
  errors: FieldErrors<ContractInput>;
};

export function ClientDetailsStep({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">Client Details</h2>
        <p className="mt-1 text-sm text-muted-subtle">
          Tell us who this wedding contract is for.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Bride's Name" error={errors.brideName?.message}>
          <input
            {...register("brideName")}
            className="form-input"
            placeholder="Bride's full name"
          />
        </Field>
        <Field label="Groom's Name" error={errors.groomName?.message}>
          <input
            {...register("groomName")}
            className="form-input"
            placeholder="Groom's full name"
          />
        </Field>
      </div>

      <Field label="Team Booked From" error={errors.bookedFrom?.message}>
        <div className="flex flex-wrap gap-6">
          {(["BRIDE", "GROOM", "BOTH"] as const).map((side) => (
            <label
              key={side}
              className="flex items-center gap-2 text-sm text-muted"
            >
              <input
                type="radio"
                value={side}
                {...register("bookedFrom")}
                className="accent-gold-500"
              />
              {side.charAt(0) + side.slice(1).toLowerCase()}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone" error={errors.clientPhone?.message}>
          <input
            {...register("clientPhone")}
            className="form-input"
            placeholder="+92 300 0000000"
          />
        </Field>
        <Field label="Email" error={errors.clientEmail?.message}>
          <input
            {...register("clientEmail")}
            type="email"
            className="form-input"
            placeholder="you@email.com"
          />
        </Field>
      </div>
    </div>
  );
}
