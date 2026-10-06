import { listOperators } from "@/lib/data";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function OperatorsPage() {
  const rows = await listOperators();
  return (
    <ModuleListPage
      title="Pilots & Operators"
      description="Profiles, currency, flight hours, certifications, and operational history."
      emptyMessage="No operators in MongoDB."
      stats={[
        { label: "TOTAL", value: rows.length },
        { label: "ACTIVE", value: rows.filter((r) => r.status === "active").length },
        { label: "CURRENT", value: rows.filter((r) => r.currency === "current").length },
      ]}
      columns={[
        { key: "name", header: "Name", cell: (r) => r.name },
        { key: "id", header: "Employee ID", cell: (r) => r.employeeId || "—" },
        { key: "role", header: "Role", cell: (r) => r.role },
        { key: "hours", header: "Flight hrs", cell: (r) => r.hours.toFixed(1) },
        {
          key: "currency",
          header: "Currency",
          cell: (r) => <StatusBadge status={r.currency === "current" ? "operational" : "warning"} label={r.currency} />,
        },
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
