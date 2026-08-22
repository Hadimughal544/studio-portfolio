import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ContractInput } from "@/lib/validations";
import { Field } from "@/components/booking/FormField";

type Props = {
  register: UseFormRegister<ContractInput>;
  errors: FieldErrors<ContractInput>;
};

export function SignatureStep({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">
          Client Signature
        </h2>
        <p className="mt-1 text-sm text-muted-subtle">
          Type your full legal name to sign this agreement.
        </p>
      </div>

      <Field label="Signature (Full Name)" error={errors.signatureName?.message}>
        <input
          {...register("signatureName")}
          className="form-input font-serif text-lg"
          placeholder="Type your full name"
        />
      </Field>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          {...register("agreedToTerms")}
          className="mt-0.5 accent-gold-500"
        />
        I have read and agree to the Terms & Conditions above.
      </label>
      {errors.agreedToTerms?.message && (
        <p className="text-xs text-red-400">{errors.agreedToTerms.message}</p>
      )}
    </div>
  );
}
