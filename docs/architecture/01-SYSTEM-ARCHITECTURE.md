# Shamal InFlow — System Architecture (Foundation)

Status: aligned with PRD v1.0  
Hosting: Vercel · PayloadCMS · MongoDB Atlas · AWS S3

## Runtime topology

```
Next.js (Vercel)
 ├─ (app) Command Center UI
 ├─ (payload)/admin  Payload Admin
 └─ (payload)/api    REST / GraphQL
        │
        ▼
 MongoDB Atlas (operational source of truth)
        │
        ├── metadata, relations, aggregates
        └── storage keys → AWS S3 (binaries / logs / evidence)
```

## Domain spine

`Project → Mission → Flight → (Pilot, Aircraft, Battery, Equipment) → Events → Inspection / Maintenance / Compliance → Notifications / Reports / Dashboard`

## Non-negotiables

1. CanonicalFlight via adapters — providers never own the schema
2. Flight metadata ≠ telemetry payload
3. organizationId on every operational document
4. RBAC + permission matrix (not role string checks in UI)
5. Dashboard reads aggregates, not raw mega-joins
6. Presigned S3 uploads; never stream huge files through Vercel as durable storage

## Phased delivery

Foundation → Assets/Projects/Missions → Flight Completion Engine → DJI Import → Maintenance/Inspections → Compliance → Dashboard polish → Mobile/Offline → Enterprise integrations

## Related

- `PRD.md` — product requirements
- Payload collections under `src/collections/`
- Command center under `src/app/(app)/`
