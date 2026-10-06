import { cn, formatNumber } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: number | string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  className?: string;
  format?: "number" | "raw";
};

export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  icon: Icon,
  className,
  format = "number",
}: KpiCardProps) {
  const display =
    typeof value === "number" && format === "number"
      ? formatNumber(value)
      : value;

  return (
    <div className={cn("kpi-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-foreground-muted">
          {label}
        </p>
        {Icon ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {display}
      </p>
      {delta ? (
        <p
          className={cn(
            "mt-1.5 text-xs",
            deltaTone === "up" && "text-status-operational",
            deltaTone === "down" && "text-status-critical",
            deltaTone === "neutral" && "text-foreground-muted",
          )}
        >
          {delta}
        </p>
      ) : null}
    </div>
  );
}
