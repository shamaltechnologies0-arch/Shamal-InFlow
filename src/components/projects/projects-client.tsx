"use client";

import { useMemo, useState } from "react";
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

export type ProjectRow = {
  id: string;
  name: string;
  client: string;
  region: string;
  flights: number;
  lastFlight: string;
  revenue: number;
  shared: boolean;
  status: string;
};

export function ProjectsClient({ projects }: { projects: ProjectRow[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q),
    );
  }, [query, projects]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-accent/40 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">PROJECTS</h1>
          <p className="mt-1 text-sm text-foreground-muted">{projects.length} Total</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-full border border-border bg-[#1e1e1e] px-4 py-2 text-xs font-medium text-white hover:bg-[#2a2a2a]">
            Project Report
          </button>
          <button type="button" className="rounded-full border border-border bg-[#1e1e1e] px-4 py-2 text-xs font-medium text-white hover:bg-[#2a2a2a]">
            Add Project
          </button>
          <button type="button" className="p-1.5 text-foreground-muted hover:text-white" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-border bg-[#1a1a1a]">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-wider text-white">ALL PROJECTS</span>
            <div className="flex items-center gap-1 text-xs text-foreground-muted">
              <button type="button" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded p-1 hover:bg-white/10 disabled:opacity-30" aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>
                {currentPage} of {totalPages}
              </span>
              <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded p-1 hover:bg-white/10 disabled:opacity-30" aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="h-8 w-48 rounded border-0 bg-white pl-8 pr-3 text-xs text-neutral-900 outline-none placeholder:text-neutral-500"
              />
            </div>
            <button type="button" className="rounded bg-white p-1.5 text-neutral-700" aria-label="Filters">
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1.4fr_1fr_0.5fr_auto] gap-3 border-b border-border px-4 py-2 text-[11px] font-semibold tracking-wider text-foreground-muted">
          <span>NAME</span>
          <span>FLIGHTS # / LAST FLIGHT DATE</span>
          <span>REVENUE</span>
          <span className="w-36 text-right">ACTIONS</span>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-foreground-muted">
            No projects in MongoDB yet. Connect DATABASE_URL and run <code className="text-accent">npm run seed</code>.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((project) => (
              <li key={project.id} className="relative grid grid-cols-[1.4fr_1fr_0.5fr_auto] items-center gap-3 bg-[#1f1f1f] px-4 py-4 hover:bg-[#242424]">
                {project.shared ? (
                  <span className="absolute left-0 top-0 rounded-br bg-[#3a3a3a] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white/80">
                    SHARED
                  </span>
                ) : null}
                <div className={cn(project.shared && "pt-2")}>
                  <button type="button" className="text-left text-sm font-medium text-link hover:underline">
                    {project.name}
                  </button>
                </div>
                <div className="text-sm text-white">
                  <p>{project.flights} Flight(s)</p>
                  <p className="text-xs text-foreground-muted">{project.lastFlight}</p>
                </div>
                <div className="text-sm text-white">{project.revenue}</div>
                <div className="flex w-36 items-center justify-end gap-1.5">
                  <button type="button" className="rounded border border-border bg-[#2a2a2a] p-1.5 text-white/80 hover:bg-[#333]" aria-label="Expand">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded border border-border bg-[#2a2a2a] px-2.5 py-1.5 text-xs text-white/90 hover:bg-[#333]">
                    Actions
                  </button>
                  <button type="button" className="rounded bg-accent p-1.5 text-white hover:brightness-110" aria-label="Edit project">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
