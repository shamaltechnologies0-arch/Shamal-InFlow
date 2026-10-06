"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createComponentAction,
  updateComponentAction,
  type ComponentFormState,
} from "@/app/actions/components";
import { COMPONENT_STATUSES, COMPONENT_TYPES } from "@/lib/inventory";
import type { AircraftOption } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { AircraftField, fieldClass } from "@/components/inventory/fields";

export type ComponentFormValues = {
  id: string;
  name: string;
  componentType: string;
  manufacturer: string;
  model: string;
  serial: string;
  aircraftId: string;
  hours: number;
  flights: number;
  status: string;
};

const initial: ComponentFormState = {};

export function ComponentForm({
  mode,
  aircraftOptions,
  component,
}: {
  mode: "create" | "edit";
  aircraftOptions: AircraftOption[];
  component?: ComponentFormValues;
}) {
  const router = useRouter();
  const actionFn = mode === "create" ? createComponentAction : updateComponentAction;
  const [state, action, pending] = useActionState(actionFn, initial);

  useEffect(() => {
    if (!state.ok) return;
    if (mode === "create" && state.id) router.push(`/components/${state.id}`);
    if (mode === "edit") router.refresh();
  }, [mode, router, state.id, state.ok]);

  return (
    <form action={action} className="grid max-w-2xl gap-4 md:grid-cols-2">
      {component ? <input type="hidden" name="id" value={component.id} /> : null}
      <label className="block text-sm">
        <span className="text-foreground-muted">Name *</span>
        <input name="name" required defaultValue={component?.name} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Type *</span>
        <select
          name="componentType"
          defaultValue={component?.componentType || "motor"}
          className={fieldClass}
        >
          {COMPONENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Manufacturer</span>
        <input name="manufacturer" defaultValue={component?.manufacturer} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Model</span>
        <input name="model" defaultValue={component?.model} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Serial number</span>
        <input name="serialNumber" defaultValue={component?.serial} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Status</span>
        <select name="status" defaultValue={component?.status || "operational"} className={fieldClass}>
          {COMPONENT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Operating hours</span>
        <input
          name="operatingHours"
          type="number"
          min="0"
          step="0.1"
          defaultValue={component?.hours ?? 0}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Flights</span>
        <input
          name="flightCount"
          type="number"
          min="0"
          defaultValue={component?.flights ?? 0}
          className={fieldClass}
        />
      </label>
      <AircraftField options={aircraftOptions} defaultValue={component?.aircraftId} />
      {state.error ? <p className="text-sm text-status-critical md:col-span-2">{state.error}</p> : null}
      {state.ok && mode === "edit" ? (
        <p className="text-sm text-status-operational md:col-span-2">Saved to MongoDB.</p>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Create component" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
