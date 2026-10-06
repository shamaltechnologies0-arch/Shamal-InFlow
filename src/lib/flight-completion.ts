import type { Payload } from "payload";

type AnyDoc = { id: string | number; [key: string]: unknown };

function relId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "object" && value !== null && "id" in value) {
    return String((value as { id: string | number }).id);
  }
  return String(value);
}

export type FlightCompletionSummary = {
  flightId: string;
  durationMinutes: number;
  updates: string[];
  skipped?: boolean;
};

/**
 * PRD §37 — Flight Completion automation spine.
 * A completed/imported flight updates linked operational records.
 * Idempotent: skips side effects if a flight.completed audit already exists.
 */
export async function completeFlight(
  payload: Payload,
  flightId: string,
): Promise<FlightCompletionSummary> {
  const flight = (await payload.findByID({
    collection: "flights",
    id: flightId,
    depth: 1,
    overrideAccess: true,
  })) as unknown as AnyDoc;

  try {
    const prior = await payload.find({
      collection: "audit-events",
      where: {
        and: [
          { action: { equals: "flight.completed" } },
          { entityType: { equals: "flights" } },
          { entityId: { equals: String(flightId) } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    });
    if (prior.totalDocs > 0) {
      return {
        flightId,
        durationMinutes: Number(flight.durationMinutes ?? 0),
        updates: [],
        skipped: true,
      };
    }
  } catch {
    // proceed if audit query unavailable
  }

  let durationMinutes = Number(flight.durationMinutes ?? 0);
  if ((!durationMinutes || durationMinutes <= 0) && flight.startTime && flight.endTime) {
    const start = new Date(String(flight.startTime)).getTime();
    const end = new Date(String(flight.endTime)).getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      durationMinutes = Math.max(1, Math.round((end - start) / 60_000));
      await payload.update({
        collection: "flights",
        id: flightId,
        data: { durationMinutes, status: "completed" },
        overrideAccess: true,
      });
    }
  } else if (flight.status !== "completed" && flight.status !== "imported") {
    await payload.update({
      collection: "flights",
      id: flightId,
      data: { status: "completed" },
      overrideAccess: true,
    });
  }

  const hoursDelta = durationMinutes / 60;
  const orgId = relId(flight.organization);
  const updates: string[] = [];

  const aircraftId = relId(flight.aircraft);
  if (aircraftId) {
    const ac = (await payload.findByID({
      collection: "aircraft",
      id: aircraftId,
      overrideAccess: true,
    })) as unknown as AnyDoc;
    await payload.update({
      collection: "aircraft",
      id: aircraftId,
      data: {
        flightHours: Number(ac.flightHours ?? 0) + hoursDelta,
        flightCount: Number(ac.flightCount ?? 0) + 1,
      },
      overrideAccess: true,
    });
    updates.push("aircraft");
  }

  const batteryId = relId(flight.battery);
  if (batteryId) {
    const bat = (await payload.findByID({
      collection: "batteries",
      id: batteryId,
      overrideAccess: true,
    })) as unknown as AnyDoc;
    const cycleCount = Number(bat.cycleCount ?? 0) + 1;
    const cycleLifespan = Number(bat.cycleLifespan ?? 200) || 200;
    await payload.update({
      collection: "batteries",
      id: batteryId,
      data: {
        flightHours: Number(bat.flightHours ?? 0) + hoursDelta,
        flightCount: Number(bat.flightCount ?? 0) + 1,
        cycleCount,
      },
      overrideAccess: true,
    });
    updates.push("battery");

    if (orgId && cycleCount / cycleLifespan >= 0.8) {
      try {
        await payload.create({
          collection: "notifications",
          data: {
            organization: orgId,
            title: `Battery cycle threshold — ${String(bat.name || bat.serialNumber)}`,
            body: `Battery has reached ${Math.round((cycleCount / cycleLifespan) * 100)}% of configured cycle lifespan (${cycleCount}/${cycleLifespan}).`,
            type: "battery_cycle",
            severity: "warning",
            read: false,
            relatedEntityType: "batteries",
            relatedEntityId: batteryId,
          },
          overrideAccess: true,
        });
        updates.push("battery_alert");
      } catch {
        // notifications collection may not exist yet during rollout
      }
    }
  }

  const pilotId = relId(flight.pilot);
  if (pilotId) {
    const op = (await payload.findByID({
      collection: "operators",
      id: pilotId,
      overrideAccess: true,
    })) as unknown as AnyDoc;
    await payload.update({
      collection: "operators",
      id: pilotId,
      data: {
        totalFlightHours: Number(op.totalFlightHours ?? 0) + hoursDelta,
      },
      overrideAccess: true,
    });
    updates.push("pilot");
  }

  if (orgId) {
    try {
      await payload.create({
        collection: "audit-events",
        data: {
          organization: orgId,
          action: "flight.completed",
          entityType: "flights",
          entityId: String(flightId),
          next: { durationMinutes, updates },
        },
        overrideAccess: true,
      });
      updates.push("audit");
    } catch {
      // audit optional if schema differs
    }
  }

  return { flightId, durationMinutes, updates };
}
