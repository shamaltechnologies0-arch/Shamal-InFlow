import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

function Kpi({ label, value, tone }: { label: string; value: string | number; tone?: "warn" | "crit" }) {
  return (
    <div className="rounded border border-border bg-surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold text-white",
          tone === "warn" && "text-status-warning",
          tone === "crit" && "text-status-critical",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const { kpis } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-brand-blue/40 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Shamal Inventory</p>
          <h1 className="text-2xl font-semibold tracking-wide text-white">Operations Dashboard</h1>
          <p className="text-sm text-foreground-muted">
            Operational truth across flights, fleet, batteries, maintenance, compliance, and incidents.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/flights/new" className="rounded-lg bg-brand-blue px-3 py-2 text-xs font-semibold text-white hover:bg-brand-navy">
            Manual Flight Log
          </Link>
          <Link href="/flights/import" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-white hover:bg-brand-blue/20">
            Import Logs
          </Link>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Total Flights" value={kpis.totalFlights} />
        <Kpi label="Flight Hours" value={kpis.totalFlightHours} />
        <Kpi label="Flights Today" value={kpis.flightsToday} />
        <Kpi label="Flights This Month" value={kpis.flightsThisMonth} />
        <Kpi label="Active Pilots" value={kpis.activePilots} />
        <Kpi label="Active Drones" value={kpis.activeDrones} />
        <Kpi label="Drones in Maintenance" value={kpis.dronesInMaintenance} tone={kpis.dronesInMaintenance ? "warn" : undefined} />
        <Kpi label="Upcoming Maintenance" value={kpis.upcomingMaintenance} />
        <Kpi label="Overdue Maintenance" value={kpis.overdueMaintenance} tone={kpis.overdueMaintenance ? "crit" : undefined} />
        <Kpi label="Open Incidents" value={kpis.openIncidents} tone={kpis.openIncidents ? "crit" : undefined} />
        <Kpi label="Planned Missions" value={kpis.plannedMissions} />
        <Kpi label="Completed Missions" value={kpis.completedMissions} />
        <Kpi label="Battery Cycles" value={kpis.batteryCycles} />
        <Kpi label="Batteries Attention" value={kpis.batteriesNeedingAttention} tone={kpis.batteriesNeedingAttention ? "warn" : undefined} />
        <Kpi label="Docs Expiring (30d)" value={kpis.expiringDocuments} tone={kpis.expiringDocuments ? "warn" : undefined} />
        <Kpi label="Docs Expired" value={kpis.expiredDocuments} tone={kpis.expiredDocuments ? "crit" : undefined} />
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded border border-border bg-surface xl:col-span-2">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold tracking-wide text-white">RECENT FLIGHTS</h2>
            <Link href="/flights" className="text-xs text-link hover:underline">
              View all
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {data.recentFlights.length === 0 ? (
              <li className="px-4 py-6 text-sm text-foreground-muted">No flights in MongoDB yet.</li>
            ) : (
              data.recentFlights.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div>
                    <Link href={`/flights/${f.id}`} className="font-medium text-link hover:underline">
                      {f.flightId}
                    </Link>
                    <p className="text-xs text-foreground-muted">
                      {f.pilot} · {f.aircraft} · {f.project}
                    </p>
                  </div>
                  <div className="text-right text-xs text-foreground-muted">
                    <p className="text-white">{f.duration}</p>
                    <p>{f.date}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded border border-border bg-surface">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold tracking-wide text-white">ALERTS</h2>
          </header>
          <ul className="divide-y divide-border">
            {data.alerts.length === 0 ? (
              <li className="px-4 py-6 text-sm text-foreground-muted">No active alerts.</li>
            ) : (
              data.alerts.map((a) => (
                <li key={a.id} className="px-4 py-3 text-sm">
                  <span
                    className={cn(
                      "mr-2 inline-block h-2 w-2 rounded-full",
                      a.severity === "critical" && "bg-status-critical",
                      a.severity === "warning" && "bg-status-warning",
                      a.severity !== "critical" && a.severity !== "warning" && "bg-brand-blue",
                    )}
                  />
                  <span className="text-white">{a.message}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded border border-border bg-surface">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold tracking-wide text-white">RECENT MAINTENANCE</h2>
          </header>
          <ul className="divide-y divide-border">
            {data.recentMaintenance.map((m) => (
              <li key={m.id} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-white">{m.title}</span>
                <span className="text-xs text-foreground-muted">
                  {m.status} · {m.due}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded border border-border bg-surface">
          <header className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold tracking-wide text-white">RECENT INCIDENTS</h2>
          </header>
          <ul className="divide-y divide-border">
            {data.recentIncidents.map((i) => (
              <li key={i.id} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-white">{i.title}</span>
                <span className="text-xs text-foreground-muted">
                  {i.severity} · {i.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
