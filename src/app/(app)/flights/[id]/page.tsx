import { notFound } from "next/navigation";
import Link from "next/link";
import { getFlight } from "@/lib/data";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

type Props = { params: Promise<{ id: string }> };

export default async function FlightDetailPage({ params }: Props) {
  const { id } = await params;
  let flight;
  try {
    flight = await getFlight(id);
  } catch {
    notFound();
  }

  const fields = [
    ["Flight ID", flight.flightId],
    ["Date", flight.date],
    ["Start", flight.startTime],
    ["End", flight.endTime],
    ["Duration", flight.duration],
    ["Pilot", flight.pilot],
    ["Drone", flight.aircraft],
    ["Battery", flight.battery],
    ["Mission", flight.mission],
    ["Project", flight.project],
    ["Location", flight.location],
    ["Source", flight.source],
    ["Distance (km)", flight.distanceKm || "—"],
    ["Max altitude (m)", flight.maxAltitudeM || "—"],
    ["Max speed (m/s)", flight.maxSpeedMs || "—"],
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title={flight.flightId || "Flight Detail"}
        description={`${flight.date} · ${flight.pilot} · ${flight.aircraft}`}
        actions={
          <div className="flex gap-2">
            <StatusBadge status={flight.status} label={flight.status} />
            <Link
              href="/flights"
              className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium"
            >
              Back
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded border border-border bg-surface p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white">Flight information</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                  {label}
                </dt>
                <dd className="mt-1 text-sm text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-white">Positions</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                Takeoff
              </p>
              <p className="text-white">
                {flight.takeoff?.lat != null
                  ? `${flight.takeoff.lat}, ${flight.takeoff.lng}`
                  : "Not recorded"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                Landing
              </p>
              <p className="text-white">
                {flight.landing?.lat != null
                  ? `${flight.landing.lat}, ${flight.landing.lng}`
                  : "Not recorded"}
              </p>
            </div>
            <p className="text-xs text-foreground-muted">
              GPS track map, altitude profile, and 3D replay attach when flight-track import is enabled.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
