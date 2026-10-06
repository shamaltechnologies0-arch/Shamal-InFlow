"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateBatteryAction, type BatteryUpdateState } from "@/app/actions/batteries";
import type { AircraftOption } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { AircraftField, fieldClass as sharedFieldClass } from "@/components/inventory/fields";

export type BatteryEditValues = {
  id: string;
  name: string;
  serial: string;
  model: string;
  legalId: string;
  owner: string;
  statusValue: string;
  health: number;
  cycles: number;
  cycleLifespan: number;
  flights: number;
  flightLifespan: number;
  hours: number;
  shared: boolean;
  aircraftId: string;
};

const initial: BatteryUpdateState = {};
const fieldClass = sharedFieldClass;

export function BatteryEditForm({
  battery,
  aircraftOptions,
}: {
  battery: BatteryEditValues;
  aircraftOptions: AircraftOption[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateBatteryAction, initial);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={battery.id} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-foreground-muted">Display name</span>
          <input name="name" defaultValue={battery.name} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Serial number *</span>
          <input name="serialNumber" required defaultValue={battery.serial} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Model</span>
          <input name="model" defaultValue={battery.model} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Legal / Asset ID</span>
          <input name="legalId" defaultValue={battery.legalId} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Owner</span>
          <input name="ownerLabel" defaultValue={battery.owner} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Status</span>
          <select name="status" defaultValue={battery.statusValue} className={fieldClass}>
            <option value="operational">Operational / Airworthy</option>
            <option value="maintenance">Maintenance</option>
            <option value="damaged">Damaged</option>
            <option value="retired">Retired</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Health %</span>
          <input name="healthScore" type="number" min="0" max="100" defaultValue={battery.health} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Flight hours</span>
          <input name="flightHours" type="number" step="0.1" min="0" defaultValue={battery.hours} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Flight count</span>
          <input name="flightCount" type="number" min="0" defaultValue={battery.flights} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Flight lifespan</span>
          <input name="flightLifespan" type="number" min="1" defaultValue={battery.flightLifespan} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Cycle count</span>
          <input name="cycleCount" type="number" min="0" defaultValue={battery.cycles} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Cycle lifespan</span>
          <input name="cycleLifespan" type="number" min="1" defaultValue={battery.cycleLifespan} className={fieldClass} />
        </label>
        <AircraftField options={aircraftOptions} defaultValue={battery.aircraftId} />
        <label className="flex items-center gap-2 text-sm text-white md:col-span-2">
          <input name="shared" type="checkbox" defaultChecked={battery.shared} className="accent-brand-blue" />
          Shared battery
        </label>
      </div>

      {state.error ? <p className="text-sm text-status-critical">{state.error}</p> : null}
      {state.ok ? <p className="text-sm text-status-operational">Saved to MongoDB.</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/batteries")}>
          Back to batteries
        </Button>
      </div>
    </form>
  );
}
