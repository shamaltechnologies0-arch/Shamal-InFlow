"use client";

import { format } from "date-fns";
import {
  Plane,
  Clock,
  Users,
  Boxes,
  AlertTriangle,
  Wrench,
  ClipboardCheck,
  Battery,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  activeAlerts,
  batteryHealth,
  complianceScore,
  flightActivity,
  fleetStatus,
  kpis,
  liveFeed,
  missionStatus,
  pilotActivity,
  recentFlights,
  upcomingTasks,
} from "@/data/mock";
import { formatHours } from "@/lib/utils";

const CHART_NAVY = "#3EC9C2";
const CHART_BLUE = "#2A8EC4";

export function OperationsDashboard() {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
            Shamal Inventory
          </p>
          <h1 className="mt-1 text-[1.65rem] font-semibold tracking-tight text-foreground">
            Operations Center
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">{today}</p>
        </div>
        <p className="rounded-lg border border-border/70 bg-surface/60 px-3 py-1.5 text-xs text-foreground-muted">
          Kingdom-wide UAV ops · GACA-aligned reporting
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Flights" value={kpis.totalFlights} delta="+4.2% vs last month" deltaTone="up" icon={Plane} />
        <KpiCard label="Flight Hours" value={formatHours(kpis.flightHours)} format="raw" delta="4126.5h YTD" icon={Clock} />
        <KpiCard label="Active Pilots" value={kpis.activePilots} icon={Users} />
        <KpiCard label="Active Drones" value={kpis.activeDrones} icon={Boxes} />
        <KpiCard label="Open Incidents" value={kpis.openIncidents} delta="2 require review" deltaTone="down" icon={AlertTriangle} />
        <KpiCard label="Upcoming Maintenance" value={kpis.upcomingMaintenance} icon={Wrench} />
        <KpiCard label="Overdue Inspections" value={kpis.overdueInspections} deltaTone="down" icon={ClipboardCheck} />
        <KpiCard label="Battery Alerts" value={kpis.batteryAlerts} delta="1 critical" deltaTone="down" icon={Battery} />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Flight Activity</CardTitle>
            <p className="text-sm text-foreground-muted">Last 14 days — sorties and block hours</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flightActivity}>
                <defs>
                  <linearGradient id="fillFlights" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--foreground-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--foreground-muted)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="flights" stroke={CHART_NAVY} fill="url(#fillFlights)" strokeWidth={2} name="Flights" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetStatus} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="status" type="category" width={90} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="count" fill={CHART_BLUE} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Battery Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {batteryHealth.map((b) => (
              <div key={b.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{b.id}</span>
                  <span className="text-foreground-muted">{b.health}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border-subtle">
                  <div
                    className="h-full rounded-full bg-brand-blue"
                    style={{
                      width: `${b.health}%`,
                      opacity: b.health < 70 ? 0.5 : 1,
                      background: b.health < 70 ? "var(--status-critical)" : undefined,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Pilot Activity</CardTitle>
            <p className="text-sm text-foreground-muted">7-day sortie count</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {pilotActivity.map((p) => (
              <div key={p.name} className="flex items-center justify-between border-b border-border-subtle pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-foreground-muted">{formatHours(p.hours)}</p>
                </div>
                <span className="text-sm tabular-nums font-semibold">{p.flights}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Mission Status</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={missionStatus} dataKey="count" nameKey="state" innerRadius={48} outerRadius={72} paddingAngle={2}>
                  {missionStatus.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? CHART_NAVY : CHART_BLUE} opacity={1 - i * 0.08} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 grid grid-cols-2 gap-1 text-xs text-foreground-muted">
              {missionStatus.map((m) => (
                <li key={m.state}>
                  {m.state}: {m.count}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tabular-nums text-brand-navy dark:text-brand-blue">
              {complianceScore.overall}
              <span className="text-lg text-foreground-muted">/100</span>
            </p>
            <ul className="mt-4 space-y-2">
              {complianceScore.breakdown.map((item) => (
                <li key={item.label} className="flex justify-between text-sm">
                  <span className="text-foreground-muted">{item.label}</span>
                  <span className="font-medium">{item.score}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Recent Flight Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: "id", header: "Flight ID", cell: (r) => <Link className="text-brand-blue hover:underline" href={`/flights/${r.id}`}>{r.id}</Link> },
                { key: "pilot", header: "Pilot", cell: (r) => r.pilot },
                { key: "aircraft", header: "Aircraft", cell: (r) => r.aircraft },
                { key: "duration", header: "Duration", cell: (r) => r.duration },
                { key: "project", header: "Project", cell: (r) => r.project },
                { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              data={recentFlights}
              getRowKey={(r) => r.id}
            />
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((a) => (
              <div key={a.id} className="rounded-xl border border-border-subtle p-3">
                <div className="flex items-center gap-2">
                  <span className={`status-dot status-dot--${a.severity === "critical" ? "critical" : a.severity === "warning" ? "warning" : "info"}`} />
                  <span className="text-xs text-foreground-muted">{a.time}</span>
                </div>
                <p className="mt-1 text-sm">{a.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.map((t) => (
              <div key={t.id} className="border-b border-border-subtle pb-2 last:border-0">
                <p className="text-sm font-medium">{t.title}</p>
                <p className="text-xs text-foreground-muted">
                  {t.due} · {t.owner}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 overflow-hidden">
          <CardHeader>
            <CardTitle>Operational Map</CardTitle>
            <p className="text-sm text-foreground-muted">Density heatmap preview</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-56 bg-gradient-to-br from-[#0A3254] via-[#226093] to-[#071E33]">
              <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              {[
                { x: "22%", y: "35%" },
                { x: "48%", y: "52%" },
                { x: "68%", y: "28%" },
                { x: "35%", y: "62%" },
                { x: "78%", y: "58%" },
              ].map((m, i) => (
                <span
                  key={i}
                  className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-blue shadow-panel"
                  style={{ left: m.x, top: m.y }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071E33] to-transparent p-4">
                <p className="text-sm font-medium text-white">Operational Map · Density Heatmap</p>
                <p className="text-xs text-white/70">NEOM · Eastern Province · Riyadh sectors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Live Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {liveFeed.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="shrink-0 font-mono text-xs text-foreground-muted">{item.time}</span>
                  <span>{item.event}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
