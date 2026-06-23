"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { EVENT_TYPES } from "@/lib/constants";

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
  });

  async function onSubmit(data: BookingInput) {
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to submit booking");
      }

      setSubmitted(true);
      reset();
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
          className="mx-auto max-w-lg rounded-sm border border-gold-400/30 bg-gold-400/5 p-10 text-center"
        >
          <CheckCircle className="mx-auto text-gold-400" size={48} />
          <h2 className="mt-6 font-serif text-3xl text-white">Thank You!</h2>
          <p className="mt-3 text-white/65">
            Your booking inquiry has been received. We&apos;ll contact you soon
            to confirm the details.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 text-sm uppercase tracking-[0.2em] text-gold-400 hover:text-gold-300"
          >
            Submit Another Inquiry
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Full Name" error={errors.fullName?.message}>
            <input
              {...register("fullName")}
              className="form-input"
              placeholder="Your full name"
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              className="form-input"
              placeholder="you@email.com"
            />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Phone" error={errors.phone?.message}>
            <input
              {...register("phone")}
              className="form-input"
              placeholder="+92 300 0000000"
            />
          </Field>
          <Field label="Event Date" error={errors.eventDate?.message}>
            <input {...register("eventDate")} type="date" className="form-input" />
          </Field>
        </div>

        <Field label="Event Type" error={errors.eventType?.message}>
          <select {...register("eventType")} className="form-input">
            <option value="">Select event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Venue (Optional)" error={errors.venue?.message}>
          <input
            {...register("venue")}
            className="form-input"
            placeholder="Event venue or city"
          />
        </Field>

        <Field label="Message (Optional)" error={errors.message?.message}>
          <textarea
            {...register("message")}
            rows={5}
            className="form-input resize-none"
            placeholder="Tell us about your wedding vision..."
          />
        </Field>

        {error && (
          <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-4 text-sm uppercase tracking-[0.2em] text-black transition hover:bg-gold-400 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Submitting...
            </>
          ) : (
            "Submit Booking Inquiry"
          )}
        </button>
      </form>

      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.875rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: rgba(212, 175, 55, 0.6);
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/60">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
