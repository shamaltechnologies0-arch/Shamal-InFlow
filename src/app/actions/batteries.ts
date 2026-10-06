"use server";

import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import { requireOrganizationId } from "@/lib/org";

export type BatteryUpdateState = {
  ok?: boolean;
  error?: string;
  id?: string;
};

const STATUS_VALUES = ["operational", "maintenance", "retired", "damaged"] as const;

export async function updateBatteryAction(
  _prev: BatteryUpdateState,
  formData: FormData,
): Promise<BatteryUpdateState> {
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing battery id." };

  const name = String(formData.get("name") || "").trim();
  const serialNumber = String(formData.get("serialNumber") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const legalId = String(formData.get("legalId") || "").trim();
  const ownerLabel = String(formData.get("ownerLabel") || "").trim();
  const status = String(formData.get("status") || "operational");
  const healthScore = Number(formData.get("healthScore") || 0);
  const cycleCount = Number(formData.get("cycleCount") || 0);
  const cycleLifespan = Number(formData.get("cycleLifespan") || 200);
  const flightCount = Number(formData.get("flightCount") || 0);
  const flightLifespan = Number(formData.get("flightLifespan") || 500);
  const flightHours = Number(formData.get("flightHours") || 0);
  const shared = formData.get("shared") === "on" || formData.get("shared") === "true";
  const aircraftId = String(formData.get("aircraft") || "").trim();

  if (!serialNumber) return { error: "Serial number is required." };
  if (!STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) {
    return { error: "Invalid status." };
  }

  try {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "batteries",
      id,
      data: {
        name: name || serialNumber,
        serialNumber,
        model: model || undefined,
        legalId: legalId || undefined,
        ownerLabel: ownerLabel || undefined,
        status: status as (typeof STATUS_VALUES)[number],
        healthScore: Number.isFinite(healthScore) ? healthScore : 0,
        cycleCount: Number.isFinite(cycleCount) ? cycleCount : 0,
        cycleLifespan: Number.isFinite(cycleLifespan) ? cycleLifespan : 200,
        flightCount: Number.isFinite(flightCount) ? flightCount : 0,
        flightLifespan: Number.isFinite(flightLifespan) ? flightLifespan : 500,
        flightHours: Number.isFinite(flightHours) ? flightHours : 0,
        shared,
        aircraft: aircraftId || null,
      },
      overrideAccess: true,
    });

    revalidatePath("/batteries");
    revalidatePath(`/batteries/${id}`);
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update battery.",
    };
  }
}

export async function toggleBatteryActiveAction(id: string, active: boolean) {
  const payload = await getPayloadClient();
  await payload.update({
    collection: "batteries",
    id,
    data: { status: active ? "operational" : "retired" },
    overrideAccess: true,
  });
  revalidatePath("/batteries");
  revalidatePath(`/batteries/${id}`);
}

export async function createBatteryAction(
  _prev: BatteryUpdateState,
  formData: FormData,
): Promise<BatteryUpdateState> {
  const serialNumber = String(formData.get("serialNumber") || "").trim();
  if (!serialNumber) return { error: "Serial number is required." };

  try {
    const payload = await getPayloadClient();
    const organization = await requireOrganizationId();
    const aircraftId = String(formData.get("aircraft") || "").trim();

    const created = await payload.create({
      collection: "batteries",
      data: {
        organization,
        name: String(formData.get("name") || serialNumber).trim(),
        serialNumber,
        model: String(formData.get("model") || "TB60").trim(),
        legalId: String(formData.get("legalId") || "").trim() || undefined,
        ownerLabel: String(formData.get("ownerLabel") || "Shamal Technologies").trim(),
        aircraft: aircraftId || undefined,
        status: "operational",
        shared: true,
        healthScore: 95,
        cycleCount: 0,
        cycleLifespan: 200,
        flightCount: 0,
        flightLifespan: 500,
        flightHours: 0,
      },
      overrideAccess: true,
    });

    revalidatePath("/batteries");
    revalidatePath("/");
    return { ok: true, id: String(created.id) };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create battery.",
    };
  }
}
