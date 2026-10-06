import { getPayloadClient } from "@/lib/payload";

type AnyDoc = { id: string | number; [key: string]: unknown };

function asDocs(docs: unknown): AnyDoc[] {
  return docs as AnyDoc[];
}

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getDashboardData() {
  const payload = await getPayloadClient();
  const today = startOfDay();
  const monthStart = startOfMonth();

  const [
    flightsAll,
    flightsToday,
    flightsMonth,
    aircraft,
    operators,
    maintenance,
    incidents,
    missions,
    batteries,
    documents,
    notifications,
  ] = await Promise.all([
    payload.find({ collection: "flights", limit: 500, sort: "-startTime", depth: 1, overrideAccess: true }),
    payload.find({
      collection: "flights",
      where: { startTime: { greater_than_equal: today.toISOString() } },
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "flights",
      where: { startTime: { greater_than_equal: monthStart.toISOString() } },
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({ collection: "aircraft", limit: 200, overrideAccess: true }),
    payload.find({ collection: "operators", limit: 200, overrideAccess: true }),
    payload.find({ collection: "maintenance-records", limit: 200, sort: "dueDate", overrideAccess: true }),
    payload.find({ collection: "incidents", limit: 100, sort: "-reportedAt", depth: 0, overrideAccess: true }),
    payload.find({ collection: "missions", limit: 200, overrideAccess: true }),
    payload.find({ collection: "batteries", limit: 200, overrideAccess: true }),
    payload.find({ collection: "documents", limit: 200, overrideAccess: true }),
    payload
      .find({
        collection: "notifications",
        where: { read: { equals: false } },
        limit: 15,
        sort: "-createdAt",
        overrideAccess: true,
      })
      .catch(() => ({ docs: [], totalDocs: 0 })),
  ]);

  const flightDocs = asDocs(flightsAll.docs);
  const totalFlightHours = flightDocs.reduce((sum, f) => sum + Number(f.durationMinutes || 0) / 60, 0);

  const acDocs = asDocs(aircraft.docs);
  const activeDrones = acDocs.filter((a) => a.status === "operational").length;
  const dronesInMaintenance = acDocs.filter(
    (a) => a.status === "maintenance_due" || a.status === "inspection_due",
  ).length;

  const mx = asDocs(maintenance.docs);
  const overdueMaintenance = mx.filter((m) => m.status === "overdue").length;
  const upcomingMaintenance = mx.filter((m) => m.status === "scheduled" || m.status === "in_progress").length;

  const missionDocs = asDocs(missions.docs);
  const plannedMissions = missionDocs.filter((m) =>
    ["planning", "draft", "submitted", "approved", "assigned"].includes(String(m.workflow || m.status || "").toLowerCase()) ||
    String(m.workflow || "") === "Planning",
  ).length;
  const completedMissions = missionDocs.filter((m) =>
    ["closed", "completed"].includes(String(m.workflow || m.status || "").toLowerCase()) ||
    String(m.workflow || "") === "Closed",
  ).length;

  const batDocs = asDocs(batteries.docs);
  const batteriesNeedingAttention = batDocs.filter((b) => {
    if (b.status === "maintenance" || b.status === "damaged") return true;
    const cycles = Number(b.cycleCount ?? 0);
    const lifespan = Number(b.cycleLifespan ?? 200) || 200;
    return cycles / lifespan >= 0.8;
  }).length;

  const now = Date.now();
  const docDocs = asDocs(documents.docs);
  let expiredDocuments = 0;
  let expiringDocuments = 0;
  for (const d of docDocs) {
    if (!d.expiryDate) continue;
    const t = new Date(String(d.expiryDate)).getTime();
    const days = (t - now) / 86_400_000;
    if (days < 0) expiredDocuments += 1;
    else if (days <= 30) expiringDocuments += 1;
  }

  const openIncidents = asDocs(incidents.docs).filter((i) =>
    ["open", "under_review", "investigating"].includes(String(i.status)),
  ).length;

  const activePilots = asDocs(operators.docs).filter((o) => o.status === "active").length;

  const alerts = [
    ...asDocs(notifications.docs).map((n) => ({
      id: String(n.id),
      severity: String(n.severity || "info"),
      message: String(n.title || n.body || "Alert"),
      time: n.createdAt ? String(n.createdAt) : "",
    })),
    ...mx
      .filter((m) => m.status === "overdue")
      .slice(0, 5)
      .map((m) => ({
        id: `mx-${m.id}`,
        severity: "critical",
        message: `Overdue maintenance: ${String(m.title)}`,
        time: String(m.dueDate || ""),
      })),
    ...batDocs
      .filter((b) => Number(b.cycleCount ?? 0) / (Number(b.cycleLifespan ?? 200) || 200) >= 0.8)
      .slice(0, 3)
      .map((b) => ({
        id: `bat-${b.id}`,
        severity: "warning",
        message: `Battery cycle limit approaching: ${String(b.name || b.serialNumber)}`,
        time: "",
      })),
  ].slice(0, 12);

  function relName(value: unknown, fallback = "—") {
    if (!value) return fallback;
    if (typeof value === "object" && value !== null) {
      const o = value as Record<string, unknown>;
      return String(o.name || o.fullName || o.registration || fallback);
    }
    return fallback;
  }

  return {
    kpis: {
      totalFlights: flightsAll.totalDocs,
      totalFlightHours: Math.round(totalFlightHours * 10) / 10,
      flightsToday: flightsToday.totalDocs,
      flightsThisMonth: flightsMonth.totalDocs,
      activePilots,
      activeDrones,
      dronesInMaintenance,
      upcomingMaintenance,
      overdueMaintenance,
      openIncidents,
      plannedMissions,
      completedMissions,
      batteriesNeedingAttention,
      expiredDocuments,
      expiringDocuments,
      batteryCycles: batDocs.reduce((s, b) => s + Number(b.cycleCount ?? 0), 0),
    },
    recentFlights: flightDocs.slice(0, 8).map((f) => ({
      id: String(f.id),
      flightId: String(f.flightId || f.id),
      pilot: relName(f.pilot),
      aircraft: relName(f.aircraft),
      project: relName(f.project),
      duration: `${Number(f.durationMinutes || 0)}m`,
      date: f.startTime ? String(f.startTime).slice(0, 16).replace("T", " ") : "—",
      status: String(f.status || ""),
    })),
    recentIncidents: asDocs(incidents.docs).slice(0, 5).map((i) => ({
      id: String(i.id),
      title: String(i.title || i.cause || "Incident"),
      severity: String(i.severity || ""),
      status: String(i.status || ""),
    })),
    recentMaintenance: mx.slice(0, 5).map((m) => ({
      id: String(m.id),
      title: String(m.title || ""),
      status: String(m.status || ""),
      due: m.dueDate ? String(m.dueDate).slice(0, 10) : "—",
    })),
    alerts,
  };
}
