import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentForm } from "@/components/inventory/component-form";
import { getComponent, listAircraftOptions } from "@/lib/data";
import { COMPONENT_TYPES, optionLabel } from "@/lib/inventory";

type Props = PageProps<"/components/[id]">;

export default async function ComponentDetailPage({ params }: Props) {
  const { id } = await params;
  const [component, aircraftOptions] = await Promise.all([
    getComponent(id),
    listAircraftOptions(),
  ]);
  if (!component) notFound();

  const drone = aircraftOptions.find((aircraft) => aircraft.id === component.aircraftId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={component.name}
        description={`${optionLabel(component.componentType, COMPONENT_TYPES)} · ${component.serial || "No serial"}`}
        actions={
          <Link
            href="/components"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium"
          >
            ← All components
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Assigned drone</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground-muted">
          {drone ? (
            <Link href={`/fleet/${drone.id}`} className="text-link hover:underline">
              {drone.label}
            </Link>
          ) : (
            "Unassigned"
          )}
          <p className="mt-2">
            {component.hours.toFixed(1)} operating hours · {component.flights} flights
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Edit component</CardTitle>
        </CardHeader>
        <CardContent>
          <ComponentForm mode="edit" aircraftOptions={aircraftOptions} component={component} />
        </CardContent>
      </Card>
    </div>
  );
}
