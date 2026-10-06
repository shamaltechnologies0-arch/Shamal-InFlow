import { listAuditEvents } from "@/lib/data";
import { ModuleListPage } from "@/components/shared/module-list-page";

export default async function AuditTrailPage() {
  let rows: Awaited<ReturnType<typeof listAuditEvents>> = [];
  try {
    rows = await listAuditEvents();
  } catch {
    rows = [];
  }

  return (
    <ModuleListPage
      title="Audit Trail"
      description="Flight create/edit/import, asset changes, inspections, maintenance, documents, missions, incidents, users."
      emptyMessage="No audit events yet. Completing a flight writes an audit record."
      stats={[{ label: "EVENTS", value: rows.length }]}
      columns={[
        { key: "when", header: "When", cell: (r) => r.createdAt },
        { key: "action", header: "Action", cell: (r) => r.action },
        { key: "actor", header: "Actor", cell: (r) => r.actor },
        { key: "entity", header: "Entity", cell: (r) => `${r.entityType} ${r.entityId}`.trim() },
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  );
}
