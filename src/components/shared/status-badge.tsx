import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMap = {
  operational: "operational",
  active: "operational",
  completed: "operational",
  connected: "operational",
  warning: "warning",
  pending: "warning",
  scheduled: "info",
  critical: "critical",
  failed: "critical",
  open: "critical",
  info: "info",
  inactive: "muted",
  archived: "muted",
  disconnected: "muted",
} as const;

type StatusKey = keyof typeof statusMap;

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const key = status.toLowerCase().replace(/\s+/g, "_") as StatusKey;
  const variant =
    statusMap[key] ??
    (status.toLowerCase().includes("over")
      ? "critical"
      : status.toLowerCase().includes("maint")
        ? "warning"
        : "muted");

  return (
    <Badge
      variant={variant as "operational" | "warning" | "critical" | "muted" | "info"}
      className={cn("capitalize", className)}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          variant === "operational" && "bg-status-operational",
          variant === "warning" && "bg-status-warning",
          variant === "critical" && "bg-status-critical",
          variant === "info" && "bg-status-info",
          variant === "muted" && "bg-foreground-muted",
        )}
        aria-hidden
      />
      {label ?? status.replace(/_/g, " ")}
    </Badge>
  );
}
