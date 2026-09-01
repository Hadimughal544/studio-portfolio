"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Loader2, Plus, Trash2 } from "lucide-react";
import type { Contract } from "@/generated/prisma/client";
import { ContractForm, CONTRACT_STATUSES } from "@/components/admin/ContractForm";
import { Pagination } from "@/components/admin/Pagination";
import { PaymentDots } from "@/components/admin/PaymentDots";
import { formatDate, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  async function load() {
    const res = await fetch("/api/admin/contracts");
    setContracts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const pageCount = Math.max(1, Math.ceil(contracts.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = useMemo(
    () =>
      contracts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [contracts, currentPage],
  );

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Contracts</h1>
          <p className="mt-1 text-sm text-muted-subtle">
            Wedding contracts from the booking form, plus any you add here.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-gold-500 px-4 py-2 text-sm uppercase tracking-[0.1em] text-black"
          >
            <Plus size={16} />
            Add Contract
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-8">
          <ContractForm
            onSaved={() => {
              setShowForm(false);
              load();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {contracts.length === 0 ? (
        <p className="mt-10 text-muted-subtle">No contracts yet.</p>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-border-theme text-left text-xs uppercase tracking-[0.15em] text-muted-subtle">
                  <th className="py-3 pr-4 font-normal">Couple</th>
                  <th className="py-3 pr-4 font-normal">Contact</th>
                  <th className="py-3 pr-4 font-normal">Total</th>
                  <th className="py-3 pr-4 font-normal">Advance / Remaining</th>
                  <th className="py-3 pr-4 font-normal">Payments</th>
                  <th className="py-3 pr-4 font-normal">Status</th>
                  <th className="py-3 pr-4 font-normal">Created</th>
                  <th className="py-3 pr-4 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((contract) => (
                  <tr
                    key={contract.id}
                    className="border-b border-border-theme align-top"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/contracts/${contract.id}`}
                        className="text-foreground hover:text-gold-300"
                      >
                        {contract.brideName} &amp; {contract.groomName}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-muted-subtle">
                      <div>{contract.clientEmail}</div>
                      <div>{contract.clientPhone}</div>
                    </td>
                    <td className="py-3 pr-4 text-gold-300">
                      {formatPrice(contract.totalFee)}
                    </td>
                    <td className="py-3 pr-4 text-foreground">
                      {formatPrice(contract.bookingFeeAmount)}
                      <span className="text-muted-subtle">
                        {" "}
                        /{" "}
                        {formatPrice(
                          contract.totalFee - contract.bookingFeeAmount,
                        )}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <PaymentDots contract={contract} />
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={contract.status}
                        onChange={(e) =>
                          updateStatus(contract.id, e.target.value)
                        }
                        className="form-input px-2 py-1 text-xs uppercase"
                      >
                        {CONTRACT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-muted-subtle">
                      {formatDate(contract.createdAt)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end gap-1">
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
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
