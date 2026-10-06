import { listMissions } from "@/lib/data";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function MissionApprovalsPage() {
  const data = await listMissions();
  const rows = data.rows.filter((r) =>
    ["submitted", "under_review", "approved"].includes(r.status),
  );

  return (
    <ModuleListPage
      title="Mission Approvals"
      description="Review queue and under-review missions before assignment."
      emptyMessage="No missions awaiting approval."
      stats={[{ label: "IN QUEUE", value: rows.length }]}
      columns={[
        { key: "code", header: "Code", cell: (r) => r.code },
        { key: "name", header: "Name", cell: (r) => r.name },
        { key: "project", header: "Project", cell: (r) => r.project },
        {
          key: "status",
          header: "Status",
          cell: (r) => <StatusBadge status={r.status} label={r.status.replace(/_/g, " ")} />,
        },
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  );
}
