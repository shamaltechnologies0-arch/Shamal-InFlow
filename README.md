# Shamal InFlow

UAV Operations Management & Digital Flight Intelligence Platform by **Shamal Technologies**.

Aerospace-grade command center for professional drone operations — missions, flights, fleet, batteries, maintenance, operators, compliance, and reporting.

## Stack (locked)

| Layer | Technology |
|---|---|
| Hosting | Vercel |
| App | Next.js 16 + TypeScript |
| Backend spine | PayloadCMS 3 + MongoDB Atlas |
| Files | AWS S3 |
| UI | Tailwind CSS 4 + Shamal design tokens |
| Charts | Recharts |
| Auth | Payload Auth |

## Quick start

1. Copy environment file:

```bash
cp .env.example .env
```

2. Set **required** vars in `.env`:

| Var | Purpose |
|---|---|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `PAYLOAD_SECRET` | Long random secret |
| `SEED_ADMIN_EMAIL` | First admin email (default `admin@shamal.sa`) |
| `SEED_ADMIN_PASSWORD` | First admin password (default `ShamalInFlow!2026`) |

Optional for media uploads:

| Var | Purpose |
|---|---|
| `AWS_S3_BUCKET` | S3 bucket name |
| `AWS_S3_REGION` | e.g. `eu-central-1` |
| `AWS_ACCESS_KEY_ID` | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | IAM secret |

3. Install & run:

```bash
npm install --legacy-peer-deps
npm run dev
```

On first successful DB connect, Payload seeds org + admin + foundation operational data.

Or seed manually:

```bash
npm run seed
```

4. Login credentials (after seed):

- Email: `admin@shamal.sa`
- Password: `ShamalInFlow!2026`

5. Open:

- Command center: [http://localhost:3000/login](http://localhost:3000/login)
- Payload admin: [http://localhost:3000/admin](http://localhost:3000/admin)

> **Note:** Local `mongodb://127.0.0.1:27017` only works if MongoDB is installed and running. For week-1 delivery use **MongoDB Atlas** and paste the `mongodb+srv://…` URI into `DATABASE_URL`.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run seed` | Seed MongoDB (org, admin, projects, fleet, flights…) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run generate:types` | Payload TypeScript types |
| `npm run generate:importmap` | Payload admin import map |
| `npm run payload` | Payload CLI |

## Architecture notes

- **UI is not the product** — the operational data model and `FlightCompleted` event engine are.
- MongoDB stores metadata; **S3 stores** flight logs, photos, PDFs, telemetry files.
- Do not embed high-rate GPS tracks inside flight documents — use `flight-tracks` + S3.
- Heavy import/parse/report work must be async (job records now; dedicated workers when volume requires).
- M0 Atlas is for foundation only — upgrade when storage, connections, or latency demand it.

See `PRD.md` for the full product contract.

## Brand

- Primary Navy `#0A3254`
- Secondary Blue `#226093`
- Background `#F7F9FC`
- Dark `#071E33`

## Vercel

Connect this repo to Vercel, set the same environment variables, and deploy. Root directory is the Next.js app.
