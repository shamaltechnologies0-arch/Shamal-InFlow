"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flightActivity, fleetStatus, missionStatus } from "@/data/mock";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ReportsCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Executive — Flight Volume</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flightActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="#0A3254" fill="#226093" fillOpacity={0.2} name="Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Fleet Utilization</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fleetStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="status" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: 12 }} />
              <Bar dataKey="count" fill="#0A3254" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader><CardTitle>Mission Throughput Trend</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={missionStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="state" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#226093" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
