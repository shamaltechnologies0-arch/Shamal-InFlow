/**
 * @deprecated UI pages now read from Payload/Mongo via `src/lib/data.ts`.
 * Kept only for leftover chart experiments — do not add new mock consumers.
 */
export const kpis = {
  totalFlights: 2847,
  flightHours: 4126.5,
  activePilots: 18,
  activeDrones: 14,
  openIncidents: 2,
  upcomingMaintenance: 6,
  overdueInspections: 1,
  batteryAlerts: 3,
};

export const flightActivity = [
  { date: "Sep 17", flights: 42, hours: 58 },
  { date: "Sep 18", flights: 38, hours: 51 },
  { date: "Sep 19", flights: 45, hours: 62 },
  { date: "Sep 20", flights: 31, hours: 44 },
  { date: "Sep 21", flights: 28, hours: 39 },
  { date: "Sep 22", flights: 52, hours: 71 },
  { date: "Sep 23", flights: 48, hours: 66 },
  { date: "Sep 24", flights: 44, hours: 60 },
  { date: "Sep 25", flights: 39, hours: 54 },
  { date: "Sep 26", flights: 47, hours: 65 },
  { date: "Sep 27", flights: 41, hours: 57 },
  { date: "Sep 28", flights: 36, hours: 49 },
  { date: "Sep 29", flights: 50, hours: 68 },
  { date: "Sep 30", flights: 33, hours: 46 },
];

export const fleetStatus = [
  { status: "Airworthy", count: 9 },
  { status: "Maintenance", count: 3 },
  { status: "Standby", count: 2 },
  { status: "Grounded", count: 1 },
];

export const batteryHealth = [
  { id: "BAT-NEOM-01", aircraft: "M300-NEOM-04", health: 94, cycles: 142, status: "operational" },
  { id: "BAT-EP-07", aircraft: "M350-DMM-02", health: 78, cycles: 218, status: "warning" },
  { id: "BAT-RYD-03", aircraft: "M30T-RYD-01", health: 91, cycles: 167, status: "operational" },
  { id: "BAT-NEOM-08", aircraft: "M300-NEOM-02", health: 65, cycles: 289, status: "critical" },
  { id: "BAT-JUB-02", aircraft: "M350-JUB-01", health: 88, cycles: 195, status: "operational" },
  { id: "BAT-DMM-05", aircraft: "M30T-DMM-03", health: 82, cycles: 204, status: "warning" },
];

export const pilotActivity = [
  { name: "Fahad Al-Rashid", flights: 12, hours: 18.5, status: "active" },
  { name: "Noura Al-Qahtani", flights: 9, hours: 14.2, status: "active" },
  { name: "Khalid Al-Harbi", flights: 7, hours: 11.0, status: "standby" },
  { name: "Sara Al-Dossary", flights: 10, hours: 15.8, status: "active" },
  { name: "Omar Al-Zahrani", flights: 4, hours: 6.5, status: "training" },
];

export const missionStatus = [
  { state: "Planning", count: 4 },
  { state: "Preflight", count: 3 },
  { state: "In Flight", count: 2 },
  { state: "Postflight", count: 5 },
  { state: "Closed", count: 28 },
];

export const complianceScore = {
  overall: 92,
  breakdown: [
    { label: "Pilot Currency", score: 96 },
    { label: "Airworthiness", score: 88 },
    { label: "Documentation", score: 94 },
    { label: "Battery Program", score: 90 },
  ],
};

export type RecentFlight = {
  id: string;
  pilot: string;
  aircraft: string;
  duration: string;
  project: string;
  status: string;
  date: string;
};

export const recentFlights: RecentFlight[] = [
  { id: "FLT-2025-1842", pilot: "Fahad Al-Rashid", aircraft: "M300-NEOM-04", duration: "1h 42m", project: "NEOM Coastal Survey", status: "completed", date: "2025-09-30" },
  { id: "FLT-2025-1841", pilot: "Noura Al-Qahtani", aircraft: "M350-DMM-02", duration: "2h 05m", project: "Eastern Province Pipeline", status: "completed", date: "2025-09-30" },
  { id: "FLT-2025-1840", pilot: "Sara Al-Dossary", aircraft: "M30T-RYD-01", duration: "0h 58m", project: "Riyadh Metro Phase 2", status: "in_progress", date: "2025-09-30" },
  { id: "FLT-2025-1839", pilot: "Khalid Al-Harbi", aircraft: "M300-NEOM-02", duration: "1h 15m", project: "NEOM Coastal Survey", status: "completed", date: "2025-09-29" },
  { id: "FLT-2025-1838", pilot: "Omar Al-Zahrani", aircraft: "M350-JUB-01", duration: "1h 30m", project: "Jubail Industrial Inspect", status: "completed", date: "2025-09-29" },
];

export const activeAlerts = [
  { id: "ALT-901", severity: "critical", message: "BAT-NEOM-08 cell imbalance exceeds threshold", time: "12 min ago" },
  { id: "ALT-900", severity: "warning", message: "M350-DMM-02 100h inspection due in 48h", time: "1h ago" },
  { id: "ALT-899", severity: "info", message: "NOTAM active: NEOM Sector B restricted 14:00-16:00", time: "2h ago" },
  { id: "ALT-898", severity: "warning", message: "GCS link degradation logged on FLT-2025-1836", time: "3h ago" },
];

export const upcomingTasks = [
  { id: "TSK-441", title: "Prop balance check M300-NEOM-04", due: "Oct 1, 2025", owner: "Maintenance" },
  { id: "TSK-440", title: "Renew ops manual amendment 4.2", due: "Oct 3, 2025", owner: "Compliance" },
  { id: "TSK-439", title: "Pilot recurrency sim — Omar Al-Zahrani", due: "Oct 5, 2025", owner: "Training" },
  { id: "TSK-438", title: "Firmware validation M350 fleet", due: "Oct 7, 2025", owner: "Engineering" },
];

export const flightsTable = [
  { id: "FLT-2025-1842", date: "2025-09-30", pilot: "Fahad Al-Rashid", aircraft: "M300-NEOM-04", project: "NEOM Coastal Survey", duration: "1h 42m", location: "NEOM Sector A", status: "completed" },
  { id: "FLT-2025-1841", date: "2025-09-30", pilot: "Noura Al-Qahtani", aircraft: "M350-DMM-02", project: "Eastern Province Pipeline", duration: "2h 05m", location: "Dammam Corridor", status: "completed" },
  { id: "FLT-2025-1840", date: "2025-09-30", pilot: "Sara Al-Dossary", aircraft: "M30T-RYD-01", project: "Riyadh Metro Phase 2", duration: "0h 58m", location: "King Salman Park", status: "in_progress" },
  { id: "FLT-2025-1839", date: "2025-09-29", pilot: "Khalid Al-Harbi", aircraft: "M300-NEOM-02", project: "NEOM Coastal Survey", duration: "1h 15m", location: "NEOM Sector B", status: "completed" },
  { id: "FLT-2025-1838", date: "2025-09-29", pilot: "Omar Al-Zahrani", aircraft: "M350-JUB-01", project: "Jubail Industrial Inspect", duration: "1h 30m", location: "Jubail Industrial City", status: "completed" },
  { id: "FLT-2025-1837", date: "2025-09-29", pilot: "Fahad Al-Rashid", aircraft: "M300-NEOM-04", project: "NEOM Coastal Survey", duration: "2h 10m", location: "NEOM Sector A", status: "completed" },
  { id: "FLT-2025-1836", date: "2025-09-28", pilot: "Noura Al-Qahtani", aircraft: "M350-DMM-02", project: "Eastern Province Pipeline", duration: "1h 48m", location: "Khobar Offshore", status: "completed" },
  { id: "FLT-2025-1835", date: "2025-09-28", pilot: "Sara Al-Dossary", aircraft: "M30T-RYD-01", project: "Riyadh Metro Phase 2", duration: "1h 22m", location: "Diriyah Gate", status: "completed" },
  { id: "FLT-2025-1834", date: "2025-09-27", pilot: "Khalid Al-Harbi", aircraft: "M300-NEOM-02", project: "Tabuk Solar Array", duration: "1h 55m", location: "Tabuk NEOM Link", status: "aborted" },
  { id: "FLT-2025-1833", date: "2025-09-27", pilot: "Fahad Al-Rashid", aircraft: "M300-NEOM-04", project: "NEOM Coastal Survey", duration: "1h 38m", location: "NEOM Sector C", status: "completed" },
  { id: "FLT-2025-1832", date: "2025-09-26", pilot: "Noura Al-Qahtani", aircraft: "M350-DMM-02", project: "Eastern Province Pipeline", duration: "2h 02m", location: "Dammam Corridor", status: "completed" },
  { id: "FLT-2025-1831", date: "2025-09-26", pilot: "Omar Al-Zahrani", aircraft: "M350-JUB-01", project: "Jubail Industrial Inspect", duration: "1h 12m", location: "Jubail Industrial City", status: "completed" },
];

export const missions = [
  { id: "MSN-NEOM-88", name: "NEOM Coastal LIDAR Block 7", project: "NEOM Coastal Survey", lead: "Fahad Al-Rashid", workflow: "In Flight", aircraft: "M300-NEOM-04", scheduled: "2025-09-30" },
  { id: "MSN-EP-44", name: "Pipeline ROW Thermal Scan", project: "Eastern Province Pipeline", lead: "Noura Al-Qahtani", workflow: "Postflight", aircraft: "M350-DMM-02", scheduled: "2025-09-30" },
  { id: "MSN-RYD-31", name: "Metro Alignment QC", project: "Riyadh Metro Phase 2", lead: "Sara Al-Dossary", workflow: "Preflight", aircraft: "M30T-RYD-01", scheduled: "2025-09-30" },
  { id: "MSN-JUB-19", name: "Stack Emissions Visual", project: "Jubail Industrial Inspect", lead: "Omar Al-Zahrani", workflow: "Planning", aircraft: "M350-JUB-01", scheduled: "2025-10-02" },
  { id: "MSN-TBK-07", name: "Solar Array Progress", project: "Tabuk Solar Array", lead: "Khalid Al-Harbi", workflow: "Planning", aircraft: "M300-NEOM-02", scheduled: "2025-10-04" },
  { id: "MSN-NEOM-87", name: "NEOM Coastal LIDAR Block 6", project: "NEOM Coastal Survey", lead: "Fahad Al-Rashid", workflow: "Closed", aircraft: "M300-NEOM-04", scheduled: "2025-09-28" },
  { id: "MSN-EP-43", name: "Khobar Offshore Patrol", project: "Eastern Province Pipeline", lead: "Noura Al-Qahtani", workflow: "Closed", aircraft: "M350-DMM-02", scheduled: "2025-09-27" },
  { id: "MSN-RYD-30", name: "Diriyah Heritage Mesh", project: "Riyadh Metro Phase 2", lead: "Sara Al-Dossary", workflow: "Closed", aircraft: "M30T-RYD-01", scheduled: "2025-09-26" },
];

export const aircraft = [
  { id: "AC-ALPHA", name: "ALPHA", model: "Matrice 30 / DJI", tail: "ALPHA", flights: 1030, flyingTime: "328:22:31", hours: 328.4, legalId: "KSA-67556", serial: "1581F5BKD228Q00A03M9", status: "Airworthy", owner: "Shamal Technologies", base: "NEOM Ops Hub", active: true },
  { id: "AC-ASSILA", name: "Assila", model: "Matrice 300 RTK / DJI", tail: "Assila", flights: 486, flyingTime: "142:08:12", hours: 142.1, legalId: "KSA-44219", serial: "1ZNDH19800824N", status: "Airworthy", owner: "Shamal Technologies", base: "Dammam Field", active: true },
  { id: "AC-BTC", name: "BTC", model: "Matrice 350 RTK / DJI", tail: "BTC", flights: 312, flyingTime: "98:44:05", hours: 98.7, legalId: "KSA-88301", serial: "1581F6BHD22AQ00B11K2", status: "Maintenance", owner: "Shamal Technologies", base: "Riyadh Central", active: true },
  { id: "AC-M300-NEOM-04", name: "M300-NEOM-04", model: "Matrice 300 RTK / DJI", tail: "M300-NEOM-04", flights: 742, flyingTime: "412:18:00", hours: 412.3, legalId: "KSA-11024", serial: "1ZNDH19800891A", status: "Airworthy", owner: "Shamal Technologies", base: "NEOM Ops Hub", active: true },
  { id: "AC-M350-DMM-02", name: "M350-DMM-02", model: "Matrice 350 RTK / DJI", tail: "M350-DMM-02", flights: 501, flyingTime: "287:36:00", hours: 287.6, legalId: "KSA-22011", serial: "1ZNDH19800902B", status: "Maintenance", owner: "Shamal Technologies", base: "Dammam Field", active: true },
  { id: "AC-M30T-RYD-01", name: "M30T-RYD-01", model: "Matrice 30T / DJI", tail: "M30T-RYD-01", flights: 388, flyingTime: "198:24:00", hours: 198.4, legalId: "KSA-33048", serial: "1581F5BKD228Q00C04P1", status: "Airworthy", owner: "Shamal Technologies", base: "Riyadh Central", active: true },
  { id: "AC-M300-NEOM-02", name: "M300-NEOM-02", model: "Matrice 300 RTK / DJI", tail: "M300-NEOM-02", flights: 910, flyingTime: "521:48:00", hours: 521.8, legalId: "KSA-11025", serial: "1ZNDH19800891C", status: "Airworthy", owner: "Shamal Technologies", base: "NEOM Ops Hub", active: true },
  { id: "AC-M350-JUB-01", name: "M350-JUB-01", model: "Matrice 350 RTK / DJI", tail: "M350-JUB-01", flights: 210, flyingTime: "156:12:00", hours: 156.2, legalId: "KSA-55077", serial: "1ZNDH19800955D", status: "Retired", owner: "Shamal Technologies", base: "Jubail Industrial", active: false },
  { id: "AC-M30T-DMM-03", name: "M30T-DMM-03", model: "Matrice 30T / DJI", tail: "M30T-DMM-03", flights: 604, flyingTime: "344:06:00", hours: 344.1, legalId: "KSA-33049", serial: "1581F5BKD228Q00D05Q2", status: "Retired", owner: "Shamal Technologies", base: "Dammam Field", active: false },
];

export const batteries = batteryHealth;

export const operators = [
  { id: "OP-001", name: "Fahad Al-Rashid", role: "Chief Pilot", currency: "Current", flights30d: 28, base: "NEOM Ops Hub" },
  { id: "OP-002", name: "Noura Al-Qahtani", role: "Senior Pilot", currency: "Current", flights30d: 24, base: "Dammam Field" },
  { id: "OP-003", name: "Khalid Al-Harbi", role: "Pilot", currency: "Due 14d", flights30d: 18, base: "NEOM Ops Hub" },
  { id: "OP-004", name: "Sara Al-Dossary", role: "Senior Pilot", currency: "Current", flights30d: 22, base: "Riyadh Central" },
  { id: "OP-005", name: "Omar Al-Zahrani", role: "Pilot Trainee", currency: "Sim Required", flights30d: 9, base: "Jubail Industrial" },
];

export const maintenanceItems = [
  { id: "MX-2201", asset: "M350-DMM-02", type: "100h Inspection", status: "In Progress", due: "2025-10-01", priority: "high" },
  { id: "MX-2200", asset: "M30T-DMM-03", type: "Motor replacement", status: "Scheduled", due: "2025-10-03", priority: "critical" },
  { id: "MX-2199", asset: "M300-NEOM-04", type: "Prop balance", status: "Scheduled", due: "2025-10-01", priority: "medium" },
  { id: "MX-2198", asset: "GCS-DMM-01", type: "Firmware update", status: "Completed", due: "2025-09-28", priority: "low" },
  { id: "MX-2197", asset: "M300-NEOM-02", type: "Gimbal calibration", status: "Awaiting Parts", due: "2025-10-08", priority: "medium" },
];

export const incidents = [
  { id: "INC-2025-014", title: "RTL triggered — gust front NEOM B", severity: "medium", status: "open", date: "2025-09-29", reporter: "Fahad Al-Rashid" },
  { id: "INC-2025-013", title: "Battery thermal warning on ground", severity: "high", status: "open", date: "2025-09-28", reporter: "Noura Al-Qahtani" },
  { id: "INC-2025-012", title: "Near-miss with crane boom — Riyadh", severity: "low", status: "closed", date: "2025-09-20", reporter: "Sara Al-Dossary" },
];

export const projects = [
  { id: "PRJ-NEOM-01", name: "24h Flight Test in KAUST", client: "KAUST", flights: 8, lastFlight: "2025-10-15 16:37:00", revenue: 0, shared: true, status: "active", region: "Thuwal" },
  { id: "PRJ-ABH-01", name: "Abha Project (KLS-P-001)", client: "KLS", flights: 24, lastFlight: "2025-09-28 11:12:00", revenue: 0, shared: true, status: "active", region: "Abha" },
  { id: "PRJ-ACW-01", name: "ACWA Power Sudair (QSN-I-005)", client: "ACWA Power", flights: 56, lastFlight: "2025-10-02 09:45:00", revenue: 0, shared: true, status: "active", region: "Sudair" },
  { id: "PRJ-ULA-01", name: "Al Ula Vegetation (ULA-S-001)", client: "RCU", flights: 41, lastFlight: "2025-09-30 14:22:00", revenue: 0, shared: true, status: "active", region: "AlUla" },
  { id: "PRJ-NEOM-02", name: "NEOM Coastal Survey", client: "NEOM Company", flights: 842, lastFlight: "2025-09-30 18:05:00", revenue: 0, shared: true, status: "active", region: "Tabuk / NEOM" },
  { id: "PRJ-EP-02", name: "Eastern Province Pipeline", client: "Aramco JV", flights: 612, lastFlight: "2025-09-30 17:40:00", revenue: 0, shared: true, status: "active", region: "Eastern Province" },
  { id: "PRJ-RYD-03", name: "Riyadh Metro Phase 2", client: "RCRC", flights: 388, lastFlight: "2025-09-30 16:10:00", revenue: 0, shared: true, status: "active", region: "Riyadh" },
  { id: "PRJ-JUB-04", name: "Jubail Industrial Inspect", client: "SABIC", flights: 201, lastFlight: "2025-09-29 13:55:00", revenue: 0, shared: true, status: "active", region: "Jubail" },
];

export const documents = [
  { id: "DOC-OPS-01", name: "Operations Manual v4.2", type: "Manual", expiry: "2026-03-15", status: "valid" },
  { id: "DOC-INS-12", name: "M350-DMM-02 Airworthiness", type: "Certificate", expiry: "2025-11-01", status: "valid" },
  { id: "DOC-INS-09", name: "M30T-DMM-03 Annual Review", type: "Inspection", expiry: "2025-09-15", status: "expired" },
  { id: "DOC-TRN-04", name: "Pilot Training Syllabus", type: "Training", expiry: "2026-01-20", status: "valid" },
];

export const liveFeed = [
  { time: "19:42", event: "FLT-2025-1840 entered Riyadh Metro corridor", type: "flight" },
  { time: "19:38", event: "Mission MSN-EP-44 marked Postflight", type: "mission" },
  { time: "19:31", event: "Battery BAT-NEOM-08 alert acknowledged", type: "alert" },
  { time: "19:24", event: "M350-DMM-02 maintenance ticket MX-2201 updated", type: "maintenance" },
  { time: "19:18", event: "GCS heartbeat restored — Dammam Field", type: "system" },
];

export const altitudeProfile = [
  { t: "0", alt: 0 },
  { t: "5", alt: 45 },
  { t: "10", alt: 92 },
  { t: "15", alt: 120 },
  { t: "20", alt: 118 },
  { t: "25", alt: 95 },
  { t: "30", alt: 110 },
  { t: "35", alt: 85 },
  { t: "40", alt: 40 },
  { t: "45", alt: 0 },
];

export function getFlightById(id: string) {
  return flightsTable.find((f) => f.id === id) ?? flightsTable[0];
}

export function getAircraftById(id: string) {
  return aircraft.find((a) => a.id === id || a.tail === id) ?? aircraft[0];
}
