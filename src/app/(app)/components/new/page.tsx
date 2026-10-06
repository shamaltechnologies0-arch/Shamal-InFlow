import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentForm } from "@/components/inventory/component-form";
import { listAircraftOptions } from "@/lib/data";

export default async function NewComponentPage() {
  const aircraftOptions = await listAircraftOptions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Component"
        description="Track a motor, prop, ESC, or other airframe part in MongoDB."
        actions={
          <Link
            href="/components"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium"
          >
            Cancel
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Component details</CardTitle>
        </CardHeader>
        <CardContent>
          <ComponentForm mode="create" aircraftOptions={aircraftOptions} />
        </CardContent>
      </Card>
    </div>
  );
}
