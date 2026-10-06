"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Pencil,
  Search,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleAircraftActiveAction } from "@/app/actions/aircraft";

export type AircraftRow = {
  id: string;
  name: string;
  model: string;
  flights: number;
  flyingTime: string;
  legalId: string;
  serial: string;
  status: string;
  owner: string;
  active: boolean;
};

export function FleetClient({ aircraft }: { aircraft: AircraftRow[] }) {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "asset" | "other">("name");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const airworthy = aircraft.filter((a) => a.status === "Airworthy").length;
    const maintenance = aircraft.filter((a) => a.status === "Maintenance").length;
    const retired = aircraft.filter((a) => a.status === "Retired").length;
    return { airworthy, maintenance, retired, total: aircraft.length };
  }, [aircraft]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return aircraft;
    return aircraft.filter((a) => {
      if (searchBy === "asset") {
        return a.legalId.toLowerCase().includes(q) || a.serial.toLowerCase().includes(q);
      }
      if (searchBy === "other") {
        return a.model.toLowerCase().includes(q);
      }
      return a.name.toLowerCase().includes(q);
    });
  }, [query, searchBy, aircraft]);

  function onToggle(id: string, nextActive: boolean) {
    setPendingId(id);
    startTransition(async () => {
      await toggleAircraftActiveAction(id, nextActive);
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-brand-blue/50 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">DRONES</h1>
          <p className="mt-1 text-sm text-foreground-muted">{counts.total} Total</p>
          <div className="mt-4 flex flex-wrap gap-8 text-sm">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">AIRWORTHY</p>
              <p className="text-xl font-semibold text-white">{counts.airworthy}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">MAINTENANCE</p>
              <p className="text-xl font-semibold text-white">{counts.maintenance}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">RETIRED</p>
              <p className="text-xl font-semibold text-white">{counts.retired}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/reports/import"
            className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue/30"
          >
            Drone Mass-Import
          </Link>
          <Link
            href="/fleet/new"
            className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue/30"
          >
            Add Drone
          </Link>
          <Link
            href="/components"
            className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue/30"
          >
            Components
          </Link>
          <button type="button" className="p-1.5 text-foreground-muted hover:text-white" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold tracking-wider text-white">ALL DRONES</span>
            <div className="flex items-center gap-1 text-xs text-foreground-muted">
              <button type="button" className="rounded p-1 hover:bg-white/10" aria-label="Previous">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>1 of 1</span>
              <button type="button" className="rounded p-1 hover:bg-white/10" aria-label="Next">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <select className="h-8 rounded border-0 bg-white px-2 text-xs text-brand-navy">
              <option>Any Location</option>
            </select>
            <select className="h-8 rounded border-0 bg-white px-2 text-xs text-brand-navy">
              <option>Any Owner</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-gray" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-8 w-44 rounded border-0 bg-white pl-8 pr-3 text-xs text-brand-navy outline-none placeholder:text-brand-gray"
              />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/80">
              {(["name", "asset", "other"] as const).map((key) => (
                <label key={key} className="flex items-center gap-1.5 capitalize">
                  <input
                    type="radio"
                    name="searchBy"
                    checked={searchBy === key}
                    onChange={() => setSearchBy(key)}
                    className="accent-brand-blue"
                  />
                  {key}
                </label>
              ))}
            </div>
            <button type="button" className="rounded bg-white px-3 py-1.5 text-xs font-medium text-brand-navy">
              Search
            </button>
            <button type="button" className="rounded bg-white p-1.5 text-brand-navy" aria-label="Filters">
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-sm text-foreground-muted">
            No aircraft in MongoDB yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((drone) => (
              <li
                key={drone.id}
                className="grid grid-cols-1 gap-3 bg-surface-elevated/60 px-4 py-4 hover:bg-brand-blue/10 lg:grid-cols-[1.1fr_1fr_1.1fr_1.1fr_auto] lg:items-center"
              >
                <div>
                  <Link href={`/fleet/${drone.id}`} className="text-sm font-medium text-link hover:underline">
                    {drone.name}
                  </Link>
                  <p className="text-xs text-foreground-muted">{drone.model}</p>
                </div>
                <div className="text-sm text-white">
                  <p>{drone.flights} Flight(s)</p>
                  <span className="mt-1 inline-block rounded border border-border bg-surface px-2 py-0.5 font-mono text-xs text-foreground-muted">
                    {drone.flyingTime}
                  </span>
                </div>
                <div className="text-sm text-white">
                  <p>{drone.legalId}</p>
                  <p className="truncate text-xs text-foreground-muted">{drone.serial}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isPending && pendingId === drone.id}
                    onClick={() => onToggle(drone.id, !drone.active)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition",
                      drone.active ? "bg-brand-blue" : "bg-brand-gray",
                    )}
                    aria-label={drone.active ? "Mark retired" : "Mark airworthy"}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white transition",
                        drone.active ? "left-4" : "left-0.5",
                      )}
                    />
                  </button>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-white">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        drone.status === "Airworthy" && "bg-status-operational",
                        drone.status === "Maintenance" && "bg-status-warning",
                        drone.status === "Retired" && "bg-brand-gray",
                      )}
                    />
                    {drone.status}
                  </span>
                  <p className="w-full text-xs text-foreground-muted">Owner: {drone.owner}</p>
                </div>
                <div className="flex w-full items-center justify-start gap-1.5 lg:w-36 lg:justify-end">
                  <button
                    type="button"
                    className="rounded border border-border bg-surface p-1.5 text-white/80 hover:bg-brand-blue/30"
                    aria-label="Expand"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    href={`/fleet/${drone.id}`}
                    className="rounded border border-border bg-surface px-2.5 py-1.5 text-xs text-white/90 hover:bg-brand-blue/30"
                  >
                    Actions
                  </Link>
                  <Link
                    href={`/fleet/${drone.id}`}
                    className="rounded bg-brand-blue p-1.5 text-white hover:bg-brand-navy"
                    aria-label="Edit drone"
                    title="Edit drone"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
