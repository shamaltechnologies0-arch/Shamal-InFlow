import { PageHeader } from "@/components/shared/page-header";

export default function UserGuidePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Guide"
        description="How to use Shamal Inventory — deferred until core development phases are complete."
      />
      <div className="rounded border border-border bg-surface p-6 text-sm text-foreground-muted">
        <p>
          This guide will document flight import, inventory management, maintenance workflows,
          compliance reporting, and operator procedures.
        </p>
        <p className="mt-3 text-white">Status: planned for final documentation phase.</p>
      </div>
    </div>
  );
}
