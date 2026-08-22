"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Download, Loader2, Trash2 } from "lucide-react";
import type { Contract } from "@/generated/prisma/client";
import type { StoredContractDay } from "@/lib/validations";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const STATUSES = ["SUBMITTED", "CONFIRMED", "CANCELLED"] as const;

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/contracts");
    setContracts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/contracts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function deleteContract(id: string) {
    if (!confirm("Delete this contract?")) return;
    await fetch(`/api/admin/contracts?id=${id}`, { method: "DELETE" });
    load();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-serif text-3xl text-foreground">Contracts</h1>
      <p className="mt-1 text-sm text-muted-subtle">
        Signed wedding contracts submitted through the booking form.
      </p>

      {contracts.length === 0 ? (
        <p className="mt-10 text-muted-subtle">No contracts submitted yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {contracts.map((contract) => {
            const days = (contract.days as unknown as StoredContractDay[]) ?? [];
            const expanded = expandedId === contract.id;

            return (
              <article
                key={contract.id}
                className="rounded-sm border border-border-theme bg-surface-muted p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium text-foreground">
                      {contract.brideName} &amp; {contract.groomName}
                    </h2>
                    <p className="mt-1 text-sm text-muted-subtle">
                      {contract.clientEmail} · {contract.clientPhone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={contract.status}
                      onChange={(e) => updateStatus(contract.id, e.target.value)}
                      className="form-input px-3 py-1.5 text-xs uppercase"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <a
                      href={`/api/admin/contracts/${contract.id}/pdf`}
                      className="rounded-sm p-2 text-muted-subtle hover:bg-surface-muted hover:text-foreground"
                      aria-label="Download PDF"
                    >
                      <Download size={16} />
                    </a>
                    <button
                      type="button"
                      onClick={() => deleteContract(contract.id)}
                      className="rounded-sm p-2 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-muted-subtle">Total Fee</p>
                    <p className="text-gold-300">{formatPrice(contract.totalFee)}</p>
                  </div>
                  <div>
                    <p className="text-muted-subtle">Coverage</p>
                    <p className="text-foreground">
                      {contract.coverageTypes.join(", ") || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-subtle">Signed By</p>
                    <p className="text-foreground">{contract.signatureName}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : contract.id)}
                  className="mt-4 flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-gold-400 hover:text-gold-300"
                >
                  <ChevronDown
                    size={14}
                    className={cn("transition", expanded && "rotate-180")}
                  />
                  {expanded ? "Hide" : "View"} Details
                </button>

                {expanded && (
                  <div className="mt-4 space-y-3 border-t border-border-theme pt-4">
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-muted-subtle">Booked From</p>
                        <p className="text-foreground">{contract.bookedFrom}</p>
                      </div>
                      <div>
                        <p className="text-muted-subtle">Social Media Consent</p>
                        <p className="text-foreground">
                          {contract.socialMediaConsent ? "Yes" : "No"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-subtle">Payment Split</p>
                        <p className="text-foreground">
                          {formatPrice(contract.bookingFeeAmount)} / {" "}
                          {formatPrice(contract.eventDayAmount)} / {" "}
                          {formatPrice(contract.albumDeliveryAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {days.map((day, index) => (
                        <div
                          key={index}
                          className="rounded-sm bg-black/20 p-3 text-sm text-muted"
                        >
                          <p className="text-foreground">
                            Day {day.dayNumber} — {day.coverageLabel} at{" "}
                            {day.location}
                          </p>
                          <p className="text-xs text-muted-subtle">
                            {day.dateTime}
                          </p>
                          {day.selectionType === "PACKAGE" ? (
                            <p className="mt-1 text-xs">
                              Package: {day.packageName ?? "—"} (
                              {formatPrice(day.packagePrice ?? 0)})
                            </p>
                          ) : (
                            <p className="mt-1 text-xs">
                              Custom: {day.photographers ?? 0} photographer(s),{" "}
                              {day.videographers ?? 0} videographer(s),{" "}
                              {day.drone ?? 0} drone —{" "}
                              {formatPrice(day.customTotal ?? 0)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="mt-3 text-xs text-foreground/30">
                  Submitted {formatDate(contract.createdAt)}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
