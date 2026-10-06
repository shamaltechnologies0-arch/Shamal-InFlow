import Link from "next/link";
import { listComponents } from "@/lib/data";
import { optionLabel, COMPONENT_TYPES } from "@/lib/inventory";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function ComponentsPage() {
  const rows = await listComponents();
  return (
    <ModuleListPage
      title="Components"
      description="Motors, props, ESCs, arms, and flight controllers stored in MongoDB."
      emptyMessage="No components in MongoDB yet."
      actionHref="/components/new"
      actionLabel="Add component"
      stats={[
        { label: "TOTAL", value: rows.length },
        { label: "OPERATIONAL", value: rows.filter((r) => r.status === "operational").length },
        { label: "MAINTENANCE", value: rows.filter((r) => r.status === "maintenance").length },
      ]}
      columns={[
        {
          key: "name",
          header: "Name",
          cell: (r) => (
            <Link href={`/components/${r.id}`} className="text-link hover:underline">
              {r.name}
            </Link>
          ),
        },
        { key: "type", header: "Type", cell: (r) => optionLabel(r.componentType, COMPONENT_TYPES) },
        { key: "serial", header: "Serial", cell: (r) => r.serial },
        { key: "aircraft", header: "Aircraft", cell: (r) => r.aircraft },
        { key: "hours", header: "Hours", cell: (r) => r.hours.toFixed(1) },
        { key: "flights", header: "Flights", cell: (r) => r.flights },
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
