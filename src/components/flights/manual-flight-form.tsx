"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createManualFlightAction,
  type FlightActionState,
} from "@/app/actions/flights";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

const initial: FlightActionState = {};
const field =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand-blue/40";

type Option = { id: string; label: string };

export function ManualFlightForm({
  options,
}: {
  options: {
    pilots: Option[];
    aircraft: Option[];
    batteries: Option[];
    projects: Option[];
    missions: Option[];
  };
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createManualFlightAction, initial);

  useEffect(() => {
    if (state.ok && state.flightId) router.push(`/flights/${state.flightId}`);
  }, [state.ok, state.flightId, router]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manual Flight Log"
        description="Create a flight record and run the PRD §37 completion automation (pilot / drone / battery hours)."
        actions={
          <Link href="/flights" className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium">
            Cancel
          </Link>
        }
      />
      <form action={action} className="grid max-w-3xl gap-4 rounded border border-border bg-surface p-5 md:grid-cols-2">
        <label className="block text-sm md:col-span-2">
          <span className="text-foreground-muted">Flight ID</span>
          <input name="flightId" className={field} placeholder="Auto-generated if blank" />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Start time *</span>
          <input name="startTime" type="datetime-local" required className={field} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">End time</span>
          <input name="endTime" type="datetime-local" className={field} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Duration (minutes)</span>
          <input name="durationMinutes" type="number" min={0} className={field} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Location</span>
          <input name="locationLabel" className={field} placeholder="Site / airspace label" />
        </label>
        <SelectField name="pilot" label="Pilot" options={options.pilots} />
        <SelectField name="aircraft" label="Drone" options={options.aircraft} />
        <SelectField name="battery" label="Battery" options={options.batteries} />
        <SelectField name="project" label="Project" options={options.projects} />
        <SelectField name="mission" label="Mission" options={options.missions} />
        {state.error ? <p className="md:col-span-2 text-sm text-status-critical">{state.error}</p> : null}
        {state.ok ? (
          <p className="md:col-span-2 text-sm text-status-operational">
            Flight saved. Automation updated: {(state.summary?.updates || []).join(", ") || "none"}
          </p>
        ) : null}
        <div className="md:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save & complete flight"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: Option[];
}) {
  return (
    <label className="block text-sm">
      <span className="text-foreground-muted">{label}</span>
      <select name={name} className={field} defaultValue="">
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
