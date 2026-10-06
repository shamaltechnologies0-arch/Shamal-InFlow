import { listInspections } from "@/lib/data";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function InspectionsPage() {
  const data = await listInspections();
  return (
    <ModuleListPage
      title="Inspections"
      description="Schedules triggered by flights, hours, or calendar — aircraft, components, equipment, batteries."
      emptyMessage="No inspections scheduled."
      stats={[
        { label: "OVERDUE", value: data.counts.overdue },
        { label: "DUE", value: data.counts.due },
        { label: "SCHEDULED", value: data.counts.scheduled },
        { label: "PASSED", value: data.counts.passed },
        { label: "FAILED", value: data.counts.failed },
      ]}
      columns={[
        { key: "title", header: "Inspection", cell: (r) => r.title },
        { key: "assetType", header: "Asset type", cell: (r) => r.assetType },
        { key: "assetId", header: "Asset", cell: (r) => r.assetId },
        { key: "due", header: "Due", cell: (r) => r.dueDate },
        {
          key: "status",
          header: "Status",
          cell: (r) => <StatusBadge status={r.status} label={r.status} />,
        },
      ]}
      rows={data.rows}
      getRowKey={(r) => r.id}
    />
  );
}
