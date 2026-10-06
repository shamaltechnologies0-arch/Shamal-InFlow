import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentForm } from "@/components/inventory/equipment-form";
import { listAircraftOptions } from "@/lib/data";

export default async function NewEquipmentPage() {
  const aircraftOptions = await listAircraftOptions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Equipment"
        description="Register a camera, controller, RTK, or other field asset in MongoDB."
        actions={
          <Link
            href="/equipment"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium"
          >
            Cancel
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Equipment details</CardTitle>
        </CardHeader>
        <CardContent>
          <EquipmentForm mode="create" aircraftOptions={aircraftOptions} />
        </CardContent>
      </Card>
    </div>
  );
}
