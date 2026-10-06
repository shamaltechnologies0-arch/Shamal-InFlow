"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  generatedAt: string;
  by: string;
  duration: string;
  status: "Done" | "Running" | "Failed";
  downloadable: boolean;
};

const seedJobs: Job[] = [];

export default function ReportsGeneratedPage() {
  const [jobs, setJobs] = useState(seedJobs);
  const [tick, setTick] = useState(0);

  const total = jobs.length;

  const rows = useMemo(() => jobs, [jobs, tick]);

  function refresh() {
    setTick((t) => t + 1);
  }

  function removeJob(id: string) {
    setJobs((list) => list.filter((j) => j.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border-b border-brand-blue/40 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide text-white">GENERATED REPORTS & JOBS</h1>
          <p className="mt-1 text-sm text-foreground-muted">{total} in Total.</p>
        </div>
        <Link
          href="/reports"
          className="inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-blue/30"
        >
          Generate Report
        </Link>
      </div>

      <div className="overflow-hidden rounded border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-wider text-white">ALL JOBS</span>
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
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-elevated px-3 py-1.5 text-xs text-white hover:bg-brand-blue/30"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        <div className="hidden grid-cols-[1.6fr_1fr_0.8fr] gap-3 border-b border-border px-4 py-2 text-[11px] font-semibold tracking-wider text-foreground-muted sm:grid">
          <span>JOB</span>
          <span>GENERATED</span>
          <span>RECIPIENTS / ACTIONS</span>
        </div>

        <ul className="divide-y divide-border">
          {rows.map((job) => (
            <li
              key={job.id}
              className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[1.6fr_1fr_0.8fr] sm:items-center"
            >
              <div>
                <p className="text-sm font-medium text-white">{job.title}</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  By: {job.by} · Duration: {job.duration}
                </p>
              </div>
              <div className="text-sm text-white">
                <p>{job.generatedAt}</p>
                <p className="text-xs text-status-operational">{job.status}.</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {job.downloadable ? (
                  <button
                    type="button"
                    className="rounded border border-border bg-surface-elevated px-3 py-1.5 text-xs text-white hover:bg-brand-blue/30"
                  >
                    Download
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeJob(job.id)}
                  className="rounded border border-border bg-surface-elevated px-3 py-1.5 text-xs text-white hover:bg-status-critical/30"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
