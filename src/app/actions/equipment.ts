"use server";

import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import { requireOrganizationId } from "@/lib/org";
import { EQUIPMENT_STATUSES, EQUIPMENT_TYPES, isListed } from "@/lib/inventory";

export type EquipmentFormState = {
  ok?: boolean;
  error?: string;
  id?: string;
};

function readEquipment(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const equipmentType = String(formData.get("equipmentType") || "other");
  const status = String(formData.get("status") || "operational");
  const flightHours = Number(formData.get("flightHours") || 0);
  const aircraftId = String(formData.get("aircraft") || "").trim();

  if (!name) return { error: "Name is required." as const };
  if (!isListed(equipmentType, EQUIPMENT_TYPES)) return { error: "Invalid equipment type." as const };
  if (!isListed(status, EQUIPMENT_STATUSES)) return { error: "Invalid status." as const };

  return {
    name,
    equipmentType,
    status,
    manufacturer: String(formData.get("manufacturer") || "").trim() || undefined,
    model: String(formData.get("model") || "").trim() || undefined,
    serialNumber: String(formData.get("serialNumber") || "").trim() || undefined,
    assignedUser: String(formData.get("assignedUser") || "").trim() || undefined,
    flightHours: Number.isFinite(flightHours) ? flightHours : 0,
    aircraftId,
  };
}

export async function createEquipmentAction(
  _prev: EquipmentFormState,
  formData: FormData,
): Promise<EquipmentFormState> {
  const fields = readEquipment(formData);
  if ("error" in fields) return { error: fields.error };

  try {
    const payload = await getPayloadClient();
    const organization = await requireOrganizationId();
    const created = await payload.create({
      collection: "equipment",
      data: {
        organization,
        name: fields.name,
        equipmentType: fields.equipmentType,
        status: fields.status,
        manufacturer: fields.manufacturer,
        model: fields.model,
        serialNumber: fields.serialNumber,
        assignedUser: fields.assignedUser,
        flightHours: fields.flightHours,
        aircraft: fields.aircraftId || undefined,
      },
      overrideAccess: true,
    });

    revalidatePath("/equipment");
    if (fields.aircraftId) revalidatePath(`/fleet/${fields.aircraftId}`);
    return { ok: true, id: String(created.id) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create equipment." };
  }
}

export async function updateEquipmentAction(
  _prev: EquipmentFormState,
  formData: FormData,
): Promise<EquipmentFormState> {
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing equipment id." };

  const fields = readEquipment(formData);
  if ("error" in fields) return { error: fields.error };

  try {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "equipment",
      id,
      data: {
        name: fields.name,
        equipmentType: fields.equipmentType,
        status: fields.status,
        manufacturer: fields.manufacturer ?? null,
        model: fields.model ?? null,
        serialNumber: fields.serialNumber ?? null,
        assignedUser: fields.assignedUser ?? null,
        flightHours: fields.flightHours,
        aircraft: fields.aircraftId || null,
      },
      overrideAccess: true,
    });

    revalidatePath("/equipment");
    revalidatePath(`/equipment/${id}`);
    revalidatePath("/fleet");
    return { ok: true, id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update equipment." };
  }
}
