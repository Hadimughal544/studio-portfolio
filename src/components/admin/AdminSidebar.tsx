"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Image,
  Package,
  HelpCircle,
  FolderOpen,
  LogOut,
  ExternalLink,
  Menu,
  X,
  FileSignature,
  DollarSign,
  MonitorPlay,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BrandLogo } from "@/components/layout/BrandLogo";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/contracts", label: "Contracts", icon: FileSignature },
  { href: "/admin/portfolio", label: "Portfolio", icon: Image },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/pricing", label: "Custom Pricing", icon: DollarSign },
  { href: "/admin/hero", label: "Homepage Hero", icon: MonitorPlay },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/client-albums", label: "Client Albums", icon: FolderOpen },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="border-b border-border-theme p-6">
        <BrandLogo size="sm" />
        <p className="mt-2 text-xs text-muted-subtle">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition",
                active
                  ? "bg-gold-500/15 text-gold-300"
                  : "text-muted hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border-theme p-4">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs uppercase tracking-[0.15em] text-muted-subtle">
            Theme
          </span>
          <ThemeToggle />
        </div>
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-foreground"
        >
          <ExternalLink size={18} />
          View Website
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-foreground"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border-theme bg-surface-elevated px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open admin menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex text-foreground"
          >
            <Menu size={22} />
          </button>
          <BrandLogo size="sm" />
        </div>
        <ThemeToggle />
      </div>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border-theme bg-surface-elevated lg:flex">
        <SidebarNav />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(18rem,85vw)] flex-col bg-surface-elevated shadow-xl">
            <button
              type="button"
              aria-label="Close admin menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 text-muted hover:text-foreground"
            >
              <X size={20} />
            </button>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
