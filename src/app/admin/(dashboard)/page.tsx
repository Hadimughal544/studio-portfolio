import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Calendar, Image, Package, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const [bookingsCount, portfolioCount, packagesCount, recentBookings] =
    await Promise.all([
      prisma.booking.count().catch(() => 0),
      prisma.portfolioItem.count().catch(() => 0),
      prisma.package.count().catch(() => 0),
      prisma.booking
        .findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        })
        .catch(() => []),
    ]);

  const pendingCount = recentBookings.filter((b) => b.status === "PENDING").length;

  const stats = [
    {
      label: "Total Bookings",
      value: bookingsCount,
      icon: Calendar,
      href: "/admin/bookings",
    },
    {
      label: "Portfolio Items",
      value: portfolioCount,
      icon: Image,
      href: "/admin/portfolio",
    },
    {
      label: "Packages",
      value: packagesCount,
      icon: Package,
      href: "/admin/packages",
    },
    {
      label: "Pending Inquiries",
      value: pendingCount,
      icon: Users,
      href: "/admin/bookings",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">
        Welcome back. Here&apos;s an overview of your website.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-sm border border-white/10 bg-white/[0.03] p-6 transition hover:border-gold-400/30"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/50">{label}</p>
              <Icon className="text-gold-400" size={20} />
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="font-serif text-xl text-white">Recent Bookings</h2>
        </div>
        {recentBookings.length === 0 ? (
          <p className="p-6 text-sm text-white/50">No bookings yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-medium text-white">{booking.fullName}</p>
                  <p className="text-sm text-white/50">
                    {booking.eventType} · {formatDate(booking.eventDate)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider ${
                    booking.status === "PENDING"
                      ? "bg-yellow-500/15 text-yellow-300"
                      : booking.status === "CONFIRMED"
                        ? "bg-green-500/15 text-green-300"
                        : "bg-white/10 text-white/60"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
