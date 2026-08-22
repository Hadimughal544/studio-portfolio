"use client";

type BarItem = {
  label: string;
  value: number;
  color?: string;
};

type DonutItem = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  contractStatus: DonutItem[];
  portfolioCategories: BarItem[];
  monthlyContracts: BarItem[];
};

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "#eab308",
  CONFIRMED: "#22c55e",
  CANCELLED: "#ef4444",
};

export function DashboardCharts({
  contractStatus,
  portfolioCategories,
  monthlyContracts,
}: Props) {
  const totalContracts = contractStatus.reduce((sum, item) => sum + item.value, 0);
  const maxMonthly = Math.max(...monthlyContracts.map((m) => m.value), 1);
  const maxCategory = Math.max(...portfolioCategories.map((c) => c.value), 1);

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <ChartCard title="Contracts by Status">
        {totalContracts === 0 ? (
          <EmptyChart message="No contracts yet" />
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
            <DonutChart items={contractStatus} total={totalContracts} />
            <div className="space-y-2">
              {contractStatus.map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted">{formatLabel(item.label)}</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Contracts (Last 6 Months)">
        {monthlyContracts.every((m) => m.value === 0) ? (
          <EmptyChart message="No recent contracts" />
        ) : (
          <div className="flex h-48 items-end justify-between gap-2 px-2">
            {monthlyContracts.map((month) => (
              <div
                key={month.label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span className="text-xs font-medium text-gold-400">
                  {month.value > 0 ? month.value : ""}
                </span>
                <div className="flex w-full justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-sm bg-gold-500/80 transition-all"
                    style={{
                      height: `${Math.max((month.value / maxMonthly) * 140, month.value > 0 ? 8 : 2)}px`,
                    }}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-subtle">
                  {month.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </ChartCard>

      <ChartCard title="Portfolio by Category" className="lg:col-span-2">
        {portfolioCategories.length === 0 ? (
          <EmptyChart message="No portfolio items yet" />
        ) : (
          <div className="space-y-4">
            {portfolioCategories.map((cat) => (
              <div key={cat.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="capitalize text-muted">{cat.label}</span>
                  <span className="text-foreground">{cat.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gold-500/80"
                    style={{ width: `${(cat.value / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-sm border border-border-theme bg-surface-muted p-6 ${className}`}
    >
      <h2 className="mb-6 font-serif text-xl text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <p className="py-12 text-center text-sm text-muted-subtle">{message}</p>
  );
}

function DonutChart({ items, total }: { items: DonutItem[]; total: number }) {
  const size = 140;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      {items.map((item) => {
        const segment = (item.value / total) * circumference;
        const dashArray = `${segment} ${circumference - segment}`;
        const dashOffset = -offset;
        offset += segment;

        return (
          <circle
            key={item.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth={stroke}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
          />
        );
      })}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="24"
        fontWeight="600"
        transform={`rotate(90, ${size / 2}, ${size / 2})`}
      >
        {total}
      </text>
    </svg>
  );
}

function formatLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export { STATUS_COLORS };
