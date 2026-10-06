"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp, Pencil, Search, Settings2 } from "lucide-react";

export type IncidentsData = {
  total: number;
  rows: Array<{
    id: string;
    cause: string;
    severity: string;
    status: string;
    shared: boolean;
    date: string;
    drone: string;
    personnel: string;
    location: string;
    project: string;
  }>;
};

export function IncidentsClient({ data }: { data: IncidentsData }) {
  const [query, setQuery] = useState("");
  const rows = data.rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.cause.toLowerCase().includes(q) ||
      r.drone.toLowerCase().includes(q) ||
      r.personnel.toLowerCase().includes(q) ||
      r.project.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-accent/40 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">INCIDENTS</h1>
          <p className="mt-1 text-sm text-foreground-muted">{data.total} Total</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-full border border-border bg-[#1e1e1e] px-4 py-2 text-xs font-medium text-white hover:bg-[#2a2a2a]">
            Add Incident
          </button>
          <button type="button" className="p-1.5 text-foreground-muted hover:text-white" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-border bg-[#1a1a1a]">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-bold tracking-wider text-white">ALL INCIDENTS</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-8 w-48 rounded border-0 bg-white pl-8 pr-3 text-xs text-neutral-900 outline-none"
              />
            </div>
            <button type="button" className="rounded bg-white p-1.5 text-neutral-700" aria-label="Filters">
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-[1.3fr_0.8fr_1.2fr_0.7fr_1fr_auto] gap-3 border-b border-border px-4 py-2 text-[11px] font-semibold tracking-wider text-foreground-muted lg:grid">
          <span>CAUSE</span>
          <span>DRONE</span>
          <span>PERSONNEL</span>
          <span>LOCATION</span>
          <span>PROJECT</span>
          <span className="w-36 text-right">ACTIONS</span>
        </div>

        <ul className="divide-y divide-border">
          {rows.map((incident) => (
            <li key={incident.id} className="grid grid-cols-1 gap-3 bg-[#1f1f1f] px-4 py-4 lg:grid-cols-[1.3fr_0.8fr_1.2fr_0.7fr_1fr_auto] lg:items-center">
              <div className="space-y-1">
                {incident.status === "under_review" ? (
                  <span className="mr-1 inline-block rounded bg-red-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Under Review
                  </span>
                ) : null}
                {incident.shared ? (
                  <span className="mr-1 inline-block rounded bg-[#3a3a3a] px-1.5 py-0.5 text-[10px] font-bold text-white/80">
                    SHARED
                  </span>
                ) : null}
                <span className="inline-block rounded bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-bold text-black">
                  {incident.cause}
                </span>
                <p className="text-xs text-foreground-muted">{incident.date}</p>
              </div>
              <button type="button" className="text-left text-sm text-link hover:underline">
                {incident.drone}
              </button>
              <button type="button" className="text-left text-sm text-link hover:underline">
                {incident.personnel}
              </button>
              <p className="text-sm text-foreground-muted">{incident.location || "—"}</p>
              <button type="button" className="text-left text-sm text-link hover:underline">
                {incident.project}
              </button>
              <div className="flex w-36 items-center justify-start gap-1.5 lg:justify-end">
                <button type="button" className="rounded border border-border bg-[#2a2a2a] p-1.5" aria-label="Expand">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="rounded border border-border bg-[#2a2a2a] px-2.5 py-1.5 text-xs">
                  Actions
                </button>
                <button type="button" className="rounded bg-accent p-1.5 text-white" aria-label="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
