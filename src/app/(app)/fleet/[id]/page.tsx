import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DroneForm } from "@/components/fleet/drone-form";
import { getAircraft, listBatteries, listComponents, listEquipment } from "@/lib/data";
import { formatHours } from "@/lib/utils";

type Props = PageProps<"/fleet/[id]">;

export default async function AircraftDetailPage({ params }: Props) {
  const { id } = await params;
  const [ac, components, equipment, batteries] = await Promise.all([
    getAircraft(id),
    listComponents(),
    listEquipment(),
    listBatteries(),
  ]);
  const installedComponents = components.filter((item) => item.aircraftId === id);
  const installedEquipment = equipment.filter((item) => item.aircraftId === id);
  const installedBatteries = batteries.filter((item) => item.aircraftId === id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={ac.name}
        description={`${ac.modelLabel || ac.model} · ${ac.legalId}`}
        actions={
          <Link
            href="/fleet"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground hover:bg-border-subtle"
          >
            ← All drones
          </Link>
        }
      />

      <Card className="border-brand-blue/30 bg-gradient-to-r from-surface to-surface-elevated">
        <CardContent className="flex flex-wrap items-center gap-6 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-brand-navy text-lg font-bold text-white">
            UAV
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground-muted">Total airframe time</p>
            <p className="text-3xl font-semibold text-white">{formatHours(ac.hours)}</p>
            <StatusBadge status={ac.status} label={ac.status} className="mt-2" />
            <p className="mt-2 text-xs text-foreground-muted">S/N {ac.serial || "—"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <InstalledList
          title="Components"
          href="/components/new"
          empty="No components assigned to this drone."
          rows={installedComponents.map((item) => ({
            id: item.id,
            href: `/components/${item.id}`,
            label: item.name,
            meta: item.status,
          }))}
        />
        <InstalledList
          title="Equipment"
          href="/equipment/new"
          empty="No equipment assigned to this drone."
          rows={installedEquipment.map((item) => ({
            id: item.id,
            href: `/equipment/${item.id}`,
            label: item.name,
            meta: item.status,
          }))}
        />
        <InstalledList
          title="Batteries"
          href="/batteries/new"
          empty="No batteries assigned to this drone."
          rows={installedBatteries.map((item) => ({
            id: item.id,
            href: `/batteries/${item.id}`,
            label: item.name,
            meta: item.serial,
          }))}
        />
      </div>

      <Card>
        <CardContent className="pt-5">
          <DroneForm
            mode="edit"
            drone={{
              id: ac.id,
              name: ac.name,
              tail: ac.tail,
              model: ac.model,
              manufacturer: ac.manufacturer,
              legalId: ac.legalId,
              serial: ac.serial,
              statusValue: ac.statusValue,
              hours: ac.hours,
              flightCount: ac.flightCount,
              internalSerial: ac.internalSerial,
              flightControllerSerial: ac.flightControllerSerial,
              remoteControllerSerial: ac.remoteControllerSerial,
              remoteController2Serial: ac.remoteController2Serial,
              softwareInformation: ac.softwareInformation,
              aircraftType: ac.aircraftType,
              geometry: ac.geometry,
              inventoryAssetNumber: ac.inventoryAssetNumber,
              description: ac.description,
              tags: ac.tags,
              location: ac.location,
              ownerLabel: ac.ownerLabel,
              complianceCategory: ac.complianceCategory,
              firmwareVersion: ac.firmwareVersion,
              hardwareVersion: ac.hardwareVersion,
              propulsionType: ac.propulsionType,
              weightKg: ac.weightKg,
              maxGrossTakeoffKg: ac.maxGrossTakeoffKg,
              maxPayloadKg: ac.maxPayloadKg,
              color: ac.color,
              maxSpeedMs: ac.maxSpeedMs,
              maxVerticalSpeedMs: ac.maxVerticalSpeedMs,
              maxFlightTimeSeconds: ac.maxFlightTimeSeconds,
              outOfSightDistance: ac.outOfSightDistance,
              purchaseDate: ac.purchaseDate,
              insurableValue: ac.insurableValue,
              loanerDrone: ac.loanerDrone,
              excludedFromLegalReport: ac.excludedFromLegalReport,
              remoteId: ac.remoteId,
              connectivitySlot1: ac.connectivitySlot1,
              connectivitySlot1Extra: ac.connectivitySlot1Extra,
              connectivitySlot2: ac.connectivitySlot2,
              connectivitySlot2Extra: ac.connectivitySlot2Extra,
              videoSourceUrl: ac.videoSourceUrl,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function InstalledList({
  title,
  href,
  empty,
  rows,
}: {
  title: string;
  href: string;
  empty: string;
  rows: Array<{ id: string; href: string; label: string; meta: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <Link href={href} className="text-xs text-link hover:underline">
          Add
        </Link>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-foreground-muted">{empty}</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3">
                <Link href={row.href} className="text-link hover:underline">
                  {row.label}
                </Link>
                <span className="text-xs text-foreground-muted">{row.meta}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
