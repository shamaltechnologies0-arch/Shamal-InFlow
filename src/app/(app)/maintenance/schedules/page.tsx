import { listMaintenance } from "@/lib/data";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function MaintenanceSchedulesPage() {
  const data = await listMaintenance();
  const rows = data.rows.filter((r) => r.status === "scheduled" || r.status === "overdue");

  return (
    <ModuleListPage
      title="Maintenance Schedules"
      description="Preventive / scheduled work and independent follow-ups (e.g. check screws after 20 flights)."
      emptyMessage="No scheduled maintenance."
      stats={[
        { label: "SCHEDULED", value: data.counts.scheduled },
        { label: "OVERDUE", value: data.counts.overdue },
      ]}
      columns={[
        { key: "title", header: "Work order", cell: (r) => r.title },
        { key: "due", header: "Due", cell: (r) => r.dueLabel },
        { key: "asset", header: "Asset", cell: (r) => r.assetLabel },
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
