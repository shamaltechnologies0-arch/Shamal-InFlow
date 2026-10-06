"use client";

import { useMemo, useState } from "react";
import { ChevronDown, CircleHelp, Pencil, Search, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "all" | "flight" | "pilot" | "organization" | "other";

export type DocumentsData = {
  counts: {
    flight: number;
    pilot: number;
    organization: number;
    other: number;
  };
  rows: Array<{
    id: string;
    title: string;
    holderName?: string | null;
    reference?: string | null;
    documentType: string;
    category: string;
    shared: boolean;
    project: string;
    modifiedLabel: string;
    expirationLabel: string;
    expired: boolean;
  }>;
};

export function DocumentsClient({ data }: { data: DocumentsData }) {
  const [tab, setTab] = useState<Tab>("pilot");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return data.rows.filter((r) => {
      if (tab !== "all" && r.category !== tab) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        (r.holderName || "").toLowerCase().includes(q) ||
        (r.reference || "").toLowerCase().includes(q)
      );
    });
  }, [data.rows, tab, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-accent/40 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">DOCUMENTS</h1>
          <div className="mt-4 flex flex-wrap gap-8 text-sm">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">FLIGHT DOCS</p>
              <p className="text-xl font-semibold text-white">{data.counts.flight}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">PILOT DOCS</p>
              <p className="text-xl font-semibold text-white">{data.counts.pilot}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">ORG. DOCS</p>
              <p className="text-xl font-semibold text-white">{data.counts.organization}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-full border border-border bg-[#1e1e1e] px-4 py-2 text-xs font-medium text-white hover:bg-[#2a2a2a]">
            Add Document
          </button>
          <button type="button" className="p-1.5 text-foreground-muted hover:text-white" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "DOCUMENTS"],
              ["flight", "Flight"],
              ["pilot", `Pilot (${data.counts.pilot})`],
              ["organization", "Organization"],
              ["other", "Other"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded px-3 py-1.5 text-xs font-semibold",
                tab === key ? "bg-brand-blue text-white" : "text-foreground-muted hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>
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

      <div className="overflow-hidden rounded border border-border bg-[#1a1a1a]">
        <div className="grid grid-cols-[1.6fr_0.8fr_0.7fr_0.9fr_auto] gap-3 border-b border-border px-4 py-2 text-[11px] font-semibold tracking-wider text-foreground-muted">
          <span>NAME</span>
          <span>PROJECT</span>
          <span>MODIFIED</span>
          <span>EXPIRATION</span>
          <span className="w-28 text-right">ACTIONS</span>
        </div>
        <ul className="divide-y divide-border">
          {rows.map((doc) => (
            <li key={doc.id} className="grid grid-cols-[1.6fr_0.8fr_0.7fr_0.9fr_auto] items-center gap-3 bg-[#1f1f1f] px-4 py-4">
              <div>
                {doc.shared ? (
                  <span className="mb-1 inline-block rounded bg-sky-900/60 px-1.5 py-0.5 text-[10px] font-bold text-sky-200">
                    SHARED
                  </span>
                ) : null}
                <p className="text-sm text-white">
                  {doc.title}
                  {doc.holderName ? ` (${doc.holderName})` : ""}
                </p>
                {doc.reference ? <p className="text-xs text-foreground-muted">Ref: {doc.reference}</p> : null}
                <p className="text-xs text-foreground-muted">{doc.documentType}</p>
              </div>
              <p className="text-sm text-foreground-muted">{doc.project}</p>
              <p className="text-sm text-foreground-muted">{doc.modifiedLabel}</p>
              <p className={cn("text-sm", doc.expired ? "font-semibold text-red-400" : "text-foreground-muted")}>
                {doc.expirationLabel}
              </p>
              <div className="flex w-28 items-center justify-end gap-1.5">
                <button type="button" className="rounded border border-border bg-[#2a2a2a] p-1.5" aria-label="Expand">
                  <ChevronDown className="h-3.5 w-3.5" />
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
