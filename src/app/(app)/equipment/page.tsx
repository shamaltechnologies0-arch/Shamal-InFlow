import Link from "next/link";
import { listEquipment } from "@/lib/data";
import { EQUIPMENT_TYPES, optionLabel } from "@/lib/inventory";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function EquipmentPage() {
  const rows = await listEquipment();
  return (
    <ModuleListPage
      title="Equipment"
      description="Cameras, gimbals, LiDAR, RTK, chargers, and controllers stored in MongoDB."
      emptyMessage="No equipment in MongoDB yet."
      actionHref="/equipment/new"
      actionLabel="Add equipment"
      stats={[
        { label: "TOTAL", value: rows.length },
        { label: "OPERATIONAL", value: rows.filter((r) => r.status === "operational").length },
      ]}
      columns={[
        {
          key: "name",
          header: "Name",
          cell: (r) => (
            <Link href={`/equipment/${r.id}`} className="text-link hover:underline">
              {r.name}
            </Link>
          ),
        },
        { key: "type", header: "Type", cell: (r) => optionLabel(r.equipmentType, EQUIPMENT_TYPES) },
        { key: "serial", header: "Serial", cell: (r) => r.serial },
        { key: "user", header: "Assigned", cell: (r) => r.assignedUser },
        { key: "aircraft", header: "Drone", cell: (r) => r.aircraft },
        { key: "hours", header: "Flight hrs", cell: (r) => r.hours.toFixed(1) },
        {
          key: "status",
          header: "Status",
          cell: (r) => <StatusBadge status={r.status} label={r.status} />,
        },
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  );
}
