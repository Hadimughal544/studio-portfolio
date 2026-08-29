"use client";

import { useEffect, useId, useState } from "react";
import { MAX_EVENT_DAYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (count: number) => void;
  max?: number;
};

function clampDayCount(value: number, max: number) {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(max, Math.max(1, Math.round(value)));
}

export function DayCountSelector({
  value,
  onChange,
  max = MAX_EVENT_DAYS,
}: Props) {
  const inputId = useId();
  const [draft, setDraft] = useState(String(value));
  const quickOptions = [1, 2, 3, 4].filter((count) => count <= max);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function applyCount(count: number) {
    const next = clampDayCount(count, max);
    onChange(next);
    setDraft(String(next));
  }

  function commitDraft() {
    applyCount(Number(draft));
  }

  return (
    <div className="space-y-3">
      <label className="form-label" htmlFor={inputId}>
        How many event days?
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {quickOptions.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => applyCount(count)}
              className={cn(
                "rounded-sm border px-4 py-2 text-sm transition",
                value === count
                  ? "border-gold-400 bg-gold-400/10 text-gold-300"
                  : "border-border-theme text-muted hover:border-gold-400/50",
              )}
            >
              {count} {count === 1 ? "Day" : "Days"}
            </button>
          ))}
        </div>
        <input
          id={inputId}
          type="number"
          min={1}
          max={max}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitDraft();
            }
          }}
          className="form-input w-20"
          aria-label="Number of event days"
        />
      </div>
      <p className="text-xs text-muted-subtle">
        Quick pick 1–4 or enter up to {max} days
      </p>
    </div>
  );
}
