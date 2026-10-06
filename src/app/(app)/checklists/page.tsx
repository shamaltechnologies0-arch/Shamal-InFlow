import { listChecklists } from "@/lib/data";
import { ModuleListPage } from "@/components/shared/module-list-page";

export default async function ChecklistsPage() {
  const rows = await listChecklists();
  return (
    <ModuleListPage
      title="Digital Checklists"
      description="Pre-flight, post-flight, mission prep, inspections, emergency, and site operations checklists."
      emptyMessage="No checklists configured. Create templates in Payload Admin."
      stats={[{ label: "TEMPLATES", value: rows.length }]}
      columns={[
        { key: "name", header: "Name", cell: (r) => r.name },
        { key: "type", header: "Type", cell: (r) => r.checklistType },
        { key: "items", header: "Items", cell: (r) => r.itemCount },
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  );
}
