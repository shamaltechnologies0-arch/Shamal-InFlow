"use client";

import { CircleHelp } from "lucide-react";
import { useState } from "react";

type ReportCard = {
  id: string;
  title: string;
  description: string;
  wide?: boolean;
};

/** Shamal Inventory reporting catalog — PRD §23–25 (no third-party SaaS plan copy). */
const reports: ReportCard[] = [
  {
    id: "compliance",
    title: "COMPLIANCE REPORTING",
    description:
      "Generate organization-branded compliance packs for operational oversight. Architecture supports configurable regulatory formats (including future GACA / organizational requirements) — not hard-coded to a foreign authority template.",
    wide: true,
  },
  {
    id: "flight-activity",
    title: "FLIGHT ACTIVITY REPORTING",
    description:
      "Flight count, hours, pilots, drones, locations, and mission types for a selected period.",
  },
  {
    id: "custom-ops",
    title: "CUSTOM OPERATIONS REPORTING",
    description:
      "Build filtered operational PDFs by date, pilot, drone, project, customer, location, and status.",
  },
  {
    id: "inventory",
    title: "INVENTORY / FLEET REPORTING",
    description:
      "Aircraft, components, equipment, and batteries — utilization, status, and optional retired assets.",
  },
  {
    id: "maintenance",
    title: "MAINTENANCE REPORTING",
    description:
      "Maintenance history, upcoming and overdue work, component replacements, and technician activity.",
  },
  {
    id: "inspection",
    title: "INSPECTION REPORTING",
    description:
      "Completed, failed, upcoming, and overdue inspections across aircraft, batteries, and equipment.",
  },
  {
    id: "battery",
    title: "BATTERY REPORTING",
    description:
      "Battery health, cycle counts, performance, and packs approaching configured cycle thresholds.",
  },
  {
    id: "battery-charges",
    title: "BATTERY CHARGE REPORTING",
    description:
      "Charge events, charge/discharge levels, linked flights, and health notes for a selected period.",
  },
  {
    id: "pilot",
    title: "PILOT / OPERATOR REPORTING",
    description:
      "Flight hours, currency, certifications, training, and qualifications by operator.",
  },
  {
    id: "mission",
    title: "MISSION REPORTING",
    description:
      "Planned, in-progress, completed, and cancelled missions with approval and assignment status.",
  },
  {
    id: "incident",
    title: "INCIDENT REPORTING",
    description:
      "Incident counts by type, severity, aircraft, pilots, equipment, and corrective actions.",
  },
  {
    id: "project",
    title: "PROJECT REPORTING",
    description:
      "Flights, hours, operators, drones, and incidents associated with a selected project.",
  },
];

export default function ReportsPage() {
  const [queued, setQueued] = useState<string | null>(null);

  function createReport(id: string, title: string) {
    setQueued(title);
    window.setTimeout(() => setQueued(null), 2500);
    void id;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-brand-blue/40 pb-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide text-white">GENERATE A REPORT</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Shamal Inventory reporting engine — PDF / Excel / CSV exports (PRD reporting catalog).
          </p>
        </div>
        <button type="button" className="text-foreground-muted hover:text-white" aria-label="Help">
          <CircleHelp className="h-5 w-5" />
        </button>
      </div>

      {queued ? (
        <p
          className="rounded border border-brand-blue/40 bg-brand-blue/15 px-3 py-2 text-sm text-white"
          role="status"
        >
          Report job queued: <strong>{queued}</strong>. Track progress in{" "}
          <a href="/reports/generated" className="text-link underline">
            Reports Generated
          </a>
          .
        </p>
      ) : null}

      <div className="space-y-4">
        {reports
          .filter((r) => r.wide)
          .map((report) => (
            <ReportCardView key={report.id} report={report} onCreate={createReport} />
          ))}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports
            .filter((r) => !r.wide)
            .map((report) => (
              <ReportCardView key={report.id} report={report} onCreate={createReport} />
            ))}
        </div>
      </div>
    </div>
  );
}

function ReportCardView({
  report,
  onCreate,
}: {
  report: ReportCard;
  onCreate: (id: string, title: string) => void;
}) {
  return (
    <article className="flex h-full flex-col rounded border border-border bg-surface p-5 shadow-soft">
      <h2 className="text-sm font-bold tracking-wide text-white">{report.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted">{report.description}</p>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => onCreate(report.id, report.title)}
          className="rounded-lg border border-brand-blue bg-brand-blue px-5 py-2 text-xs font-semibold text-white hover:bg-brand-navy"
        >
          Create Report
        </button>
      </div>
    </article>
  );
}
