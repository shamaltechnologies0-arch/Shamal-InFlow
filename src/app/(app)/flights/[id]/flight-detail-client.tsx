"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { altitudeProfile, flightsTable } from "@/data/mock";

type Flight = (typeof flightsTable)[number];

export function FlightDetailClient({ flight }: { flight: Flight }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden">
        <div className="relative h-full min-h-[420px] bg-gradient-to-br from-[#0A3254] via-[#226093] to-[#071E33]">
          <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
            <pattern id="flightGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#flightGrid)" />
          </svg>
          <div className="absolute left-4 top-4 rounded-xl glass-panel px-3 py-2 text-xs text-foreground">
            Track replay · {flight.location}
          </div>
          <div className="absolute inset-x-8 top-1/2 h-0.5 bg-white/40" />
          <span className="absolute left-[20%] top-[45%] h-4 w-4 rounded-full border-2 border-white bg-brand-blue" />
          <span className="absolute left-[55%] top-[40%] h-4 w-4 rounded-full border-2 border-white bg-brand-blue" />
          <span className="absolute left-[75%] top-[48%] h-4 w-4 rounded-full border-2 border-white bg-brand-blue" />
        </div>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{flight.id}</CardTitle>
            <p className="text-sm text-foreground-muted">{flight.project}</p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
            <div><span className="text-foreground-muted">Pilot</span><p className="font-medium">{flight.pilot}</p></div>
            <div><span className="text-foreground-muted">Aircraft</span><p className="font-medium">{flight.aircraft}</p></div>
            <div><span className="text-foreground-muted">Duration</span><p className="font-medium">{flight.duration}</p></div>
            <div><span className="text-foreground-muted">Status</span><p><StatusBadge status={flight.status} /></p></div>
            <div><span className="text-foreground-muted">Mission</span><p className="font-medium">Linked sortie</p></div>
            <div><span className="text-foreground-muted">Battery</span><p className="font-medium">BAT-NEOM-01 · 94%</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Altitude Profile</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={altitudeProfile}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="t" unit=" min" tick={{ fontSize: 11 }} />
                <YAxis unit=" m" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Area type="monotone" dataKey="alt" stroke="#0A3254" fill="#226093" fillOpacity={0.25} name="Altitude (m)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
