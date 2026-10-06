import { getPayloadClient } from "@/lib/payload";

type AnyDoc = { id: string | number; [key: string]: unknown };

function asDocs(docs: unknown): AnyDoc[] {
  return docs as AnyDoc[];
}

function asDoc(doc: unknown): AnyDoc {
  return doc as AnyDoc;
}

function textField(value: unknown) {
  return value == null ? "" : String(value);
}

function numberField(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function relName(value: unknown, fallback = "—"): string {
  if (!value) return fallback;
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return String(obj.name || obj.fullName || obj.registration || obj.title || fallback);
  }
  return fallback;
}

function relId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "object" && value !== null && "id" in value) {
    return String((value as { id: unknown }).id);
  }
  return String(value);
}

function isNotFound(err: unknown) {
  if (!err || typeof err !== "object") return false;
  const error = err as { status?: number; name?: string };
  return error.status === 404 || error.name === "NotFound";
}

export type AircraftOption = { id: string; label: string };

export async function listAircraftOptions(): Promise<AircraftOption[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "aircraft",
    limit: 200,
    sort: "name",
    depth: 0,
    overrideAccess: true,
  });

  return asDocs(result.docs).map((aircraft) => ({
    id: String(aircraft.id),
    label: String(aircraft.name || aircraft.registration || aircraft.id),
  }));
}

function formatDuration(minutes?: number | null) {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

function formatFlyingTime(hours?: number | null) {
  if (hours == null) return "00:00:00";
  const totalSeconds = Math.round(Number(hours) * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function mapAircraftStatus(status?: string | null) {
  switch (status) {
    case "operational":
      return "Airworthy";
    case "inspection_due":
    case "maintenance_due":
      return "Maintenance";
    case "retired":
    case "grounded":
      return "Retired";
    default:
      return status || "Unknown";
  }
}

export async function listProjects() {
  const payload = await getPayloadClient();
  const [projects, flights] = await Promise.all([
    payload.find({ collection: "projects", limit: 100, sort: "-updatedAt", overrideAccess: true }),
    payload.find({ collection: "flights", limit: 500, sort: "-startTime", overrideAccess: true, depth: 0 }),
  ]);

  return asDocs(projects.docs).map((project) => {
    const related = asDocs(flights.docs).filter((f) => {
      const pid = typeof f.project === "object" && f.project ? (f.project as AnyDoc).id : f.project;
      return String(pid) === String(project.id);
    });
    const last = related[0];
    const location = project.location as { label?: string } | undefined;
    return {
      id: String(project.id),
      name: String(project.name || ""),
      client: String(project.customer || "—"),
      region: location?.label || "—",
      flights: related.length,
      lastFlight: last?.startTime
        ? new Date(String(last.startTime)).toISOString().replace("T", " ").slice(0, 19)
        : "—",
      revenue: Number(project.revenue ?? 0),
      shared: Boolean(project.shared),
      status: String(project.status || "active"),
    };
  });
}

export async function listAircraft() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "aircraft",
    limit: 100,
    sort: "name",
    overrideAccess: true,
  });

  return asDocs(result.docs).map((a) => ({
    id: String(a.id),
    name: String(a.name || a.registration || ""),
    model: [a.model, a.manufacturer].filter(Boolean).join(" / "),
    tail: String(a.registration || ""),
    flights: Number(a.flightCount ?? 0),
    flyingTime: formatFlyingTime(a.flightHours as number | null | undefined),
    hours: Number(a.flightHours ?? 0),
    legalId: String(a.legalId || a.registration || ""),
    serial: String(a.serialNumber || "—"),
    status: mapAircraftStatus(a.status as string),
    owner: String(a.ownerLabel || "Shamal Technologies"),
    base: "—",
    active: a.status !== "retired" && a.status !== "grounded",
  }));
}

export async function getAircraft(id: string) {
  const payload = await getPayloadClient();
  const a = asDoc(await payload.findByID({
    collection: "aircraft",
    id,
    overrideAccess: true,
  }));

  return {
    id: String(a.id),
    name: String(a.name || a.registration || ""),
    model: String(a.model || ""),
    manufacturer: String(a.manufacturer || ""),
    modelLabel: [a.model, a.manufacturer].filter(Boolean).join(" / "),
    tail: String(a.registration || ""),
    hours: Number(a.flightHours ?? 0),
    flightCount: Number(a.flightCount ?? 0),
    status: mapAircraftStatus(a.status as string),
    statusValue: String(a.status || "operational"),
    legalId: String(a.legalId || ""),
    serial: String(a.serialNumber || ""),
    internalSerial: textField(a.internalSerial),
    flightControllerSerial: textField(a.flightControllerSerial),
    remoteControllerSerial: textField(a.remoteControllerSerial),
    remoteController2Serial: textField(a.remoteController2Serial),
    softwareInformation: textField(a.softwareInformation),
    aircraftType: String(a.aircraftType || "multi_rotors"),
    geometry: textField(a.geometry),
    inventoryAssetNumber: textField(a.inventoryAssetNumber),
    description: textField(a.description),
    tags: textField(a.tags),
    location: textField(a.location),
    ownerLabel: textField(a.ownerLabel) || "Shamal Technologies",
    complianceCategory: textField(a.complianceCategory),
    firmwareVersion: textField(a.firmwareVersion),
    hardwareVersion: textField(a.hardwareVersion),
    propulsionType: String(a.propulsionType || "electric"),
    weightKg: numberField(a.weightKg),
    maxGrossTakeoffKg: numberField(a.maxGrossTakeoffKg),
    maxPayloadKg: numberField(a.maxPayloadKg),
    color: textField(a.color),
    maxSpeedMs: numberField(a.maxSpeedMs),
    maxVerticalSpeedMs: numberField(a.maxVerticalSpeedMs),
    maxFlightTimeSeconds: numberField(a.maxFlightTimeSeconds),
    outOfSightDistance: numberField(a.outOfSightDistance),
    purchaseDate: a.purchaseDate ? String(a.purchaseDate).slice(0, 10) : "",
    insurableValue: numberField(a.insurableValue),
    loanerDrone: Boolean(a.loanerDrone),
    excludedFromLegalReport: Boolean(a.excludedFromLegalReport),
    remoteId: textField(a.remoteId),
    connectivitySlot1: textField(a.connectivitySlot1),
    connectivitySlot1Extra: textField(a.connectivitySlot1Extra),
    connectivitySlot2: textField(a.connectivitySlot2),
    connectivitySlot2Extra: textField(a.connectivitySlot2Extra),
    videoSourceUrl: textField(a.videoSourceUrl),
    base: textField(a.location) || "—",
  };
}

export async function listFlights() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "flights",
    limit: 50,
    sort: "-startTime",
    depth: 1,
    overrideAccess: true,
  });

  const totals = await payload.find({
    collection: "flights",
    limit: 0,
    overrideAccess: true,
  });

  const flyingMinutes = asDocs(result.docs).reduce(
    (sum, f) => sum + Number(f.durationMinutes || 0),
    0,
  );

  return {
    total: totals.totalDocs,
    flyingTimeLabel: formatDuration(flyingMinutes),
    rows: asDocs(result.docs).map((f) => ({
      id: String(f.id),
      flightId: String(f.flightId || ""),
      startTime: f.startTime
        ? new Date(String(f.startTime)).toISOString().replace("T", " ").slice(0, 19)
        : "—",
      duration: formatDuration(f.durationMinutes as number | null | undefined),
      pilot: relName(f.pilot, "Unassigned"),
      drone: relName(f.aircraft, "—"),
      project: relName(f.project, "—"),
      location: String(f.locationLabel || "—"),
      tags: ((f.tags as string[]) || []).map((t) => String(t).toUpperCase()),
      status: String(f.status || ""),
    })),
  };
}

export async function listMaintenance() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "maintenance-records",
    limit: 100,
    sort: "dueDate",
    overrideAccess: true,
  });

  const docs = asDocs(result.docs) as never /*fix */;
  const counts = {
    overdue: docs.filter((d) => d.status === "overdue").length,
    scheduled: docs.filter((d) => d.status === "scheduled").length,
    in_progress: docs.filter((d) => d.status === "in_progress").length,
    completed: docs.filter((d) => d.status === "completed").length,
  };

  return {
    counts,
    rows: docs.map((d) => ({
      id: String(d.id),
      title: String(d.title || ""),
      status: String(d.status || ""),
      dueLabel: String(d.dueLabel || (d.dueDate ? `Scheduled: ${String(d.dueDate).slice(0, 10)}` : "—")),
      assetLabel: String(d.assetLabel || d.assetId || ""),
      dueDate: d.dueDate ? String(d.dueDate) : null,
    })),
  };
}

export async function listIncidents() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "incidents",
    limit: 100,
    sort: "-reportedAt",
    depth: 1,
    overrideAccess: true,
  });

  return {
    total: result.totalDocs,
    rows: asDocs(result.docs).map((i) => ({
      id: String(i.id),
      cause: String(i.cause || i.title || ""),
      severity: String(i.severity || ""),
      status: String(i.status || ""),
      shared: Boolean(i.shared),
      date: i.reportedAt ? String(i.reportedAt).slice(0, 10) : "—",
      drone: relName(i.aircraft, "—"),
      personnel: String(i.personnelLabel || "—"),
      location: String(i.locationLabel || ""),
      project: relName(i.project, "—"),
    })),
  };
}

export async function listDocuments() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "documents",
    limit: 100,
    sort: "-updatedAt",
    overrideAccess: true,
  });

  const docs = asDocs(result.docs) as never /*fix */;
  const counts = {
    flight: docs.filter((d) => d.category === "flight").length,
    pilot: docs.filter((d) => d.category === "pilot").length,
    organization: docs.filter((d) => d.category === "organization").length,
    other: docs.filter((d) => !d.category || d.category === "other").length,
  };

  return {
    counts,
    rows: docs.map((d) => {
      const expiry = d.expiryDate ? new Date(String(d.expiryDate)) : null;
      const now = new Date();
      let expirationLabel = "—";
      let expired = false;
      if (expiry) {
        const diffDays = Math.round((expiry.getTime() - now.getTime()) / 86_400_000);
        if (diffDays < 0) {
          expired = true;
          expirationLabel = `Expired ${Math.abs(diffDays)} days ago`;
        } else if (diffDays < 30) {
          expirationLabel = `Expires in ${diffDays} days`;
        } else {
          expirationLabel = `${Math.round(diffDays / 30)} months from now`;
        }
      }

      const modified = d.updatedAt ? new Date(String(d.updatedAt)) : null;
      const modifiedLabel = modified
        ? `${Math.max(1, Math.round((now.getTime() - modified.getTime()) / (30 * 86_400_000)))} months ago`
        : "—";

      return {
        id: String(d.id),
        title: String(d.title || ""),
        holderName: d.holderName ? String(d.holderName) : null,
        reference: d.reference ? String(d.reference) : null,
        documentType: String(d.documentType || "Document"),
        category: String(d.category || "other"),
        shared: Boolean(d.shared),
        project: "No Project",
        modifiedLabel,
        expirationLabel,
        expired,
      };
    }),
  };
}

export function mapBatteryStatus(status?: string | null) {
  switch (status) {
    case "operational":
      return "Airworthy";
    case "maintenance":
    case "damaged":
      return "Maintenance";
    case "retired":
      return "Retired";
    default:
      return status || "Unknown";
  }
}

function formatBatteryFlyingTime(hours?: number | null) {
  if (hours == null) return "00:00:00";
  const totalSeconds = Math.round(Number(hours) * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export async function listBatteries() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "batteries",
    limit: 200,
    sort: "-updatedAt",
    depth: 1,
    overrideAccess: true,
  });

  return asDocs(result.docs).map((b) => {
    const flightCount = Number(b.flightCount ?? 0);
    const flightLifespan = Number(b.flightLifespan ?? 500) || 500;
    const cycleCount = Number(b.cycleCount ?? 0);
    const cycleLifespan = Number(b.cycleLifespan ?? 200) || 200;
    return {
      id: String(b.id),
      name: String(b.name || b.serialNumber || ""),
      serial: String(b.serialNumber || ""),
      model: String(b.model || ""),
      legalId: String(b.legalId || b.serialNumber || ""),
      shared: Boolean(b.shared ?? true),
      owner: String(b.ownerLabel || "Shamal Technologies"),
      flights: flightCount,
      flyingTime: formatBatteryFlyingTime(b.flightHours as number | null | undefined),
      hours: Number(b.flightHours ?? 0),
      flightLifespan,
      flightProgress: Math.min(100, Math.round((flightCount / flightLifespan) * 100)),
      cycles: cycleCount,
      cycleLifespan,
      cycleProgress: Math.min(100, Math.round((cycleCount / cycleLifespan) * 100)),
      health: Number(b.healthScore ?? 0),
      status: mapBatteryStatus(b.status as string),
      statusValue: String(b.status || "operational"),
      active: b.status !== "retired",
      aircraftId: relId(b.aircraft),
      aircraftLabel: relName(b.aircraft, "—"),
    };
  });
}

export async function getBattery(id: string) {
  const payload = await getPayloadClient();
  const b = asDoc(await payload.findByID({
    collection: "batteries",
    id,
    depth: 1,
    overrideAccess: true,
  }));

  return {
    id: String(b.id),
    name: String(b.name || b.serialNumber || ""),
    serial: String(b.serialNumber || ""),
    model: String(b.model || ""),
    legalId: String(b.legalId || ""),
    shared: Boolean(b.shared ?? true),
    owner: String(b.ownerLabel || "Shamal Technologies"),
    status: mapBatteryStatus(b.status as string),
    statusValue: String(b.status || "operational"),
    health: Number(b.healthScore ?? 0),
    cycles: Number(b.cycleCount ?? 0),
    cycleLifespan: Number(b.cycleLifespan ?? 200),
    flights: Number(b.flightCount ?? 0),
    flightLifespan: Number(b.flightLifespan ?? 500),
    hours: Number(b.flightHours ?? 0),
    aircraftId: relId(b.aircraft),
    aircraftLabel: relName(b.aircraft, "—"),
  };
}

export async function getFlight(id: string) {
  const payload = await getPayloadClient();
  const f = asDoc(await payload.findByID({
    collection: "flights",
    id,
    depth: 1,
    overrideAccess: true,
  }));

  return {
    id: String(f.id),
    flightId: String(f.flightId || ""),
    date: f.startTime ? String(f.startTime).slice(0, 10) : "—",
    startTime: f.startTime ? new Date(String(f.startTime)).toISOString().replace("T", " ").slice(0, 19) : "—",
    endTime: f.endTime ? new Date(String(f.endTime)).toISOString().replace("T", " ").slice(0, 19) : "—",
    duration: formatDuration(f.durationMinutes as number | null | undefined),
    durationMinutes: Number(f.durationMinutes ?? 0),
    pilot: relName(f.pilot, "Unassigned"),
    aircraft: relName(f.aircraft, "—"),
    battery: relName(f.battery, "—"),
    project: relName(f.project, "—"),
    mission: relName(f.mission, "—"),
    location: String(f.locationLabel || "—"),
    status: String(f.status || ""),
    source: String(f.source || "manual"),
    distanceKm: Number(f.distanceKm ?? 0),
    maxAltitudeM: Number(f.maxAltitudeM ?? 0),
    maxSpeedMs: Number(f.maxSpeedMs ?? 0),
    tags: ((f.tags as string[]) || []).map((t) => String(t).toUpperCase()),
    takeoff: f.takeoff as { lat?: number; lng?: number; alt?: number } | undefined,
    landing: f.landing as { lat?: number; lng?: number; alt?: number } | undefined,
  };
}

export async function listMissions() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "missions",
    limit: 200,
    sort: "-scheduledStart",
    depth: 1,
    overrideAccess: true,
  });

  const docs = asDocs(result.docs) as never /*fix */;
  const statusCounts: Record<string, number> = {};
  for (const d of docs) {
    const s = String(d.status || "draft");
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  return {
    statusCounts,
    rows: docs.map((m) => ({
      id: String(m.id),
      code: String(m.code || ""),
      name: String(m.name || ""),
      project: relName(m.project, "—"),
      status: String(m.status || "draft"),
      riskLevel: String(m.riskLevel || "—"),
      scheduled: m.scheduledStart ? String(m.scheduledStart).slice(0, 16).replace("T", " ") : "—",
    })),
  };
}

export async function listOperators() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "operators",
    limit: 200,
    sort: "fullName",
    overrideAccess: true,
  });

  return asDocs(result.docs).map((op) => ({
    id: String(op.id),
    name: String(op.fullName || ""),
    employeeId: String(op.employeeId || ""),
    role: String(op.role || "Pilot"),
    status: String(op.status || "active"),
    currency: String(op.currencyStatus || "current"),
    hours: Number(op.totalFlightHours ?? 0),
    flightCount: Number(op.flightCount ?? 0),
    skills: ((op.skills as string[]) || []).map(String),
    contactEmail: String(op.contactEmail || ""),
  }));
}

export async function listComponents() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "components",
    limit: 200,
    sort: "-updatedAt",
    depth: 1,
    overrideAccess: true,
  });

  return asDocs(result.docs).map((c) => ({
    id: String(c.id),
    name: String(c.name || ""),
    componentType: String(c.componentType || ""),
    manufacturer: String(c.manufacturer || "—"),
    model: String(c.model || "—"),
    serial: String(c.serialNumber || "—"),
    aircraftId: relId(c.aircraft),
    aircraft: relName(c.aircraft, "Unassigned"),
    hours: Number(c.operatingHours ?? 0),
    flights: Number(c.flightCount ?? 0),
    status: String(c.status || "operational"),
  }));
}

export async function getComponent(id: string) {
  const payload = await getPayloadClient();
  let component: AnyDoc;
  try {
    component = asDoc(
      await payload.findByID({
        collection: "components",
        id,
        depth: 0,
        overrideAccess: true,
      }),
    );
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }

  return {
    id: String(component.id),
    name: String(component.name || ""),
    componentType: String(component.componentType || "other"),
    manufacturer: String(component.manufacturer || ""),
    model: String(component.model || ""),
    serial: String(component.serialNumber || ""),
    aircraftId: relId(component.aircraft),
    hours: Number(component.operatingHours ?? 0),
    flights: Number(component.flightCount ?? 0),
    status: String(component.status || "operational"),
  };
}

export async function listEquipment() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "equipment",
    limit: 200,
    sort: "-updatedAt",
    depth: 1,
    overrideAccess: true,
  });

  return asDocs(result.docs).map((item) => ({
    id: String(item.id),
    name: String(item.name || ""),
    equipmentType: String(item.equipmentType || ""),
    manufacturer: String(item.manufacturer || "—"),
    model: String(item.model || "—"),
    serial: String(item.serialNumber || "—"),
    assignedUser: String(item.assignedUser || "—"),
    aircraftId: relId(item.aircraft),
    aircraft: relName(item.aircraft, "—"),
    hours: Number(item.flightHours ?? 0),
    status: String(item.status || "operational"),
  }));
}

export async function getEquipment(id: string) {
  const payload = await getPayloadClient();
  let item: AnyDoc;
  try {
    item = asDoc(
      await payload.findByID({
        collection: "equipment",
        id,
        depth: 0,
        overrideAccess: true,
      }),
    );
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }

  return {
    id: String(item.id),
    name: String(item.name || ""),
    equipmentType: String(item.equipmentType || "other"),
    manufacturer: String(item.manufacturer || ""),
    model: String(item.model || ""),
    serial: String(item.serialNumber || ""),
    assignedUser: String(item.assignedUser || ""),
    aircraftId: relId(item.aircraft),
    hours: Number(item.flightHours ?? 0),
    status: String(item.status || "operational"),
  };
}

export async function listInspections() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "inspections",
    limit: 200,
    sort: "dueDate",
    overrideAccess: true,
  });

  const docs = asDocs(result.docs) as never /*fix */;
  return {
    counts: {
      overdue: docs.filter((d) => d.status === "overdue").length,
      due: docs.filter((d) => d.status === "due").length,
      scheduled: docs.filter((d) => d.status === "scheduled").length,
      passed: docs.filter((d) => d.status === "passed").length,
      failed: docs.filter((d) => d.status === "failed").length,
    },
    rows: docs.map((d) => ({
      id: String(d.id),
      title: String(d.title || ""),
      assetType: String(d.assetType || ""),
      assetId: String(d.assetId || ""),
      status: String(d.status || ""),
      dueDate: d.dueDate ? String(d.dueDate).slice(0, 10) : "—",
    })),
  };
}

export async function listChecklists() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "checklists",
    limit: 100,
    sort: "name",
    overrideAccess: true,
  }).catch(() => ({ docs: [] as AnyDoc[], totalDocs: 0 }));

  return asDocs(result.docs).map((c) => ({
    id: String(c.id),
    name: String(c.name || ""),
    checklistType: String(c.checklistType || ""),
    itemCount: Array.isArray(c.items) ? c.items.length : 0,
  }));
}

export async function listRiskAssessments() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "risk-assessments",
    limit: 100,
    sort: "-updatedAt",
    depth: 1,
    overrideAccess: true,
  }).catch(() => ({ docs: [] as AnyDoc[], totalDocs: 0 }));

  return asDocs(result.docs).map((r) => ({
    id: String(r.id),
    title: String(r.title || ""),
    mission: relName(r.mission, "—"),
    riskLevel: String(r.riskLevel || ""),
    status: String(r.status || ""),
    responsible: String(r.responsiblePerson || "—"),
  }));
}

export async function listNotifications() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "notifications",
    limit: 100,
    sort: "-createdAt",
    overrideAccess: true,
  }).catch(() => ({ docs: [] as AnyDoc[], totalDocs: 0 }));

  return asDocs(result.docs).map((n) => ({
    id: String(n.id),
    title: String(n.title || ""),
    body: String(n.body || ""),
    type: String(n.type || ""),
    severity: String(n.severity || "info"),
    read: Boolean(n.read),
    createdAt: n.createdAt ? String(n.createdAt).slice(0, 19).replace("T", " ") : "—",
  }));
}

export async function listAuditEvents() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "audit-events",
    limit: 100,
    sort: "-createdAt",
    overrideAccess: true,
  }).catch(() => ({ docs: [] as AnyDoc[], totalDocs: 0 }));

  return asDocs(result.docs).map((e) => ({
    id: String(e.id),
    action: String(e.action || ""),
    actor: String(e.actorEmail || "system"),
    entityType: String(e.entityType || ""),
    entityId: String(e.entityId || ""),
    createdAt: e.createdAt ? String(e.createdAt).slice(0, 19).replace("T", " ") : "—",
  }));
}

export async function listUsers() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "users",
    limit: 100,
    sort: "email",
    overrideAccess: true,
  });

  return asDocs(result.docs).map((u) => ({
    id: String(u.id),
    name: String(u.name || u.email || ""),
    email: String(u.email || ""),
    role: String(u.role || "viewer"),
  }));
}

export async function listFlightFormOptions() {
  const payload = await getPayloadClient();
  const [pilots, aircraft, batteries, projects, missions] = await Promise.all([
    payload.find({ collection: "operators", limit: 100, sort: "fullName", overrideAccess: true }),
    payload.find({ collection: "aircraft", limit: 100, sort: "name", overrideAccess: true }),
    payload.find({ collection: "batteries", limit: 100, sort: "name", overrideAccess: true }),
    payload.find({ collection: "projects", limit: 100, sort: "name", overrideAccess: true }),
    payload.find({ collection: "missions", limit: 100, sort: "name", overrideAccess: true }),
  ]);

  return {
    pilots: asDocs(pilots.docs).map((d) => ({ id: String(d.id), label: String(d.fullName || d.id) })),
    aircraft: asDocs(aircraft.docs).map((d) => ({ id: String(d.id), label: String(d.name || d.registration || d.id) })),
    batteries: asDocs(batteries.docs).map((d) => ({ id: String(d.id), label: String(d.name || d.serialNumber || d.id) })),
    projects: asDocs(projects.docs).map((d) => ({ id: String(d.id), label: String(d.name || d.id) })),
    missions: asDocs(missions.docs).map((d) => ({ id: String(d.id), label: String(d.name || d.code || d.id) })),
  };
}
