"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  importFlightStubAction,
  type FlightActionState,
} from "@/app/actions/flights";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

const initial: FlightActionState = {};
const field =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand-blue/40";

type Option = { id: string; label: string };

export function ImportFlightForm({
  options,
}: {
  options: {
    pilots: Option[];
    aircraft: Option[];
    batteries: Option[];
    projects: Option[];
  };
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(importFlightStubAction, initial);

  useEffect(() => {
    if (state.ok && state.flightId) router.push(`/flights/${state.flightId}`);
  }, [state.ok, state.flightId, router]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Flight Logs"
        description="CSV stub importer with fingerprint-based duplicate detection hooks. Full DJI / Pixhawk / Auterion parsers land in the Integration Hub."
        actions={
          <Link href="/integrations" className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium">
            Integration Hub
          </Link>
        }
      />

      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-white">CSV row stub</h2>
        <p className="mt-1 text-xs text-foreground-muted">
          Format: flightId, startTime ISO, endTime ISO, pilotId, aircraftId, batteryId, projectId, location
        </p>
        <form action={action} className="mt-4 grid max-w-3xl gap-4 md:grid-cols-2">
          <label className="block text-sm md:col-span-2">
            <span className="text-foreground-muted">CSV row</span>
            <textarea
              name="csvRow"
              rows={3}
              className={field}
              placeholder="IMP-001,2026-10-01T08:00:00,2026-10-01T08:25:00,,,,,"
            />
          </label>
          <label className="block text-sm">
            <span className="text-foreground-muted">Or start time *</span>
            <input name="startTime" type="datetime-local" className={field} />
          </label>
          <label className="block text-sm">
            <span className="text-foreground-muted">End time</span>
            <input name="endTime" type="datetime-local" className={field} />
          </label>
          <label className="block text-sm">
            <span className="text-foreground-muted">Flight ID</span>
            <input name="flightId" className={field} />
          </label>
          <label className="block text-sm">
            <span className="text-foreground-muted">Location</span>
            <input name="locationLabel" className={field} />
          </label>
          <SelectField name="pilot" label="Pilot" options={options.pilots} />
          <SelectField name="aircraft" label="Drone" options={options.aircraft} />
          <SelectField name="battery" label="Battery" options={options.batteries} />
          <SelectField name="project" label="Project" options={options.projects} />
          {state.error ? <p className="md:col-span-2 text-sm text-status-critical">{state.error}</p> : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Importing…" : "Import & complete"}
            </Button>
          </div>
        </form>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {["DJI FlightHub 2", "Pixhawk / ArduPilot", "Auterion", "QGroundControl"].map((src) => (
          <div key={src} className="rounded border border-border bg-surface p-4">
            <p className="text-sm font-semibold text-white">{src}</p>
            <p className="mt-1 text-xs text-foreground-muted">Connector scaffold — enable in Integrations.</p>
          </div>
        ))}
      </div>
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
