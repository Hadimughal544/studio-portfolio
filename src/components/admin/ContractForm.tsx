"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Contract } from "@/generated/prisma/client";
import type { StoredContractDay } from "@/lib/validations";
import { COVERAGE_TYPES, MAX_EVENT_DAYS } from "@/lib/constants";
import { computePaymentSplit } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

export const CONTRACT_STATUSES = [
  "SUBMITTED",
  "CONFIRMED",
  "CANCELLED",
] as const;

type DayForm = {
  coverageLabel: string;
  location: string;
  dateTime: string;
  amount: number;
};

type FormData = {
  brideName: string;
  groomName: string;
  bookedFrom: "BRIDE" | "GROOM" | "BOTH";
  clientPhone: string;
  clientEmail: string;
  coverageTypes: string[];
  socialMediaConsent: boolean;
  days: DayForm[];
  signatureName: string;
  agreedToTerms: boolean;
  status: (typeof CONTRACT_STATUSES)[number];
  totalFee: number;
  bookingFeeAmount: number;
  eventDayAmount: number;
  albumDeliveryAmount: number;
  bookingFeePaid: boolean;
  eventDayPaid: boolean;
  albumDeliveryPaid: boolean;
};

const makeEmptyDay = (): DayForm => ({
  coverageLabel: COVERAGE_TYPES[0],
  location: "",
  dateTime: "",
  amount: 0,
});

function toFormData(contract?: Contract | null): FormData {
  if (!contract) {
    return {
      brideName: "",
      groomName: "",
      bookedFrom: "BOTH",
      clientPhone: "",
      clientEmail: "",
      coverageTypes: [],
      socialMediaConsent: false,
      days: [makeEmptyDay()],
      signatureName: "",
      agreedToTerms: false,
      status: "SUBMITTED",
      totalFee: 0,
      bookingFeeAmount: 0,
      eventDayAmount: 0,
      albumDeliveryAmount: 0,
      bookingFeePaid: false,
      eventDayPaid: false,
      albumDeliveryPaid: false,
    };
  }

  const days = (contract.days as unknown as StoredContractDay[]) ?? [];
  return {
    brideName: contract.brideName,
    groomName: contract.groomName,
    bookedFrom: contract.bookedFrom as FormData["bookedFrom"],
    clientPhone: contract.clientPhone,
    clientEmail: contract.clientEmail,
    coverageTypes: contract.coverageTypes,
    socialMediaConsent: contract.socialMediaConsent,
    days: days.length
      ? days.map((d) => ({
          coverageLabel: d.coverageLabel,
          location: d.location,
          dateTime: d.dateTime,
          amount: d.customTotal ?? d.packagePrice ?? 0,
        }))
      : [makeEmptyDay()],
    signatureName: contract.signatureName,
    agreedToTerms: contract.agreedToTerms,
    status: contract.status as FormData["status"],
    totalFee: contract.totalFee,
    bookingFeeAmount: contract.bookingFeeAmount,
    eventDayAmount: contract.eventDayAmount,
    albumDeliveryAmount: contract.albumDeliveryAmount,
    bookingFeePaid: contract.bookingFeePaid,
    eventDayPaid: contract.eventDayPaid,
    albumDeliveryPaid: contract.albumDeliveryPaid,
  };
}

type Props = {
  /** Present = edit an existing contract; absent = create a new one. */
  contract?: Contract | null;
  onSaved: () => void;
  onCancel: () => void;
};

export function ContractForm({ contract, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<FormData>(() => toFormData(contract));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (next: Partial<FormData>) => setForm((f) => ({ ...f, ...next }));

  function updateDay(index: number, next: Partial<DayForm>) {
    setForm((f) => ({
      ...f,
      days: f.days.map((d, i) => (i === index ? { ...d, ...next } : d)),
    }));
  }

  function addDay() {
    setForm((f) =>
      f.days.length >= MAX_EVENT_DAYS
        ? f
        : { ...f, days: [...f.days, makeEmptyDay()] },
    );
  }

  function removeDay(index: number) {
    setForm((f) =>
      f.days.length <= 1
        ? f
        : { ...f, days: f.days.filter((_, i) => i !== index) },
    );
  }

  function toggleCoverage(type: string) {
    setForm((f) => ({
      ...f,
      coverageTypes: f.coverageTypes.includes(type)
        ? f.coverageTypes.filter((t) => t !== type)
        : [...f.coverageTypes, type],
    }));
  }

  const installmentSum =
    form.bookingFeeAmount + form.eventDayAmount + form.albumDeliveryAmount;
  const paymentBalanced =
    Math.round(installmentSum) === Math.round(form.totalFee);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentBalanced) return;
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      days: form.days.map((d, i) => ({ ...d, dayNumber: i + 1 })),
    };

    const res = await fetch("/api/admin/contracts", {
      method: contract ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contract ? { id: contract.id, ...payload } : payload),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Could not save the contract. Check the fields and try again.");
      return;
    }
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-border-theme bg-surface-muted p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">
          {contract ? "Edit Contract" : "New Contract"}
        </h2>
        <button type="button" onClick={onCancel} aria-label="Close">
          <X className="text-muted-subtle" size={20} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bride's Name">
          <input
            className="form-input"
            value={form.brideName}
            onChange={(e) => patch({ brideName: e.target.value })}
            required
          />
        </Field>
        <Field label="Groom's Name">
          <input
            className="form-input"
            value={form.groomName}
            onChange={(e) => patch({ groomName: e.target.value })}
            required
          />
        </Field>
        <Field label="Booked From">
          <select
            className="form-input"
            value={form.bookedFrom}
            onChange={(e) =>
              patch({ bookedFrom: e.target.value as FormData["bookedFrom"] })
            }
          >
            <option value="BRIDE">Bride</option>
            <option value="GROOM">Groom</option>
            <option value="BOTH">Both</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            className="form-input"
            value={form.status}
            onChange={(e) =>
              patch({ status: e.target.value as FormData["status"] })
            }
          >
            {CONTRACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Client Phone">
          <input
            className="form-input"
            value={form.clientPhone}
            onChange={(e) => patch({ clientPhone: e.target.value })}
            required
          />
        </Field>
        <Field label="Client Email">
          <input
            type="email"
            className="form-input"
            value={form.clientEmail}
            onChange={(e) => patch({ clientEmail: e.target.value })}
            required
          />
        </Field>
      </div>

      <div className="mt-6">
        <label className="form-label">Coverage Types</label>
        <div className="flex flex-wrap gap-3">
          {COVERAGE_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-sm text-muted"
            >
              <input
                type="checkbox"
                checked={form.coverageTypes.includes(type)}
                onChange={() => toggleCoverage(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={form.socialMediaConsent}
          onChange={(e) => patch({ socialMediaConsent: e.target.checked })}
        />
        Social media consent
      </label>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.15em] text-muted-subtle">
            Event Days
          </span>
          <button
            type="button"
            onClick={addDay}
            disabled={form.days.length >= MAX_EVENT_DAYS}
            className="inline-flex items-center gap-1 rounded-sm border border-border-theme px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-muted hover:text-foreground disabled:opacity-50"
          >
            <Plus size={14} /> Add Day
          </button>
        </div>

        {form.days.map((day, index) => (
          <div
            key={index}
            className="rounded-sm border border-border-theme bg-black/20 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] text-muted-subtle">
                Day {index + 1}
              </span>
              {form.days.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(index)}
                  className="text-red-400 hover:text-red-300"
                  aria-label="Remove day"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Event Type">
                <select
                  className="form-input"
                  value={day.coverageLabel}
                  onChange={(e) =>
                    updateDay(index, { coverageLabel: e.target.value })
                  }
                >
                  {COVERAGE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Location">
                <input
                  className="form-input"
                  value={day.location}
                  onChange={(e) =>
                    updateDay(index, { location: e.target.value })
                  }
                  required
                />
              </Field>
              <Field label="Date & Time">
                <input
                  type="datetime-local"
                  className="form-input"
                  value={day.dateTime}
                  onChange={(e) =>
                    updateDay(index, { dateTime: e.target.value })
                  }
                  required
                />
              </Field>
              <Field label="Amount (PKR)">
                <input
                  type="number"
                  min={0}
                  className="form-input"
                  value={String(day.amount)}
                  onChange={(e) =>
                    updateDay(index, { amount: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-sm border border-border-theme p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm uppercase tracking-[0.15em] text-muted-subtle">
            Payment
          </h3>
          <button
            type="button"
            onClick={() => patch(computePaymentSplit(form.totalFee))}
            className="rounded-sm border border-border-theme px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-muted hover:text-foreground"
          >
            Auto 50 / 40 / 10
          </button>
        </div>

        <div className="mt-3">
          <Field label="Total Fee (PKR)">
            <input
              type="number"
              min={0}
              className="form-input sm:max-w-xs"
              value={String(form.totalFee)}
              onChange={(e) => patch({ totalFee: Number(e.target.value) })}
              required
            />
          </Field>
        </div>

        <div className="mt-3 space-y-3">
          <InstallmentRow
            label="Advance / Booking fee"
            amount={form.bookingFeeAmount}
            paid={form.bookingFeePaid}
            onAmount={(v) => patch({ bookingFeeAmount: v })}
            onPaid={(v) => patch({ bookingFeePaid: v })}
          />
          <InstallmentRow
            label="Second due (event day)"
            amount={form.eventDayAmount}
            paid={form.eventDayPaid}
            onAmount={(v) => patch({ eventDayAmount: v })}
            onPaid={(v) => patch({ eventDayPaid: v })}
          />
          <InstallmentRow
            label="Third due (album delivery)"
            amount={form.albumDeliveryAmount}
            paid={form.albumDeliveryPaid}
            onAmount={(v) => patch({ albumDeliveryAmount: v })}
            onPaid={(v) => patch({ albumDeliveryPaid: v })}
          />
        </div>

        <p className="mt-3 text-sm text-muted-subtle">
          Remaining after advance:{" "}
          <span className="text-foreground">
            {formatPrice(Math.max(0, form.totalFee - form.bookingFeeAmount))}
          </span>
        </p>
        {!paymentBalanced && (
          <p className="mt-1 text-xs text-red-400">
            Installments ({formatPrice(installmentSum)}) must add up to the total
            fee ({formatPrice(form.totalFee)}).
          </p>
        )}
      </div>

      <div className="mt-6">
        <Field label="Signature (full name)">
          <input
            className="form-input sm:max-w-md"
            value={form.signatureName}
            onChange={(e) => patch({ signatureName: e.target.value })}
            required
          />
        </Field>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={form.agreedToTerms}
          onChange={(e) => patch({ agreedToTerms: e.target.checked })}
        />
        Client has agreed to the terms &amp; conditions
      </label>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving || !paymentBalanced}
          className="rounded-sm bg-gold-500 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-black disabled:opacity-60"
        >
          {saving ? "Saving..." : contract ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm border border-border-theme px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function InstallmentRow({
  label,
  amount,
  paid,
  onAmount,
  onPaid,
}: {
  label: string;
  amount: number;
  paid: boolean;
  onAmount: (value: number) => void;
  onPaid: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Field label={`${label} (PKR)`}>
        <input
          type="number"
          min={0}
          className="form-input sm:max-w-xs"
          value={String(amount)}
          onChange={(e) => onAmount(Number(e.target.value))}
        />
      </Field>
      <label className="flex items-center gap-2 pb-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={paid}
          onChange={(e) => onPaid(e.target.checked)}
        />
        Received
      </label>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}
