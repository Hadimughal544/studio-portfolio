import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Client", "Coverage", "Event Days", "Review", "Sign"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === current;
        const done = stepNumber < current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs transition",
                  done && "border-gold-500 bg-gold-500 text-black",
                  active && "border-gold-400 text-gold-300",
                  !active && !done && "border-border-theme text-muted-subtle",
                )}
              >
                {done ? <Check size={14} /> : stepNumber}
              </span>
              <span
                className={cn(
                  "hidden text-[10px] uppercase tracking-[0.1em] sm:block",
                  active ? "text-gold-300" : "text-muted-subtle",
                )}
              >
                {label}
              </span>
            </div>
            {stepNumber < STEPS.length && (
              <span
                className={cn(
                  "h-px w-6 sm:w-10",
                  done ? "bg-gold-500" : "bg-border-theme",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
