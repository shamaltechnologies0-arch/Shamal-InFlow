import { listMissions } from "@/lib/data";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function MissionsPage() {
  const data = await listMissions();
  const statuses = Object.entries(data.statusCounts).map(([label, value]) => ({
    label: label.replace(/_/g, " ").toUpperCase(),
    value,
  }));

  return (
    <ModuleListPage
      title="Planned Missions"
      description="Draft → Submitted → Under Review → Approved → Assigned → In Progress → Completed → Closed"
      emptyMessage="No missions yet."
      stats={statuses.length ? statuses.slice(0, 6) : [{ label: "TOTAL", value: 0 }]}
      columns={[
        { key: "code", header: "Code", cell: (r) => r.code },
        { key: "name", header: "Name", cell: (r) => r.name },
        { key: "project", header: "Project", cell: (r) => r.project },
        { key: "scheduled", header: "Scheduled", cell: (r) => r.scheduled },
        {
          key: "risk",
          header: "Risk",
          cell: (r) => <StatusBadge status={r.riskLevel === "—" ? "info" : r.riskLevel} label={r.riskLevel} />,
        },
        {
          key: "status",
          header: "Workflow",
          cell: (r) => <StatusBadge status={r.status} label={r.status.replace(/_/g, " ")} />,
        },
      ]}
      rows={data.rows}
      getRowKey={(r) => r.id}
    />
  );
}
