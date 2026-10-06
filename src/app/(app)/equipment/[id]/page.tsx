import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentForm } from "@/components/inventory/equipment-form";
import { getEquipment, listAircraftOptions } from "@/lib/data";
import { EQUIPMENT_TYPES, optionLabel } from "@/lib/inventory";

type Props = PageProps<"/equipment/[id]">;

export default async function EquipmentDetailPage({ params }: Props) {
  const { id } = await params;
  const [equipment, aircraftOptions] = await Promise.all([
    getEquipment(id),
    listAircraftOptions(),
  ]);
  if (!equipment) notFound();

  const drone = aircraftOptions.find((aircraft) => aircraft.id === equipment.aircraftId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={equipment.name}
        description={`${optionLabel(equipment.equipmentType, EQUIPMENT_TYPES)} · ${equipment.serial || "No serial"}`}
        actions={
          <Link
            href="/equipment"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium"
          >
            ← All equipment
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Assignment</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground-muted">
          <p>Person: {equipment.assignedUser || "—"}</p>
          <p className="mt-2">
            Drone:{" "}
            {drone ? (
              <Link href={`/fleet/${drone.id}`} className="text-link hover:underline">
                {drone.label}
              </Link>
            ) : (
              "Unassigned"
            )}
          </p>
          <p className="mt-2">{equipment.hours.toFixed(1)} flight hours</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Edit equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <EquipmentForm mode="edit" aircraftOptions={aircraftOptions} equipment={equipment} />
        </CardContent>
      </Card>
    </div>
  );
}
