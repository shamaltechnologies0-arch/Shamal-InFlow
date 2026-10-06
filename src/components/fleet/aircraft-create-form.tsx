"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAircraftAction, type AircraftUpdateState } from "@/app/actions/aircraft";
import { AIRCRAFT_STATUSES } from "@/lib/inventory";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/inventory/fields";

const initial: AircraftUpdateState = {};

export function AircraftCreateForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(createAircraftAction, initial);

  useEffect(() => {
    if (state.ok && state.id) router.push(`/fleet/${state.id}`);
  }, [state.ok, state.id, router]);

  return (
    <form action={action} className="grid max-w-2xl gap-4 md:grid-cols-2">
      <label className="block text-sm">
        <span className="text-foreground-muted">Display name</span>
        <input name="name" className={fieldClass} placeholder="ALPHA" />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Registration *</span>
        <input name="registration" required className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Model *</span>
        <input name="model" required className={fieldClass} placeholder="Matrice 350 RTK" />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Manufacturer</span>
        <input name="manufacturer" className={fieldClass} placeholder="DJI" />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Legal ID</span>
        <input name="legalId" className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Serial number</span>
        <input name="serialNumber" className={fieldClass} />
      </label>
      <label className="block text-sm md:col-span-2">
        <span className="text-foreground-muted">Status</span>
        <select name="status" defaultValue="operational" className={fieldClass}>
          {AIRCRAFT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
      {state.error ? <p className="text-sm text-status-critical md:col-span-2">{state.error}</p> : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create drone"}
        </Button>
      </div>
    </form>
  );
}
