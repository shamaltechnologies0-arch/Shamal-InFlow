import {
  Cloud,
  Database,
  Plane,
  Radio,
  Settings2,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adapters: {
  name: string;
  vendor: string;
  status: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  {
    name: "DJI Sync",
    vendor: "DJI Fly / GO / Pilot",
    status: "connected",
    detail: "Cloud sync for flight logs. First time: login with DJI account in DJI Cloud Sync.",
    icon: Plane,
  },
  {
    name: "Dronetag Sync",
    vendor: "Dronetag",
    status: "inactive",
    detail: "Create an API key in Dronetag Cloud Portal Settings, then paste it here.",
    icon: Radio,
  },
  {
    name: "Skydio Sync",
    vendor: "Skydio",
    status: "inactive",
    detail: "Create an API token in Skydio Cloud Portal Settings, then paste it here.",
    icon: Cloud,
  },
  {
    name: "Airdata",
    vendor: "Airdata UAV",
    status: "inactive",
    detail: "CSV / API bridge for historical flight import.",
    icon: Database,
  },
  {
    name: "S3 Archive",
    vendor: "AWS",
    status: "connected",
    detail: "Telemetry, media, and PDF report storage.",
    icon: Database,
  },
  {
    name: "GACA NOTAM Feed",
    vendor: "External",
    status: "warning",
    detail: "Operational awareness feed (foundation).",
    icon: ShieldAlert,
  },
];

export default function IntegrationsPage() {
  const connected = adapters.filter((a) => a.status === "connected").length;
  const warnings = adapters.filter((a) => a.status === "warning").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Integration Hub"
        description="Connect cloud sync adapters for telemetry import, media archive, and operational awareness."
        actions={
          <div className="flex items-center gap-3 text-xs text-foreground-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-status-operational" />
              {connected} connected
            </span>
            {warnings > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-status-warning" />
                {warnings} attention
              </span>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adapters.map((a, i) => {
          const Icon = a.icon;
          const isLive = a.status === "connected";
          return (
            <Card
              key={a.name}
              className={cn(
                "group relative overflow-hidden hover:translate-y-[-2px]",
                "animate-fade-up",
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-px",
                  isLive && "bg-gradient-to-r from-transparent via-accent/60 to-transparent",
                  a.status === "warning" &&
                    "bg-gradient-to-r from-transparent via-status-warning/50 to-transparent",
                )}
              />
              <CardContent className="flex h-full flex-col gap-4 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                        isLive
                          ? "border-accent/30 bg-accent/10 text-accent"
                          : a.status === "warning"
                            ? "border-status-warning/30 bg-status-warning/10 text-status-warning"
                            : "border-border bg-white/[0.03] text-foreground-muted group-hover:border-accent/20 group-hover:text-accent",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                        {a.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-foreground-muted">{a.vendor}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} label={a.status} />
                </div>

                <p className="flex-1 text-sm leading-relaxed text-foreground-muted">
                  {a.detail}
                </p>

                <Button
                  variant={isLive ? "secondary" : "default"}
                  size="sm"
                  className="w-full"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Configure
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
