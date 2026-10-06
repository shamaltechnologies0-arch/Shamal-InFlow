import { listRiskAssessments } from "@/lib/data";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function RiskAssessmentsPage() {
  const rows = await listRiskAssessments();
  return (
    <ModuleListPage
      title="Risk Assessments"
      description="Configurable digital risk forms attachable to missions and flights."
      emptyMessage="No risk assessments yet."
      stats={[
        { label: "TOTAL", value: rows.length },
        { label: "APPROVED", value: rows.filter((r) => r.status === "approved").length },
        { label: "HIGH/CRIT", value: rows.filter((r) => r.riskLevel === "high" || r.riskLevel === "critical").length },
      ]}
      columns={[
        { key: "title", header: "Assessment", cell: (r) => r.title },
        { key: "mission", header: "Mission", cell: (r) => r.mission },
        {
          key: "risk",
          header: "Risk",
          cell: (r) => <StatusBadge status={r.riskLevel} label={r.riskLevel} />,
        },
        {
          key: "status",
          header: "Status",
          cell: (r) => <StatusBadge status={r.status} label={r.status} />,
        },
        { key: "owner", header: "Responsible", cell: (r) => r.responsible },
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  );
}
