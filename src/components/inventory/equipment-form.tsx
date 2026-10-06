"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createEquipmentAction,
  updateEquipmentAction,
  type EquipmentFormState,
} from "@/app/actions/equipment";
import { EQUIPMENT_STATUSES, EQUIPMENT_TYPES } from "@/lib/inventory";
import type { AircraftOption } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { AircraftField, fieldClass } from "@/components/inventory/fields";

export type EquipmentFormValues = {
  id: string;
  name: string;
  equipmentType: string;
  manufacturer: string;
  model: string;
  serial: string;
  assignedUser: string;
  aircraftId: string;
  hours: number;
  status: string;
};

const initial: EquipmentFormState = {};

export function EquipmentForm({
  mode,
  aircraftOptions,
  equipment,
}: {
  mode: "create" | "edit";
  aircraftOptions: AircraftOption[];
  equipment?: EquipmentFormValues;
}) {
  const router = useRouter();
  const actionFn = mode === "create" ? createEquipmentAction : updateEquipmentAction;
  const [state, action, pending] = useActionState(actionFn, initial);

  useEffect(() => {
    if (!state.ok) return;
    if (mode === "create" && state.id) router.push(`/equipment/${state.id}`);
    if (mode === "edit") router.refresh();
  }, [mode, router, state.id, state.ok]);

  return (
    <form action={action} className="grid max-w-2xl gap-4 md:grid-cols-2">
      {equipment ? <input type="hidden" name="id" value={equipment.id} /> : null}
      <label className="block text-sm">
        <span className="text-foreground-muted">Name *</span>
        <input name="name" required defaultValue={equipment?.name} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Type *</span>
        <select
          name="equipmentType"
          defaultValue={equipment?.equipmentType || "camera"}
          className={fieldClass}
        >
          {EQUIPMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Manufacturer</span>
        <input name="manufacturer" defaultValue={equipment?.manufacturer} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Model</span>
        <input name="model" defaultValue={equipment?.model} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Serial number</span>
        <input name="serialNumber" defaultValue={equipment?.serial} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Assigned person</span>
        <input name="assignedUser" defaultValue={equipment?.assignedUser} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Status</span>
        <select name="status" defaultValue={equipment?.status || "operational"} className={fieldClass}>
          {EQUIPMENT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Flight hours</span>
        <input
          name="flightHours"
          type="number"
          min="0"
          step="0.1"
          defaultValue={equipment?.hours ?? 0}
          className={fieldClass}
        />
      </label>
      <AircraftField options={aircraftOptions} defaultValue={equipment?.aircraftId} />
      {state.error ? <p className="text-sm text-status-critical md:col-span-2">{state.error}</p> : null}
      {state.ok && mode === "edit" ? (
        <p className="text-sm text-status-operational md:col-span-2">Saved to MongoDB.</p>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Create equipment" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
