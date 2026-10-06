"use server";

import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import { requireOrganizationId } from "@/lib/org";
import {
  AIRCRAFT_STATUSES,
  AIRCRAFT_TYPES,
  PROPULSION_TYPES,
  isListed,
} from "@/lib/inventory";

export type AircraftUpdateState = {
  ok?: boolean;
  error?: string;
  id?: string;
};

function textOrNull(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  return value || null;
}

function numberOrNull(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function hmsToSeconds(formData: FormData, prefix: string) {
  const hours = numberOrNull(formData, `${prefix}H`) ?? 0;
  const minutes = numberOrNull(formData, `${prefix}M`) ?? 0;
  const seconds = numberOrNull(formData, `${prefix}S`) ?? 0;
  return Math.round(hours * 3600 + minutes * 60 + seconds);
}

function checked(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

function readAircraftForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const registration = String(formData.get("registration") || "").trim() || name;
  const model = String(formData.get("model") || "").trim();
  const status = String(formData.get("status") || "operational");
  const aircraftType = String(formData.get("aircraftType") || "multi_rotors");
  const propulsionType = String(formData.get("propulsionType") || "electric");

  if (!name) return { error: "Drone name is required." as const };
  if (!model) return { error: "Model is required." as const };
  if (!isListed(status, AIRCRAFT_STATUSES)) return { error: "Invalid status." as const };
  if (!isListed(aircraftType, AIRCRAFT_TYPES)) return { error: "Invalid aircraft type." as const };
  if (!isListed(propulsionType, PROPULSION_TYPES)) return { error: "Invalid propulsion type." as const };

  const flightSeconds = hmsToSeconds(formData, "flightTime");

  return {
    data: {
      name,
      registration,
      model,
      status,
      aircraftType,
      propulsionType,
      manufacturer: textOrNull(formData, "manufacturer"),
      legalId: textOrNull(formData, "legalId"),
      serialNumber: textOrNull(formData, "serialNumber"),
      internalSerial: textOrNull(formData, "internalSerial"),
      flightControllerSerial: textOrNull(formData, "flightControllerSerial"),
      remoteControllerSerial: textOrNull(formData, "remoteControllerSerial"),
      remoteController2Serial: textOrNull(formData, "remoteController2Serial"),
      softwareInformation: textOrNull(formData, "softwareInformation"),
      geometry: textOrNull(formData, "geometry"),
      inventoryAssetNumber: textOrNull(formData, "inventoryAssetNumber"),
      description: textOrNull(formData, "description"),
      tags: textOrNull(formData, "tags"),
      location: textOrNull(formData, "location"),
      ownerLabel: textOrNull(formData, "ownerLabel"),
      complianceCategory: textOrNull(formData, "complianceCategory"),
      firmwareVersion: textOrNull(formData, "firmwareVersion"),
      hardwareVersion: textOrNull(formData, "hardwareVersion"),
      weightKg: numberOrNull(formData, "weightKg"),
      maxGrossTakeoffKg: numberOrNull(formData, "maxGrossTakeoffKg"),
      maxPayloadKg: numberOrNull(formData, "maxPayloadKg"),
      color: textOrNull(formData, "color"),
      maxSpeedMs: numberOrNull(formData, "maxSpeedMs"),
      maxVerticalSpeedMs: numberOrNull(formData, "maxVerticalSpeedMs"),
      maxFlightTimeSeconds: hmsToSeconds(formData, "maxFlightTime"),
      outOfSightDistance: numberOrNull(formData, "outOfSightDistance"),
      purchaseDate: textOrNull(formData, "purchaseDate"),
      insurableValue: numberOrNull(formData, "insurableValue"),
      loanerDrone: checked(formData, "loanerDrone"),
      excludedFromLegalReport: checked(formData, "excludedFromLegalReport"),
      remoteId: textOrNull(formData, "remoteId"),
      connectivitySlot1: textOrNull(formData, "connectivitySlot1"),
      connectivitySlot1Extra: textOrNull(formData, "connectivitySlot1Extra"),
      connectivitySlot2: textOrNull(formData, "connectivitySlot2"),
      connectivitySlot2Extra: textOrNull(formData, "connectivitySlot2Extra"),
      videoSourceUrl: textOrNull(formData, "videoSourceUrl"),
      flightHours: flightSeconds / 3600,
      flightCount: numberOrNull(formData, "flightCount") ?? 0,
    },
  };
}

export async function updateAircraftAction(
  _prev: AircraftUpdateState,
  formData: FormData,
): Promise<AircraftUpdateState> {
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing aircraft id." };

  const parsed = readAircraftForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "aircraft",
      id,
      data: parsed.data,
      overrideAccess: true,
    });

    revalidatePath("/fleet");
    revalidatePath(`/fleet/${id}`);
    revalidatePath("/");
    return { ok: true, id };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update aircraft.",
    };
  }
}

export async function createAircraftAction(
  _prev: AircraftUpdateState,
  formData: FormData,
): Promise<AircraftUpdateState> {
  const parsed = readAircraftForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  try {
    const payload = await getPayloadClient();
    const organization = await requireOrganizationId();
    const created = await payload.create({
      collection: "aircraft",
      data: {
        organization,
        ...parsed.data,
      },
      overrideAccess: true,
    });

    revalidatePath("/fleet");
    revalidatePath("/");
    return { ok: true, id: String(created.id) };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create aircraft.",
    };
  }
}

export async function toggleAircraftActiveAction(id: string, active: boolean) {
  const payload = await getPayloadClient();
  await payload.update({
    collection: "aircraft",
    id,
    data: {
      status: active ? "operational" : "retired",
    },
    overrideAccess: true,
  });
  revalidatePath("/fleet");
  revalidatePath(`/fleet/${id}`);
}

export async function deleteAircraftAction(id: string) {
  const payload = await getPayloadClient();
  const related = ["components", "equipment", "batteries", "flights", "incidents"] as const;

  for (const collection of related) {
    const docs = await payload.find({
      collection,
      where: { aircraft: { equals: id } },
      limit: 200,
      depth: 0,
      overrideAccess: true,
    });
    await Promise.all(
      docs.docs.map((doc) =>
        payload.update({
          collection,
          id: doc.id,
          data: { aircraft: null },
          overrideAccess: true,
        }),
      ),
    );
  }

  await payload.delete({
    collection: "aircraft",
    id,
    overrideAccess: true,
  });
  revalidatePath("/fleet");
  revalidatePath("/");
}
