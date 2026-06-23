"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-lg tracking-[0.35em] text-white transition group-hover:text-gold-300 sm:text-xl">
            WBA
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/60">
            Wedding by Ayaan Qadeer
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-xs uppercase tracking-[0.2em] transition-colors",
                  active ? "text-gold-300" : "text-white/80 hover:text-white",
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 h-px w-full bg-gold-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/booking"
          className="hidden rounded-full border border-gold-400/60 px-5 py-2 text-xs uppercase tracking-[0.2em] text-gold-200 transition hover:bg-gold-400/10 lg:inline-flex"
        >
          Book Now
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex text-white lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-black/95 lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm uppercase tracking-[0.15em]",
                    pathname === link.href
                      ? "bg-gold-400/10 text-gold-300"
                      : "text-white/80",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-gold-500 px-4 py-3 text-center text-sm uppercase tracking-[0.15em] text-black"
              >
                Book Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
