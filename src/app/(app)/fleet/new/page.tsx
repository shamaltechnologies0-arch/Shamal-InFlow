import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { DroneForm } from "@/components/fleet/drone-form";

export default function NewAircraftPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Drone"
        description="Enter overview, geometry, extra information, and connect details. Save writes the full record to MongoDB."
        actions={
          <Link
            href="/fleet"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium"
          >
            Cancel
          </Link>
        }
      />
      <Card>
        <CardContent className="pt-5">
          <DroneForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
