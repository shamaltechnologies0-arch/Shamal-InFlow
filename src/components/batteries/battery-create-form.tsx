"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBatteryAction, type BatteryUpdateState } from "@/app/actions/batteries";
import type { AircraftOption } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { AircraftField, fieldClass } from "@/components/inventory/fields";

const initial: BatteryUpdateState = {};

export function BatteryCreateForm({ aircraftOptions }: { aircraftOptions: AircraftOption[] }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createBatteryAction, initial);

  useEffect(() => {
    if (state.ok && state.id) router.push(`/batteries/${state.id}`);
  }, [state.ok, state.id, router]);

  return (
    <form action={action} className="grid max-w-2xl gap-4 md:grid-cols-2">
      <label className="block text-sm">
        <span className="text-foreground-muted">Display name</span>
        <input name="name" className={fieldClass} placeholder="Pack name / ID" />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Serial number *</span>
        <input name="serialNumber" required className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Model</span>
        <input name="model" defaultValue="TB60" className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Legal / Asset ID</span>
        <input name="legalId" className={fieldClass} />
      </label>
      <label className="block text-sm md:col-span-2">
        <span className="text-foreground-muted">Owner</span>
        <input name="ownerLabel" defaultValue="Shamal Technologies" className={fieldClass} />
      </label>
      <AircraftField options={aircraftOptions} />
      {state.error ? <p className="text-sm text-status-critical md:col-span-2">{state.error}</p> : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create battery"}
        </Button>
      </div>
    </form>
  );
}
