"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({ className }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!mounted) {
    return <div className={cn("h-9 w-9", className)} aria-hidden />;
  }

  const active = OPTIONS.find((option) => option.value === theme) ?? OPTIONS[2];
  const ActiveIcon = active.icon;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Theme: ${active.label}. Change theme`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-theme text-foreground transition hover:border-gold-400/50 hover:text-gold-300"
      >
        <ActiveIcon size={16} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 top-full z-50 mt-2 min-w-[9.5rem] overflow-hidden rounded-sm border border-border-theme bg-surface-elevated py-1 shadow-lg"
        >
          {OPTIONS.map(({ value, label, icon: Icon }) => {
            const selected = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs uppercase tracking-[0.12em] transition",
                  selected
                    ? "bg-gold-500/15 text-gold-300"
                    : "text-muted hover:bg-surface-muted hover:text-foreground",
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
