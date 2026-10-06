"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateAircraftAction, type AircraftUpdateState } from "@/app/actions/aircraft";
import { Button } from "@/components/ui/button";

export type AircraftEditValues = {
  id: string;
  name: string;
  tail: string;
  model: string;
  manufacturer: string;
  legalId: string;
  serial: string;
  statusValue: string;
  hours: number;
  flightCount: number;
};

const initial: AircraftUpdateState = {};

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand-blue/40";

export function AircraftEditForm({ aircraft }: { aircraft: AircraftEditValues }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateAircraftAction, initial);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={aircraft.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-foreground-muted">Display name</span>
          <input name="name" defaultValue={aircraft.name} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Registration *</span>
          <input name="registration" required defaultValue={aircraft.tail} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Model *</span>
          <input name="model" required defaultValue={aircraft.model} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Manufacturer</span>
          <input name="manufacturer" defaultValue={aircraft.manufacturer} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Legal ID</span>
          <input name="legalId" defaultValue={aircraft.legalId} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Serial number</span>
          <input name="serialNumber" defaultValue={aircraft.serial} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Status</span>
          <select name="status" defaultValue={aircraft.statusValue} className={fieldClass}>
            <option value="operational">Operational / Airworthy</option>
            <option value="inspection_due">Inspection Due</option>
            <option value="maintenance_due">Maintenance Due</option>
            <option value="grounded">Grounded</option>
            <option value="retired">Retired</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Flight hours</span>
          <input
            name="flightHours"
            type="number"
            step="0.1"
            min="0"
            defaultValue={aircraft.hours}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Flight count</span>
          <input
            name="flightCount"
            type="number"
            min="0"
            defaultValue={aircraft.flightCount}
            className={fieldClass}
          />
        </label>
      </div>

      {state.error ? (
        <p className="text-sm text-status-critical" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-sm text-status-operational" role="status">
          Saved to MongoDB.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/fleet")}>
          Back to drones
        </Button>
      </div>
    </form>
  );
}
