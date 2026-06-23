"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import type { Booking } from "@/generated/prisma/client";
import { formatDate } from "@/lib/utils";

const STATUSES = ["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"] as const;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadBookings();
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking inquiry?")) return;
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    loadBookings();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl text-white">Booking Inquiries</h1>
      <p className="mt-1 text-sm text-white/50">
        Manage all wedding booking form submissions.
      </p>

      {bookings.length === 0 ? (
        <p className="mt-10 text-white/50">No booking inquiries yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-sm border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-white">
                    {booking.fullName}
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    {booking.email} · {booking.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                    className="rounded-sm border border-white/15 bg-black/40 px-3 py-1.5 text-xs uppercase text-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteBooking(booking.id)}
                    className="rounded-sm p-2 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-white/40">Event Type</p>
                  <p className="text-white">{booking.eventType}</p>
                </div>
                <div>
                  <p className="text-white/40">Event Date</p>
                  <p className="text-white">{formatDate(booking.eventDate)}</p>
                </div>
                <div>
                  <p className="text-white/40">Venue</p>
                  <p className="text-white">{booking.venue ?? "—"}</p>
                </div>
              </div>

              {booking.message && (
                <p className="mt-4 rounded-sm bg-black/30 p-4 text-sm text-white/70">
                  {booking.message}
                </p>
              )}

              <p className="mt-3 text-xs text-white/30">
                Submitted {formatDate(booking.createdAt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
