import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Calendar, Image, Package, Users } from "lucide-react";
import {
  DashboardCharts,
  STATUS_COLORS,
} from "@/components/admin/DashboardCharts";

function getLastSixMonths() {
  const months: { label: string; start: Date; end: Date }[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    months.push({
      label: date.toLocaleString("en", { month: "short" }),
      start: date,
      end,
    });
  }

  return months;
}

export default async function AdminDashboardPage() {
  const months = getLastSixMonths();
  const sixMonthsAgo = months[0].start;

  const [
    bookingsCount,
    portfolioCount,
    packagesCount,
    albumsCount,
    recentBookings,
    allBookings,
    statusGroups,
    categoryGroups,
  ] = await Promise.all([
    prisma.booking.count().catch(() => 0),
    prisma.portfolioItem.count().catch(() => 0),
    prisma.package.count().catch(() => 0),
    prisma.clientAlbum.count().catch(() => 0),
    prisma.booking
      .findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      })
      .catch(() => []),
    prisma.booking
      .findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      })
      .catch(() => []),
    prisma.booking
      .groupBy({
        by: ["status"],
        _count: { status: true },
      })
      .catch(() => []),
    prisma.portfolioItem
      .groupBy({
        by: ["category"],
        _count: { category: true },
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
      label: "Client Albums",
      value: albumsCount,
      icon: Users,
      href: "/admin/client-albums",
    },
    {
      label: "Pending Inquiries",
      value: pendingCount,
      icon: Calendar,
      href: "/admin/bookings",
    },
  ];

  const bookingStatus = statusGroups.map((group) => ({
    label: group.status,
    value: group._count.status,
    color: STATUS_COLORS[group.status] ?? "#a3a3a3",
  }));

  const monthlyBookings = months.map((month) => ({
    label: month.label,
    value: allBookings.filter(
      (b) => b.createdAt >= month.start && b.createdAt <= month.end,
    ).length,
  }));

  const portfolioCategories = categoryGroups
    .map((group) => ({
      label: group.category,
      value: group._count.category,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-serif text-3xl text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-subtle">
        Welcome back. Here&apos;s an overview of your website.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-sm border border-border-theme bg-surface-muted p-6 transition hover:border-gold-400/30"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-subtle">{label}</p>
              <Icon className="text-gold-400" size={20} />
            </div>
            <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
          </Link>
        ))}
      </div>

      <DashboardCharts
        bookingStatus={bookingStatus}
        portfolioCategories={portfolioCategories}
        monthlyBookings={monthlyBookings}
      />

      <div className="mt-10 rounded-sm border border-border-theme bg-surface-muted">
        <div className="border-b border-border-theme px-6 py-4">
          <h2 className="font-serif text-xl text-foreground">Recent Bookings</h2>
        </div>
        {recentBookings.length === 0 ? (
          <p className="p-6 text-sm text-muted-subtle">No bookings yet.</p>
        ) : (
          <div className="divide-y divide-border-theme">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-medium text-foreground">{booking.fullName}</p>
                  <p className="text-sm text-muted-subtle">
                    {booking.eventType} · {formatDate(booking.eventDate)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider ${
                    booking.status === "PENDING"
                      ? "bg-yellow-500/15 text-yellow-300"
                      : booking.status === "CONFIRMED"
                        ? "bg-green-500/15 text-green-300"
                        : "bg-white/10 text-muted"
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
