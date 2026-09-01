import type { Contract } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const INSTALLMENTS = [
  { key: "bookingFeePaid", label: "Advance" },
  { key: "eventDayPaid", label: "Second due" },
  { key: "albumDeliveryPaid", label: "Third due" },
] as const;

/** Three dots summarising which contract installments have been received. */
export function PaymentDots({ contract }: { contract: Contract }) {
  const paidCount = INSTALLMENTS.filter((i) => contract[i.key]).length;

  return (
    <span className="flex items-center gap-1.5" title={`${paidCount}/3 received`}>
      {INSTALLMENTS.map((i) => (
        <span
          key={i.key}
          title={`${i.label}: ${contract[i.key] ? "received" : "pending"}`}
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            contract[i.key] ? "bg-green-400" : "bg-white/15",
          )}
        />
      ))}
    </span>
  );
}
