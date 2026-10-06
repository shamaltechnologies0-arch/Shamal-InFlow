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
import { toggleBatteryActiveAction } from "@/app/actions/batteries";

export type BatteryRow = {
  id: string;
  name: string;
  serial: string;
  model: string;
  legalId: string;
  shared: boolean;
  owner: string;
  flights: number;
  flyingTime: string;
  flightLifespan: number;
  flightProgress: number;
  cycles: number;
  cycleLifespan: number;
  cycleProgress: number;
  status: string;
  active: boolean;
};

export function BatteriesClient({ batteries }: { batteries: BatteryRow[] }) {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "asset" | "other">("name");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const counts = useMemo(() => {
    const airworthy = batteries.filter((b) => b.status === "Airworthy").length;
    const maintenance = batteries.filter((b) => b.status === "Maintenance").length;
    const retired = batteries.filter((b) => b.status === "Retired").length;
    return { airworthy, maintenance, retired, total: batteries.length };
  }, [batteries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return batteries;
    return batteries.filter((b) => {
      if (searchBy === "asset") {
        return b.legalId.toLowerCase().includes(q) || b.serial.toLowerCase().includes(q);
      }
      if (searchBy === "other") {
        return b.model.toLowerCase().includes(q) || b.owner.toLowerCase().includes(q);
      }
      return b.name.toLowerCase().includes(q) || b.serial.toLowerCase().includes(q);
    });
  }, [batteries, query, searchBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function onToggle(id: string, nextActive: boolean) {
    setPendingId(id);
    startTransition(async () => {
      await toggleBatteryActiveAction(id, nextActive);
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-brand-blue/50 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">BATTERIES</h1>
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
            Battery Mass-Import
          </Link>
          <Link
            href="/batteries/new"
            className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue/30"
          >
            Add Battery
          </Link>
          <button type="button" className="rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue/30">
            Inventory Map
          </button>
          <button type="button" className="p-1.5 text-foreground-muted hover:text-white" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold tracking-wider text-white">ALL BATTERIES</span>
            <div className="flex items-center gap-1 text-xs text-foreground-muted">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded p-1 hover:bg-white/10 disabled:opacity-30"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>
                {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded p-1 hover:bg-white/10 disabled:opacity-30"
                aria-label="Next"
              >
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
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="h-8 w-44 rounded border-0 bg-white pl-8 pr-3 text-xs text-brand-navy outline-none placeholder:text-brand-gray"
              />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/80">
              {(["name", "asset", "other"] as const).map((key) => (
                <label key={key} className="flex items-center gap-1.5 capitalize">
                  <input
                    type="radio"
                    name="batterySearchBy"
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

        <div className="hidden grid-cols-[1.2fr_1.2fr_1fr_1.1fr_auto] gap-3 border-b border-border px-4 py-2 text-[11px] font-semibold tracking-wider text-foreground-muted lg:grid">
          <span>NAME</span>
          <span>FLIGHTS # / FLYING TIME</span>
          <span>CYCLE #</span>
          <span>STATUS</span>
          <span className="w-36 text-right">ACTIONS</span>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-foreground-muted">
            No batteries yet. Use Add Battery or re-run seed after schema update.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((battery) => (
              <li
                key={battery.id}
                className="relative grid grid-cols-1 gap-3 bg-surface-elevated/60 px-4 py-4 hover:bg-brand-blue/10 lg:grid-cols-[1.2fr_1.2fr_1fr_1.1fr_auto] lg:items-center"
              >
                {battery.shared ? (
                  <span className="absolute left-0 top-0 rounded-br bg-brand-navy px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white/80">
                    SHARED
                  </span>
                ) : null}
                <div className={cn(battery.shared && "pt-2")}>
                  <Link href={`/batteries/${battery.id}`} className="text-sm font-medium text-link hover:underline">
                    {battery.name}
                  </Link>
                  <p className="text-xs text-foreground-muted">S# {battery.serial}</p>
                  {battery.model ? <p className="text-xs text-foreground-muted">{battery.model}</p> : null}
                </div>
                <div className="text-sm text-white">
                  <p>{battery.flights} Flight(s)</p>
                  <span className="mt-1 inline-block rounded border border-border bg-surface px-2 py-0.5 font-mono text-xs text-foreground-muted">
                    {battery.flyingTime}
                  </span>
                  <div className="mt-2">
                    <p className="text-[10px] text-foreground-muted">
                      Lifespan ({battery.flightLifespan}) / Flight #
                    </p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-brand-navy">
                      <div
                        className="h-full rounded-full bg-brand-blue"
                        style={{ width: `${battery.flightProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-white">
                  <p>{battery.cycles}</p>
                  <button
                    type="button"
                    className="mt-1 rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-white/80"
                  >
                    Cycles
                  </button>
                  <div className="mt-2">
                    <p className="text-[10px] text-foreground-muted">
                      Lifespan ({battery.cycleLifespan}) / Cycles #
                    </p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-brand-navy">
                      <div
                        className="h-full rounded-full bg-brand-blue"
                        style={{ width: `${battery.cycleProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isPending && pendingId === battery.id}
                    onClick={() => onToggle(battery.id, !battery.active)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition",
                      battery.active ? "bg-brand-blue" : "bg-brand-gray",
                    )}
                    aria-label={battery.active ? "Mark retired" : "Mark airworthy"}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white transition",
                        battery.active ? "left-4" : "left-0.5",
                      )}
                    />
                  </button>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-white">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        battery.status === "Airworthy" && "bg-status-operational",
                        battery.status === "Maintenance" && "bg-status-warning",
                        battery.status === "Retired" && "bg-brand-gray",
                      )}
                    />
                    {battery.status}
                  </span>
                  <p className="w-full text-xs text-foreground-muted">Owner: {battery.owner}</p>
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
                    href={`/batteries/${battery.id}`}
                    className="rounded border border-border bg-surface px-2.5 py-1.5 text-xs text-white/90 hover:bg-brand-blue/30"
                  >
                    Actions
                  </Link>
                  <Link
                    href={`/batteries/${battery.id}`}
                    className="rounded bg-brand-blue p-1.5 text-white hover:bg-brand-navy"
                    aria-label="Edit battery"
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
