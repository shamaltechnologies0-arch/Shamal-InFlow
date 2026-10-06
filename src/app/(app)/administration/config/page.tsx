import { PageHeader } from "@/components/shared/page-header";

const configGroups = [
  {
    title: "Asset types",
    items: ["Drone types", "Component types", "Equipment types", "Battery models", "Statuses"],
  },
  {
    title: "Operations",
    items: ["Mission types", "Operation types", "Approval types", "Incident types", "Custom fields"],
  },
  {
    title: "Safety & quality",
    items: ["Inspection types", "Maintenance types", "Checklist templates", "Risk assessment forms"],
  },
  {
    title: "People & docs",
    items: ["Skills & capabilities", "Document types", "Notification thresholds", "Roles"],
  },
];

export default function AdminConfigPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration Engine"
        description="PRD §34 — avoid hard-coded operational rules. Configure types, workflows, thresholds, and custom fields."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {configGroups.map((g) => (
          <section key={g.title} className="rounded border border-border bg-surface p-4">
            <h2 className="text-sm font-semibold text-white">{g.title}</h2>
            <ul className="mt-3 space-y-2">
              {g.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between rounded border border-border/60 px-3 py-2 text-sm"
                >
                  <span className="text-white">{item}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-blue">
                    Editable in Admin
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="text-sm text-foreground-muted">
        Deep configuration is available in{" "}
        <a href="/admin" className="text-link hover:underline">
          Payload Admin
        </a>
        . Notification thresholds and custom field schemas will expand here without rebuilding the core.
      </p>
    </div>
  );
}
