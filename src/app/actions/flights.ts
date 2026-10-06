"use server";

import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import { completeFlight } from "@/lib/flight-completion";

export type FlightActionState = {
  ok?: boolean;
  error?: string;
  flightId?: string;
  summary?: Awaited<ReturnType<typeof completeFlight>>;
};

async function resolveOrganizationId(formData: FormData) {
  const fromForm = String(formData.get("organization") || "").trim();
  if (fromForm) return fromForm;

  const payload = await getPayloadClient();
  const orgs = await payload.find({
    collection: "organizations",
    limit: 1,
    overrideAccess: true,
  });
  const org = orgs.docs[0];
  if (!org) throw new Error("No organization found. Run seed first.");
  return org.id;
}

function optionalRelation(formData: FormData, key: string): string | undefined {
  const value = String(formData.get(key) || "").trim();
  return value || undefined;
}

function generateFlightId(prefix = "MF") {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

export async function createManualFlightAction(
  _prev: FlightActionState,
  formData: FormData,
): Promise<FlightActionState> {
  const flightIdLabel = String(formData.get("flightId") || "").trim() || generateFlightId();
  const startTimeRaw = String(formData.get("startTime") || "").trim();
  const endTimeRaw = String(formData.get("endTime") || "").trim();

  if (!startTimeRaw) {
    return { error: "Start time is required." };
  }

  const startTime = new Date(startTimeRaw);
  if (Number.isNaN(startTime.getTime())) {
    return { error: "Invalid start time." };
  }

  let endTime: Date | undefined;
  if (endTimeRaw) {
    endTime = new Date(endTimeRaw);
    if (Number.isNaN(endTime.getTime())) {
      return { error: "Invalid end time." };
    }
  }

  const durationFromForm = Number(formData.get("durationMinutes") || NaN);
  let durationMinutes: number | undefined;
  if (Number.isFinite(durationFromForm) && durationFromForm >= 0) {
    durationMinutes = Math.round(durationFromForm);
  } else if (endTime && endTime > startTime) {
    durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60_000);
  }

  try {
    const payload = await getPayloadClient();
    const organization = await resolveOrganizationId(formData);

    const created = await payload.create({
      collection: "flights",
      data: {
        organization,
        flightId: flightIdLabel,
        source: "manual",
        startTime: startTime.toISOString(),
        endTime: endTime?.toISOString(),
        durationMinutes,
        pilot: optionalRelation(formData, "pilot"),
        aircraft: optionalRelation(formData, "aircraft"),
        battery: optionalRelation(formData, "battery"),
        mission: optionalRelation(formData, "mission"),
        project: optionalRelation(formData, "project"),
        locationLabel: String(formData.get("locationLabel") || "").trim() || undefined,
        status: "completed",
      },
      overrideAccess: true,
    });

    const summary = await completeFlight(payload, created.id);

    revalidatePath("/flights");
    revalidatePath("/fleet");
    revalidatePath("/batteries");
    revalidatePath("/operators");
    revalidatePath("/");
    revalidatePath("/notifications");
    revalidatePath("/administration/audit");

    return {
      ok: true,
      flightId: String(created.id),
      summary,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create manual flight.",
    };
  }
}

/** CSV stub: one row via `csvRow` or header-aligned fields; creates a single imported flight and completes it. */
export async function importFlightStubAction(
  _prev: FlightActionState,
  formData: FormData,
): Promise<FlightActionState> {
  const csvRow = String(formData.get("csvRow") || "").trim();

  let flightId = String(formData.get("flightId") || "").trim();
  let startTimeRaw = String(formData.get("startTime") || "").trim();
  let endTimeRaw = String(formData.get("endTime") || "").trim();
  let sourceFlightId = String(formData.get("sourceFlightId") || "").trim();
  let pilot = optionalRelation(formData, "pilot");
  let aircraft = optionalRelation(formData, "aircraft");
  let battery = optionalRelation(formData, "battery");
  let project = optionalRelation(formData, "project");
  let locationLabel = String(formData.get("locationLabel") || "").trim();

  if (csvRow) {
    const parts = csvRow.split(",").map((p) => p.trim());
    flightId = flightId || parts[0] || generateFlightId("IMP");
    startTimeRaw = startTimeRaw || parts[1] || "";
    endTimeRaw = endTimeRaw || parts[2] || "";
    sourceFlightId = sourceFlightId || parts[0] || flightId;
    pilot = pilot || parts[3] || undefined;
    aircraft = aircraft || parts[4] || undefined;
    battery = battery || parts[5] || undefined;
    project = project || parts[6] || undefined;
    locationLabel = locationLabel || parts[7] || "";
  }

  if (!flightId) flightId = generateFlightId("IMP");
  if (!startTimeRaw) {
    return { error: "CSV row or startTime is required for import stub." };
  }

  const startTime = new Date(startTimeRaw);
  if (Number.isNaN(startTime.getTime())) {
    return { error: "Invalid start time in import row." };
  }

  let endTime: Date | undefined;
  if (endTimeRaw) {
    endTime = new Date(endTimeRaw);
    if (Number.isNaN(endTime.getTime())) {
      return { error: "Invalid end time in import row." };
    }
  }

  try {
    const payload = await getPayloadClient();
    const organization = await resolveOrganizationId(formData);

    const created = await payload.create({
      collection: "flights",
      data: {
        organization,
        flightId,
        source: "csv-stub",
        sourceFlightId: sourceFlightId || flightId,
        fingerprint: `csv:${flightId}:${startTime.toISOString()}`,
        startTime: startTime.toISOString(),
        endTime: endTime?.toISOString(),
        pilot,
        aircraft,
        battery,
        project,
        locationLabel: locationLabel || undefined,
        status: "imported",
      },
      overrideAccess: true,
    });

    const summary = await completeFlight(payload, created.id);

    revalidatePath("/flights");
    revalidatePath("/reports/import");

    return {
      ok: true,
      flightId: String(created.id),
      summary,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to import flight stub.",
    };
  }
}
