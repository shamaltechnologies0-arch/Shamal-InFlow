"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  Pencil,
  Search,
  Settings2,
} from "lucide-react";

export type FlightsData = {
  total: number;
  flyingTimeLabel: string;
  rows: Array<{
    id: string;
    flightId: string;
    startTime: string;
    duration: string;
    pilot: string;
    drone: string;
    project: string;
    location: string;
    tags: string[];
    status: string;
  }>;
};

export function FlightsClient({ data }: { data: FlightsData }) {
  const [query, setQuery] = useState("");

  const rows = data.rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.flightId.toLowerCase().includes(q) ||
      r.pilot.toLowerCase().includes(q) ||
      r.drone.toLowerCase().includes(q) ||
      r.project.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative space-y-4">
      <div className="flex flex-col gap-4 border-b border-brand-blue/40 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">ORG FLIGHTS</h1>
          <p className="mt-1 text-xs text-foreground-muted">Manual logs and imported telemetry records</p>
          <div className="mt-4 flex flex-wrap gap-10 text-sm">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">FLYING TIME</p>
              <p className="text-xl font-semibold text-white">{data.flyingTimeLabel}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">FLIGHTS</p>
              <p className="text-xl font-semibold text-white">{data.total}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/flights/new"
            className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue/30"
          >
            Add Flight
          </Link>
          <Link
            href="/flights/import"
            className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue/30"
          >
            Import Logs
          </Link>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue/30">
            <Eye className="h-3.5 w-3.5" />
            Glossary
          </button>
          <button type="button" className="p-1.5 text-foreground-muted hover:text-white" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-wider text-white">ALL FLIGHTS</span>
            <div className="flex items-center gap-1 text-xs text-foreground-muted">
              <button type="button" className="rounded p-1 hover:bg-white/10" aria-label="Previous">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>1 of 1</span>
              <button type="button" className="rounded p-1 hover:bg-white/10" aria-label="Next">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-8 w-48 rounded border-0 bg-white pl-8 pr-3 text-xs text-neutral-900 outline-none placeholder:text-neutral-500"
              />
            </div>
            <button type="button" className="rounded bg-white p-1.5 text-neutral-700" aria-label="Filters">
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1.1fr_1fr_0.8fr_1fr_1fr_1.2fr_1fr_auto] gap-2 border-b border-border px-4 py-2 text-[11px] font-semibold tracking-wider text-foreground-muted">
          <span>FLIGHT ID</span>
          <span>START</span>
          <span>DURATION</span>
          <span>PILOT</span>
          <span>DRONE</span>
          <span>PROJECT</span>
          <span>LOCATION</span>
          <span className="text-right">ACTIONS</span>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-foreground-muted">No flights match your search.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-[1.1fr_1fr_0.8fr_1fr_1fr_1.2fr_1fr_auto] items-center gap-2 px-4 py-3 text-sm"
              >
                <Link href={`/flights/${r.id}`} className="font-medium text-link hover:underline">
                  {r.flightId}
                </Link>
                <span className="text-foreground-muted">{r.startTime}</span>
                <span className="text-white">{r.duration}</span>
                <span className="text-white">{r.pilot}</span>
                <span className="text-white">{r.drone}</span>
                <span className="truncate text-foreground-muted">{r.project}</span>
                <span className="truncate text-foreground-muted">{r.location}</span>
                <div className="flex justify-end gap-1">
                  <Link href={`/flights/${r.id}`} className="rounded p-1.5 text-foreground-muted hover:text-white" aria-label="View">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link href={`/flights/${r.id}`} className="rounded p-1.5 text-foreground-muted hover:text-white" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
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
