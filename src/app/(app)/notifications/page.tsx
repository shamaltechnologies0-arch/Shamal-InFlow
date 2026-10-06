import { listNotifications } from "@/lib/data";
import { ModuleListPage, StatusBadge } from "@/components/shared/module-list-page";

export default async function NotificationsPage() {
  const rows = await listNotifications();
  return (
    <ModuleListPage
      title="Notifications"
      description="In-app alerts for inspections, maintenance, batteries, documents, compliance, and incidents."
      emptyMessage="No notifications. Alerts are created by automation (e.g. battery cycle thresholds)."
      stats={[
        { label: "TOTAL", value: rows.length },
        { label: "UNREAD", value: rows.filter((r) => !r.read).length },
        { label: "CRITICAL", value: rows.filter((r) => r.severity === "critical").length },
      ]}
      columns={[
        { key: "title", header: "Alert", cell: (r) => r.title },
        { key: "type", header: "Type", cell: (r) => r.type },
        {
          key: "severity",
          header: "Severity",
          cell: (r) => <StatusBadge status={r.severity} label={r.severity} />,
        },
        { key: "read", header: "Read", cell: (r) => (r.read ? "Yes" : "No") },
        { key: "when", header: "When", cell: (r) => r.createdAt },
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  );
}
