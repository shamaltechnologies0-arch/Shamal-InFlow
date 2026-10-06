import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryEditForm } from "@/components/batteries/battery-edit-form";
import { getBattery, listAircraftOptions } from "@/lib/data";
import { formatHours } from "@/lib/utils";

type Props = PageProps<"/batteries/[id]">;

export default async function BatteryDetailPage({ params }: Props) {
  const { id } = await params;
  const [battery, aircraftOptions] = await Promise.all([getBattery(id), listAircraftOptions()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={battery.name}
        description={`${battery.model || "Battery"} · ${battery.serial}`}
        actions={
          <Link
            href="/batteries"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground hover:bg-border-subtle"
          >
            ← All batteries
          </Link>
        }
      />

      <Card className="border-brand-blue/30 bg-gradient-to-r from-surface to-surface-elevated">
        <CardContent className="flex flex-wrap items-center gap-6 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-brand-navy text-sm font-bold text-white">
            BAT
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground-muted">Flight hours</p>
            <p className="text-3xl font-semibold text-white">{formatHours(battery.hours)}</p>
            <StatusBadge status={battery.status} label={battery.status} className="mt-2" />
            <p className="mt-2 text-xs text-foreground-muted">
              Health {battery.health}% · {battery.cycles}/{battery.cycleLifespan} cycles · Aircraft{" "}
              {battery.aircraftLabel}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit battery</CardTitle>
        </CardHeader>
        <CardContent>
          <BatteryEditForm
            battery={{
              id: battery.id,
              name: battery.name,
              serial: battery.serial,
              model: battery.model,
              legalId: battery.legalId,
              owner: battery.owner,
              statusValue: battery.statusValue,
              health: battery.health,
              cycles: battery.cycles,
              cycleLifespan: battery.cycleLifespan,
              flights: battery.flights,
              flightLifespan: battery.flightLifespan,
              hours: battery.hours,
              shared: battery.shared,
              aircraftId: battery.aircraftId,
            }}
            aircraftOptions={aircraftOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
