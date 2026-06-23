"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Image,
  Package,
  HelpCircle,
  FolderOpen,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/portfolio", label: "Portfolio", icon: Image },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/client-albums", label: "Client Albums", icon: FolderOpen },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950">
      <div className="border-b border-white/10 p-6">
        <p className="font-serif text-lg tracking-[0.2em] text-gold-300">WBA</p>
        <p className="text-xs text-white/50">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition",
                active
                  ? "bg-gold-500/15 text-gold-300"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={18} />
          View Website
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
