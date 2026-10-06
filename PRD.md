# Shamal InFlow — Product Requirements Document (PRD)

**Product:** Shamal InFlow  
**Owner:** Shamal Technologies  
**Document type:** Master Product Requirements Document  
**Version:** 1.0  
**Status:** Approved for foundation planning  
**Audience:** Product, Engineering, Design, Operations, Stakeholders  
**Hosting posture:** Vercel-first  
**Primary stack:** Next.js · PayloadCMS · MongoDB Atlas · AWS S3  

---

## 1. Executive Summary

Shamal InFlow is a **UAV Operations Management & Digital Flight Intelligence Platform**. It is not a CRM, not a generic project tracker, and not a consumer drone app.

It is an **aerospace-grade operational system** for organizations that fly drones at scale — designed to feel like a fusion of air traffic control, DJI FlightHub 2, Palantir Foundry, ArcGIS Enterprise, and modern enterprise SaaS (Linear, Stripe, Vercel, Notion).

**One sentence definition**

> Shamal InFlow turns every flight into the source of truth that updates fleet, batteries, pilots, maintenance, inspections, compliance, notifications, and reporting.

**Primary users**

- Drone Pilots / UAV Operators  
- Operations Managers  
- Maintenance Teams  
- Compliance Officers / Safety Teams  
- Enterprise Organizations (energy, infrastructure, government, large UAV service providers)

**Strategic fit**

Built for environments comparable to Saudi Aramco, NEOM, government agencies, critical infrastructure operators, and professional UAV fleets in Saudi Arabia and global markets.

---

## 2. Product Vision & North Star

### Vision

Become the operational command platform for professional UAV operations — where missions, flights, assets, people, compliance, and intelligence live in one coherent system.

### North Star Metric

**Operational Truth Completeness**

% of completed flights that automatically and correctly update:

1. Pilot currency / hours  
2. Aircraft usage  
3. Battery cycle / health signals  
4. Inspection & maintenance counters  
5. Compliance evaluation  
6. Operational timeline / audit trail  

If Flight Completion works, InFlow works. Dashboards are consumers of that truth — not the product itself.

### Design feeling (non-negotiable)

The UI must feel like:

- “Palantir for Drone Operations”  
- “DJI FlightHub 2 meets ArcGIS Enterprise”  
- A premium aerospace-grade UAV command platform  

**Not:** typical CRM chrome, consumer app styling, gaming UI, neon cyberpunk, orange accents, cartoon widgets, or excessive gradients.

---

## 3. Constraints & Hosting Reality (Locked Decisions)

These are product and engineering constraints, not preferences.

| Constraint | Decision |
|---|---|
| Web hosting | **Vercel** (Shamal standard) |
| Application framework | **Next.js (App Router) + TypeScript** |
| CMS / backend application layer | **PayloadCMS** (MongoDB adapter) |
| Primary database | **MongoDB Atlas** (start on **M0 free tier**) |
| Object storage | **AWS S3** (Shamal media infrastructure) |
| Brand | **Shamal Technologies only** |
| UI scope | Full enterprise command-center UI as defined in this PRD |

### 3.1 What “Vercel-first” means

Vercel hosts:

- Next.js web application  
- PayloadCMS admin + API routes / custom endpoints that fit serverless constraints  
- Preview deployments, edge delivery, env management  

Vercel does **not** become a long-running flight-parsing supercomputer.

**Rule:** User-facing requests stay fast. Heavy work (flight import, telemetry parse, PDF/report generation, large media processing, aggregations) is designed as **async jobs** from day one — even if the first worker implementation is minimal.

### 3.2 MongoDB M0 — plan with eyes open

M0 is acceptable for **foundation / early MVP / design-system / internal demos**. It is **not** production scale for large fleets or heavy telemetry.

| M0 reality | Product implication |
|---|---|
| ~512 MB storage | Store **metadata in Mongo**, **files/telemetry in S3** |
| Shared resources / connection limits | Keep connection pooling disciplined; avoid chatty serverless DB patterns |
| No enterprise backup posture | Treat early data as non-critical until Atlas is upgraded |
| Limited compute for heavy aggregations | Prefer pre-aggregated stats collections early |

**Upgrade trigger (explicit):** move beyond M0 when any of these hit:

- Sustained multi-org usage  
- Flight import volume grows  
- Dashboard latency becomes unacceptable  
- Storage approaches M0 ceiling  
- Customer requires backup/SLA  

### 3.3 PayloadCMS role

Payload is the **application backend spine**, not “a blog CMS bolted on.”

Use Payload for:

- Collections / data model  
- Auth (users, roles)  
- Admin tooling where useful  
- Access control hooks  
- Custom endpoints for operational APIs  
- Media references coordinated with S3  

Do **not** force every operational UX through Payload Admin. The product UI is a custom Next.js command center. Payload Admin is for configuration/ops, not the pilot/ops experience.

### 3.4 Preferred architecture stance (authoritative)

For Shamal InFlow under current Shamal hosting reality:

1. **MongoDB Atlas** = operational source of truth  
2. **AWS S3** = files, flight logs, photos, PDFs, evidence  
3. **Vercel** = web + API edge / application layer  
4. **PayloadCMS** = domain collections, auth, access, admin/config  
5. **Async workers** (later dedicated host) = import/parse/report/notify  
6. **Modular monolith first** — not microservices  

Geospatial: start with **MongoDB GeoJSON + MapLibre**. Introduce specialized GIS processing only if advanced spatial analysis outgrows Mongo.

---

## 4. Goals & Non-Goals

### 4.1 Goals (V1–V1.5)

1. Establish a coherent **operational data engine** around Flight as the central event.  
2. Deliver a **premium desktop command-center UI** matching brand and design language.  
3. Support core modules: Dashboard, Flights, Missions, Fleet (Aircraft/Batteries/Components/Equipment), Maintenance/Inspections, Operators, Incidents, Projects, Documents, Reports, Integrations (foundation), Administration.  
4. Make **Flight Completion** automatically update related operational state.  
5. Support **one real flight import path** (DJI first) via adapter → canonical flight.  
6. Multi-organization aware data model (`organizationId`) from day one.  
7. Light/Dark mode, Arabic-capable typography (Tajawal) readiness.  
8. Mobile companion (field-first) as a later phase — design for offline early, implement after core web engine.

### 4.2 Non-Goals (explicitly out of first production cut)

- Building 20 microservices  
- Supporting every OEM integration on day one  
- Storing full high-rate telemetry blobs inside Mongo documents  
- Running heavy parse pipelines synchronously on Vercel requests  
- Consumer marketplace / social features  
- Replacing specialized GIS desktop software (ArcGIS Pro, QGIS)  
- Full offline-first mobile in the same release as web MVP  
- Hard-coding GACA rules into application code (rules must be configurable)

---

## 5. Personas & Jobs To Be Done

| Persona | Primary job | Success looks like |
|---|---|---|
| Pilot / Operator | Log flights, run checklists, report incidents | Fast, field-ready flows; clear currency status |
| Operations Manager | Plan missions, assign assets/pilots, monitor day | Mission workflow + live operational picture |
| Maintenance Tech | Inspect, maintain, ground/release assets | Clear due status, worksheets, history |
| Compliance / Safety | Prove readiness, catch violations early | Expiry/violation command center with severity |
| Fleet Manager | Aircraft/battery/component health | Asset lifecycle + battery intelligence |
| Executive / Enterprise Admin | Oversight, reports, governance | Dense but calm executive dashboards & exports |

---

## 6. Brand & Design System Requirements

### 6.1 Brand colors

| Token | Value | Usage |
|---|---|---|
| Primary Navy | `#0A3254` | Primary actions, nav emphasis, key headers |
| Secondary Blue | `#226093` | Links, secondary actions, chart accents |
| Neutral Gray | `#939598` | Muted text, borders, meta |
| Background | `#F7F9FC` | App background (light) |
| Surface | `#FFFFFF` | Cards/panels/tables |
| Dark Mode | `#071E33` | Dark canvas / elevated dark surfaces |

### 6.2 Typography

- **Geist Sans** — primary UI  
- **Inter** — fallback / dense tables if needed  
- **Tajawal** — Arabic  

### 6.3 Design language

- Premium, clean, enterprise, aerospace, geospatial, data-driven, minimal, executive  
- Soft shadows, 12px radius, glassmorphism **accents** (not glass everywhere)  
- Spatial depth and layered hierarchy  
- Dense enterprise tables; calm micro-interactions  
- GIS-forward map experiences  

### 6.4 Forbidden

Orange · gaming aesthetics · neon cyberpunk · excessive gradients · cartoon UI · consumer-app chrome · generic purple SaaS tropes  

### 6.5 Layout shell (desktop-first)

**Top navigation**

- Global search  
- Notifications  
- Quick actions  
- User menu  
- Theme toggle (light/dark)

**Left sidebar (collapsible)**

1. Dashboard  
2. Flights  
3. Missions  
4. Fleet  
5. Maintenance  
6. Operators  
7. Incidents  
8. Projects  
9. Documents  
10. Reports  
11. Integrations  
12. Administration  

Every screen must feel suitable for Aramco / NEOM / government / critical infrastructure operators.

---

## 7. Information Architecture & Module Requirements

### 7.1 Dashboard — Operations Center

**KPI cards**

- Total Flights  
- Flight Hours  
- Active Pilots  
- Active Drones  
- Open Incidents  
- Upcoming Maintenance  
- Overdue Inspections  
- Battery Alerts  

**Widgets**

- Flight Activity Timeline  
- Fleet Status Overview  
- Battery Health Analytics  
- Pilot Activity Chart  
- Mission Status Chart  
- Compliance Score Widget  
- Recent Flight Logs  
- Active Alerts  
- Upcoming Tasks  
- Interactive map / flight density heatmap  
- Live activity feed  

**Engineering note:** Dashboard reads from **statistics / aggregate collections**, not 15-collection live joins on every page load.

---

### 7.2 Flights Module

**Views**

- Flight Table (enterprise table)  
- Flight Details (split-screen)  
- Flight Playback  
- Flight Import  

**Flight Detail must include**

- Large GIS map + path replay  
- Altitude profile  
- Flight statistics  
- Weather  
- Pilot / drone / battery panels  
- Mission & incident linkage  

**Canonical rule**

External providers (DJI, Pixhawk, etc.) never define the schema. Adapters produce a **CanonicalFlight**. InFlow owns the model.

**Data split (mandatory)**

- `flights` → metadata, stats, relations, status  
- `flight_tracks` → geometry / simplified track reference  
- `flight_events` → discrete operational events  
- raw files → **S3 only**  

Never embed hundreds of thousands of GPS points in the flight document.

---

### 7.3 Mission Control

Mission planning as aviation mission center:

- Interactive map + boundaries  
- Risk assessments  
- Checklists  
- Approvals  
- Operational restrictions  
- Workflow visualization cards  

**Default workflow**

`Draft → Submitted → Under Review → Approved → Assigned → In Progress → Completed → Closed`

Workflows must be **configurable** (organization-level definitions), not hardcoded forever.

---

### 7.4 Fleet Management

UI terminology: **Fleet**  
Internal model: **Assets** with types:

- Aircraft (Drones)  
- Batteries  
- Components  
- Equipment  

**Aircraft detail**

- Hero aircraft card (image, status, hours, flight count, inspection/maintenance/component status)  
- Tabs: Overview · Flights · Components · Maintenance · Documents · Compliance  
- Operational Timeline (chronological asset history)

Statuses (maintenance/fleet context): Operational · Inspection Due · Maintenance Due · Grounded · Retired  

---

### 7.5 Battery Intelligence

Dedicated aviation-grade battery analytics:

- Health score  
- Cycle count  
- Charge history  
- Performance graphs  
- Replacement forecast / aging visualization  

Battery updates must be driven primarily by **FlightCompleted** (and charge events when available), not manual guesswork.

---

### 7.6 Maintenance & Inspections

Views: Calendar · Kanban · Table · Timeline  

Shared against assets (aircraft, battery, component, equipment) so maintenance architecture is not duplicated per asset type.

Include schedules, checklists, results, follow-ups, grounding/release.

---

### 7.7 Operators (Crew Profiles)

Airline-crew style profiles:

- Certifications, training, licenses  
- Flight hours & aircraft experience  
- Skills  
- Currency status  
- Visual qualification matrix  

---

### 7.8 Incidents

Create, investigate, attach evidence (S3), link to flight/mission/asset, corrective actions, severity.

---

### 7.9 Compliance Center

Widgets:

- Document expiry  
- License expiry  
- Inspection violations  
- Checklist violations  
- Operational deviations  

Severity levels: **Normal · Warning · Critical**

Compliance is a **rules engine**, not scattered `if` statements in UI and APIs.

---

### 7.10 Projects & Documents

Projects organize missions/flights/customers/locations.  
Documents are versioned metadata in Mongo + files in S3, with expiry and linkage to entities.

---

### 7.11 Reporting

Executive reporting:

- Interactive dashboards  
- PDF generation (async worker)  
- Export options  
- Advanced filters  

Charts: Flight Trends · Fleet Utilization · Pilot Activity · Maintenance Trends · Battery Health · Incident Analysis  

---

### 7.12 Integrations

Foundation for:

- DJI (first)  
- Pixhawk / ArduPilot / Auterion / QGC / Mission Planner (incremental)  
- Webhooks / REST for enterprise later  

Adapter interface conceptually: connect · authenticate · discover · import · parse · normalize · validate · sync  

---

### 7.13 Administration

Organizations, users, roles/permissions, configuration (types, checklists, workflows, custom fields), audit, theme/org settings.

---

### 7.14 Mobile Companion (Phase later)

Field-first React Native (recommended) with:

- Flight logging, checklists, inspections  
- Battery tracking, incident reporting, mission viewing  
- Offline sync (SQLite + idempotent sync queue)  
- Large outdoor-friendly controls  

Web MVP must not block on mobile, but IDs, permissions, and APIs must remain mobile-ready.

---

## 8. Core Domain Model (Engineering PRD)

### 8.1 Relationship graph (source of truth)

```
PROJECT
  └── MISSION
        └── FLIGHT
              ├── PILOT
              ├── AIRCRAFT
              ├── BATTERY
              ├── COMPONENTS / EQUIPMENT
              └── TELEMETRY / EVENTS
                    ├── INSPECTIONS
                    ├── MAINTENANCE
                    ├── COMPLIANCE
                    ├── NOTIFICATIONS
                    ├── REPORTS
                    └── DASHBOARD
```

### 8.2 Asset abstraction

```
Asset
 ├── Aircraft
 ├── Battery
 ├── Component
 └── Equipment
```

Shared concerns on Asset: assignment, usage, inspection, maintenance, documents, incidents, compliance, timeline.

### 8.3 Flight immutability posture

Imported / completed operational flights are **not casual editable CRM records**.

Pipeline:

```
RAW PROVIDER FILE (S3)
  → Import Record
  → Adapter Parse
  → CanonicalFlight
  → Validation + Dedup
  → Operational Flight
  → FlightCompleted events
```

Dedup fingerprint example: `organizationId + source + sourceFlightId + startTime + aircraftSerial` with unique index.

### 8.4 Event-driven automation (internal)

Prefer:

`FlightCompleted` → handlers (pilot, aircraft, battery, equipment, inspection counters, maintenance evaluation, compliance, notifications, aggregates)

Over:

`saveFlight()` that manually updates everything in one brittle procedure.

Use Mongo transactions for **core flight commit**; fan-out side effects asynchronously where possible.

### 8.5 Multi-organization

Every operational document includes `organizationId`. UI may not emphasize “tenancy” language, but the data model must be organization-aware from day one.

---

## 9. Collections (MongoDB / Payload) — Initial Catalogue

**Identity & access**

`users` · `roles` · `permissions` · `organizations` · `departments` · `teams`

**Operations**

`projects` · `customers` · `missions` · `missionAssignments` · `missionApprovals` · `missionChecklists` · `missionRiskAssessments`  
`flights` · `flightTracks` · `flightEvents` · `flightImports`

**Assets**

`aircraft` · `aircraftModels` · `batteries` · `batteryCycles` · `batteryCharges` · `batteryHealth`  
`components` · `componentTypes` · `componentInstallations` · `equipment` · `equipmentTypes` · `equipmentUsage`

**People**

`operators` · `pilotLicenses` · `pilotCertifications` · `pilotTraining` · `pilotSkills`

**Airworthiness / safety**

`inspections` · `inspectionSchedules` · `inspectionTemplates` · `inspectionResults`  
`maintenance` · `maintenanceSchedules` · `maintenanceTasks` · `maintenanceFollowups`  
`incidents` · `investigations` · `correctiveActions`

**Governance**

`documents` · `documentVersions` · `complianceRules` · `complianceEvaluations` · `complianceViolations`  
`notifications` · `notificationRules` · `auditEvents` · `workflows` · `workflowInstances`

**Platform**

`integrations` · `integrationConnections` · `integrationJobs` · `integrationLogs`  
`reports` · `reportJobs` · statistics collections (`organizationStatistics`, `pilotStatistics`, `aircraftStatistics`, `batteryStatistics`, …)

**Indexes (examples — mandatory early)**

- `flights`: `organizationId + startTime`, `+ pilotId`, `+ aircraftId`, `+ missionId`, `+ projectId`, `+ batteryId`, unique fingerprint  
- `maintenance`: `organizationId + status`, `+ assetId`, `+ dueDate`  
- `documents`: `organizationId + expiryDate`, `+ documentType`  
- Geo indexes on takeoff/landing/mission polygons where queried  

---

## 10. API & Security Requirements

### 10.1 API shape

Domain-oriented REST (Payload custom endpoints / Next route handlers as needed):

`/api/v1/auth`  
`/api/v1/flights` · `missions` · `aircraft` · `batteries` · `components` · `equipment`  
`/api/v1/operators` · `inspections` · `maintenance` · `incidents` · `compliance`  
`/api/v1/projects` · `documents` · `reports` · `integrations`  

Every request carries a `request_id` for tracing.

### 10.2 AuthZ model

**RBAC + permission matrix + resource scope** — not `if role === 'admin'` scattered in UI.

Examples:

- `flight.read|create|edit|import|delete`  
- `mission.read|create|approve`  
- `maintenance.read|create|close`  
- `incident.read|create|investigate`  

### 10.3 Security baseline

- Secure session / JWT via Payload auth patterns  
- Org-scoped queries always  
- Signed S3 uploads (presigned URLs) — never stream giant files through Vercel as the durable path  
- Audit events on critical mutations  
- Rate limiting / webhook signatures for external integrations (when introduced)  
- Secrets only in Vercel/AWS env — never in repo  

---

## 11. Storage & Async Processing

### 11.1 S3 owns binaries

Flight logs, photos, videos, PDFs, evidence, exports. Mongo stores: `storageKey`, `bucket`, `mimeType`, `size`, `checksum`, versioning metadata, uploader.

### 11.2 Upload pattern

```
Client → API (presign) → Direct S3 upload → Import/processing job enqueued → Worker processes
```

### 11.3 Workers (phased)

Even on M0/Vercel MVP, **design** job records (`integrationJobs` / `reportJobs`). Execution can start as:

1. Deferred / best-effort processing hooks for tiny files  
2. Then dedicated worker host (ECS/Fargate, Cloud Run, Railway, etc.) + Redis/BullMQ when volume requires  

Jobs: `flight.import|parse|normalize|validate` · `report.generate` · `notification.*` · `dashboard.aggregate`

---

## 12. Maps & GIS UX Requirements

Maps are core product surface, not decoration.

Support:

- Satellite / terrain basemaps (provider TBD; MapLibre-compatible)  
- Flight paths, takeoff/landing points  
- Mission areas / restricted areas  
- Flight replay  

Performance rule: simplify tracks / use optimized geometry for browser; keep raw track in S3 or dedicated track docs.

---

## 13. Tables UX Standard

All major list views:

- Sort, filter, saved views  
- Column customization  
- Bulk actions  
- Export  
- Dense but readable  

Use TanStack Table (or equivalent) patterns consistent with shadcn/ui.

---

## 14. Recommended Technical Stack (Locked for this PRD)

| Layer | Choice |
|---|---|
| Web | Next.js + TypeScript on **Vercel** |
| Backend spine | **PayloadCMS** (MongoDB) + custom endpoints |
| UI | Tailwind CSS + shadcn/ui + Shamal tokens |
| Maps | MapLibre GL |
| Charts | ECharts and/or Recharts |
| Tables | TanStack Table |
| Client state/data | TanStack Query + light Zustand where needed |
| Validation | Zod (shared schemas) |
| Database | MongoDB Atlas (**M0 initially**) |
| Files | AWS S3 |
| Queue/workers | Designed early; Redis + BullMQ when scale requires |
| Mobile (later) | React Native + SQLite offline |
| Auth | Payload auth + RBAC matrix |
| Monitoring | Sentry + structured logs |
| Docs | OpenAPI for external-facing APIs when exposed |

**Preference statement:** Given Shamal’s Vercel + Payload + Mongo + S3 reality, MongoDB is the correct primary store for InFlow’s configurable operational records — **provided** telemetry/files stay in S3, schemas are Zod-enforced, indexes are deliberate, and aggregates back the dashboard.

---

## 15. Suggested Monorepo Shape

```
shamal-inflow/
├── apps/
│   └── web/                 # Next.js + Payload
├── packages/
│   ├── ui/                  # design system
│   ├── types/
│   ├── validation/
│   ├── permissions/
│   └── config/
├── infrastructure/
│   ├── docker/              # workers later
│   └── database/            # index scripts, seed
└── docs/
    ├── architecture/
    ├── api/
    ├── database/
    └── integrations/
```

Mobile app added under `apps/mobile` in a later phase.

---

## 16. Delivery Phases (Steady Sequence)

### Phase 0 — Architecture package (before feature flood)

Deliverables:

1. System architecture  
2. Database / collection map + indexes  
3. Domain models / Zod contracts  
4. Event catalogue  
5. API contracts  
6. RBAC matrix  
7. Design system tokens + shell  
8. Deployment notes (Vercel / Atlas M0 / S3)

### Phase 1 — Foundation

Auth · Organizations · Users · Roles/Permissions · Audit · Documents (S3) · Configuration skeleton · App shell (nav, theme, layout) · CI/CD on Vercel  

**No vanity dashboard yet.**

### Phase 2 — Operational core

Projects → Missions → Assets (Aircraft/Batteries/Components/Equipment) → Operators → Flights → **Flight Completion Engine**

**Milestone A (must pass):** create/complete a flight and observe correct updates to pilot, aircraft, battery, counters, timeline.

### Phase 3 — Flight ingestion

Import framework + **DJI adapter first** → CanonicalFlight → dedup → FlightCompleted chain.

### Phase 4 — Maintenance & Inspections

Schedules, checklists, results, grounding, follow-ups, connected to flight events.

### Phase 5 — Compliance engine

Rules · evaluations · violations · warning/block behaviors · document/license expiry center.

### Phase 6 — Dashboard & Reporting

Command-center UI on aggregates · exports · async PDF jobs.

### Phase 7 — Mobile + Offline

React Native · SQLite · sync/idempotency · field checklists/incidents.

### Phase 8 — Enterprise integrations

Webhooks, external REST, GIS/ERP/CAFM bridges, additional OEM adapters.

---

## 17. MVP Definition (What “Done” Means for First Useful Release)

**In scope**

- Design system + desktop shell (light/dark)  
- Dashboard (real aggregates, even if sparse)  
- Projects, Missions (workflow), Flights (table + detail map), Fleet aircraft + batteries  
- Operators basic profiles  
- Maintenance/inspection minimum viable schedules & status  
- Documents upload via S3  
- Admin users/roles basics  
- One import path (manual entry + DJI file import if feasible on M0 constraints)  
- Audit on critical writes  

**Out of scope for MVP**

- Full mobile offline  
- All OEM adapters  
- Advanced compliance blocks everywhere  
- Perfect realtime everywhere  
- Heavy heatmap analytics at fleet-of-thousands scale  

---

## 18. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Dashboard < 2s typical on warm path via aggregates |
| Reliability | Flight import idempotent; no duplicate flights on re-upload |
| Scalability | Metadata Mongo; binaries/telemetry S3; workers for heavy jobs |
| Security | Org isolation, RBAC, audited mutations, signed uploads |
| Accessibility | Keyboard-capable nav; contrast suitable for ops rooms |
| i18n readiness | Arabic typography supported; full i18n can phase |
| Observability | `request_id`, structured logs, Sentry |
| Operability | Vercel preview envs; documented Atlas/S3 setup |

---

## 19. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| M0 storage/connection limits | Aggressive S3 offload; upgrade Atlas early; connection discipline |
| Vercel timeout on imports | Presigned S3 + async job model; never parse huge logs in request path |
| Schema chaos in Mongo | Zod + shared types + Payload collections + index discipline |
| Building UI before domain engine | Enforce Phase 0–2 sequence; Flight Completion milestone gate |
| Hardcoded workflows/compliance | Workflow + compliance engines as first-class domains |
| Treating modules as disconnected CRUDs | Asset model + domain events as architectural law |

---

## 20. Success Criteria

1. Stakeholders recognize the UI as aerospace/enterprise command-center grade (not CRM).  
2. Completing a flight correctly updates related operational entities without manual dual entry.  
3. Re-importing the same flight does not create duplicates.  
4. Dashboard loads from aggregates with acceptable latency on Vercel.  
5. Files never bloat Mongo; S3 is authoritative for binaries.  
6. RBAC prevents cross-organization data access.  
7. Architecture remains deployable on Shamal’s Vercel + Payload + Mongo + S3 stack, with a clear path off M0.

---

## 21. Immediate Next Actions

1. Accept this PRD as the product/engineering contract.  
2. Create `/docs` architecture package (system, database, events, API, RBAC, deployment).  
3. Bootstrap Next.js + PayloadCMS + Tailwind/shadcn design tokens (Shamal brand).  
4. Implement Foundation (Phase 1) + App Shell UI.  
5. Implement Asset + Project + Mission + Flight domain and **Flight Completion Engine** before polishing every widget.  

---

## 22. Golden Rule

> **UI is not the product. The operational data model and event engine are the product.**  
> The dashboard, mobile app, reports, notifications, compliance, and integrations are consumers of the same operational truth.

Shamal InFlow succeeds when every flight strengthens the operational system — and the command-center UI makes that truth unmistakable to enterprise operators.

---

**Document control**

| Field | Value |
|---|---|
| Product | Shamal InFlow |
| Org | Shamal Technologies |
| PRD Version | 1.0 |
| Stack lock | Vercel · Next.js · PayloadCMS · MongoDB Atlas (M0 start) · AWS S3 |
| UI lock | Enterprise UAV command-center design language in this PRD |
| Next artifact | Architecture docs + monorepo foundation |
