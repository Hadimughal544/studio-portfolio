"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, Pencil, Trash2 } from "lucide-react";
import type { Contract } from "@/generated/prisma/client";
import type { StoredContractDay } from "@/lib/validations";
import { ContractForm, CONTRACT_STATUSES } from "@/components/admin/ContractForm";
import { formatDate, formatPrice } from "@/lib/utils";

type Installment = {
  key: "bookingFeePaid" | "eventDayPaid" | "albumDeliveryPaid";
  label: string;
  amount: (c: Contract) => number;
};

const INSTALLMENTS: Installment[] = [
  { key: "bookingFeePaid", label: "Advance / Booking fee", amount: (c) => c.bookingFeeAmount },
  { key: "eventDayPaid", label: "Second due (event day)", amount: (c) => c.eventDayAmount },
  { key: "albumDeliveryPaid", label: "Third due (album delivery)", amount: (c) => c.albumDeliveryAmount },
];

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/contracts/${id}`);
    if (!res.ok) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setContract(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(body: Record<string, unknown>) {
    setError(null);
    // Optimistic update so the toggle responds immediately.
    setContract((c) => (c ? ({ ...c, ...body } as Contract) : c));

    const res = await fetch("/api/admin/contracts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });

    if (!res.ok) {
      setError("Could not save that change. Please try again.");
    }
    load();
  }

  async function remove() {
    if (!confirm("Delete this contract?")) return;
    await fetch(`/api/admin/contracts?id=${id}`, { method: "DELETE" });
    router.push("/admin/contracts");
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-gold-400" />
      </div>
    );
  }

  if (notFound || !contract) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <BackLink />
        <p className="mt-8 text-muted-subtle">Contract not found.</p>
      </div>
    );
  }

  const days = (contract.days as unknown as StoredContractDay[]) ?? [];
  const paidTotal = INSTALLMENTS.reduce(
    (sum, i) => (contract[i.key] ? sum + i.amount(contract) : sum),
    0,
  );
  const outstanding = contract.totalFee - paidTotal;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <BackLink />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">
            {contract.brideName} &amp; {contract.groomName}
          </h1>
          <p className="mt-1 text-sm text-muted-subtle">
            Created {formatDate(contract.createdAt)} · {contract.status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={contract.status}
            onChange={(e) => patch({ status: e.target.value })}
            className="form-input px-3 py-1.5 text-xs uppercase"
          >
            {CONTRACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="inline-flex items-center gap-2 rounded-sm border border-border-theme px-3 py-2 text-xs uppercase tracking-[0.1em] text-muted hover:text-foreground"
          >
            <Pencil size={14} />
            {editing ? "Close" : "Edit"}
          </button>
          <a
            href={`/api/admin/contracts/${contract.id}/pdf`}
            className="rounded-sm border border-border-theme p-2 text-muted-subtle hover:text-foreground"
            aria-label="Download PDF"
          >
            <Download size={16} />
          </a>
          <button
            type="button"
            onClick={remove}
            className="rounded-sm border border-border-theme p-2 text-red-400 hover:bg-red-500/10"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {editing && (
        <div className="mt-8">
          <ContractForm
            contract={contract}
            onSaved={() => {
              setEditing(false);
              load();
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Client">
          <Row label="Booked from" value={contract.bookedFrom} />
          <Row label="Phone" value={contract.clientPhone} />
          <Row label="Email" value={contract.clientEmail} />
          <Row
            label="Coverage"
            value={contract.coverageTypes.join(", ") || "—"}
          />
          <Row
            label="Social media consent"
            value={contract.socialMediaConsent ? "Yes" : "No"}
          />
          <Row label="Signed by" value={contract.signatureName} />
          <Row
            label="Agreed to terms"
            value={contract.agreedToTerms ? "Yes" : "No"}
          />
        </Card>

        <Card title="Payment">
          <Row label="Total fee" value={formatPrice(contract.totalFee)} />

          <div className="mt-3 space-y-2">
            {INSTALLMENTS.map((i) => (
              <div
                key={i.key}
                className="flex items-center justify-between gap-3 rounded-sm bg-black/20 px-3 py-2 text-sm"
              >
                <div>
                  <p className="text-foreground">{i.label}</p>
                  <p className="text-xs text-muted-subtle">
                    {formatPrice(i.amount(contract))}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => patch({ [i.key]: !contract[i.key] })}
                  className={
                    contract[i.key]
                      ? "rounded-full bg-green-500/15 px-3 py-1 text-xs uppercase tracking-wider text-green-300"
                      : "rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-muted hover:text-foreground"
                  }
                >
                  {contract[i.key] ? "Received" : "Mark received"}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-border-theme pt-3 text-sm">
            <Row label="Received so far" value={formatPrice(paidTotal)} />
            <Row
              label="Outstanding balance"
              value={formatPrice(Math.max(0, outstanding))}
            />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-subtle">
            Payment terms: the fee is paid in three installments —{" "}
            {formatPrice(contract.bookingFeeAmount)} advance on signing,{" "}
            {formatPrice(contract.eventDayAmount)} due on the event day, and{" "}
            {formatPrice(contract.albumDeliveryAmount)} due on album delivery.
          </p>
        </Card>

        <Card title="Event days" className="lg:col-span-2">
          <div className="space-y-2">
            {days.map((day, index) => (
              <div
                key={index}
                className="rounded-sm bg-black/20 p-3 text-sm text-muted"
              >
                <p className="text-foreground">
                  Day {day.dayNumber} — {day.coverageLabel} at {day.location}
                </p>
                <p className="text-xs text-muted-subtle">{day.dateTime}</p>
                {day.selectionType === "PACKAGE" ? (
                  <p className="mt-1 text-xs">
                    Package: {day.packageName ?? "—"} (
                    {formatPrice(day.packagePrice ?? 0)})
                  </p>
                ) : day.manual ? (
                  <p className="mt-1 text-xs">
                    Amount: {formatPrice(day.customTotal ?? 0)}
                  </p>
                ) : (
                  <p className="mt-1 text-xs">
                    Custom: {day.photographers ?? 0} photographer(s),{" "}
                    {day.videographers ?? 0} videographer(s), {day.drone ?? 0}{" "}
                    drone, {day.albums ?? 0} album(s) —{" "}
                    {formatPrice(day.customTotal ?? 0)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin/contracts"
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted hover:text-foreground"
    >
      <ArrowLeft size={14} />
      All contracts
    </Link>
  );
}

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-sm border border-border-theme bg-surface-muted p-6 ${className ?? ""}`}
    >
      <h2 className="mb-3 font-serif text-xl text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-muted-subtle">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}
