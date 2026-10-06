import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryCreateForm } from "@/components/batteries/battery-create-form";
import { listAircraftOptions } from "@/lib/data";

export default async function NewBatteryPage() {
  const aircraftOptions = await listAircraftOptions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Battery"
        description="Create a new battery asset in MongoDB."
        actions={
          <Link
            href="/batteries"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium"
          >
            Cancel
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Battery details</CardTitle>
        </CardHeader>
        <CardContent>
          <BatteryCreateForm aircraftOptions={aircraftOptions} />
        </CardContent>
      </Card>
    </div>
  );
}
