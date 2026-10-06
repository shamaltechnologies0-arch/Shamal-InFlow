"use client";

import { useMemo, useState } from "react";
import { ChevronDown, CircleHelp, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "overdue" | "scheduled" | "in_progress" | "completed";

export type MaintenanceData = {
  counts: Record<Tab, number>;
  rows: Array<{
    id: string;
    title: string;
    status: string;
    dueLabel: string;
    assetLabel: string;
    dueDate?: string | null;
  }>;
};

export function MaintenanceClient({ data }: { data: MaintenanceData }) {
  const [tab, setTab] = useState<Tab>("overdue");

  const rows = useMemo(
    () => data.rows.filter((r) => r.status === tab),
    [data.rows, tab],
  );

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "overdue", label: "Overdue" },
    { key: "scheduled", label: "Scheduled" },
    { key: "in_progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-accent/40 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">MAINTENANCE</h1>
          <div className="mt-4 flex flex-wrap gap-8 text-sm">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">OVERDUE</p>
              <p className="text-xl font-semibold text-white">{data.counts.overdue}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">SCHEDULED</p>
              <p className="text-xl font-semibold text-white">{data.counts.scheduled}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">IN PROGRESS</p>
              <p className="text-xl font-semibold text-white">{data.counts.in_progress}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">COMPLETED</p>
              <p className="text-xl font-semibold text-white">{data.counts.completed}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-full border border-border bg-[#1e1e1e] px-4 py-2 text-xs font-medium text-white hover:bg-[#2a2a2a]">
            Add Maintenance
          </button>
          <button type="button" className="p-1.5 text-foreground-muted hover:text-white" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold",
              tab === t.key ? "bg-[#2a2a2a] text-white" : "text-foreground-muted hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded border border-border bg-[#1a1a1a]">
        <div className="grid grid-cols-[1.4fr_1fr_1.4fr_auto] gap-3 border-b border-border px-4 py-2 text-[11px] font-semibold tracking-wider text-foreground-muted">
          <span>NAME</span>
          <span>DUE ON</span>
          <span>FOR</span>
          <span className="w-40 text-right">ACTIONS</span>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-foreground-muted">No {tab.replace("_", " ")} maintenance records.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((item) => (
              <li key={item.id} className="grid grid-cols-[1.4fr_1fr_1.4fr_auto] items-center gap-3 bg-[#1f1f1f] px-4 py-4">
                <p className="text-sm text-white">{item.title}</p>
                <div>
                  <p className="text-xs text-foreground-muted">{item.dueLabel}</p>
                  {item.status === "overdue" ? (
                    <span className="mt-1 inline-block rounded bg-red-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      overdue
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-link">{item.assetLabel}</p>
                <div className="flex w-40 items-center justify-end gap-1.5">
                  <button type="button" className="rounded border border-border bg-[#2a2a2a] p-1.5" aria-label="Expand">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded bg-accent p-1.5 text-white" aria-label="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded bg-accent px-2.5 py-1.5 text-xs font-semibold text-white">
                    Resolve
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
