"use server";

import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import { requireOrganizationId } from "@/lib/org";
import { COMPONENT_STATUSES, COMPONENT_TYPES, isListed } from "@/lib/inventory";

export type ComponentFormState = {
  ok?: boolean;
  error?: string;
  id?: string;
};

function readComponent(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const componentType = String(formData.get("componentType") || "other");
  const status = String(formData.get("status") || "operational");
  const operatingHours = Number(formData.get("operatingHours") || 0);
  const flightCount = Number(formData.get("flightCount") || 0);
  const aircraftId = String(formData.get("aircraft") || "").trim();

  if (!name) return { error: "Name is required." as const };
  if (!isListed(componentType, COMPONENT_TYPES)) return { error: "Invalid component type." as const };
  if (!isListed(status, COMPONENT_STATUSES)) return { error: "Invalid status." as const };

  return {
    name,
    componentType,
    status,
    manufacturer: String(formData.get("manufacturer") || "").trim() || undefined,
    model: String(formData.get("model") || "").trim() || undefined,
    serialNumber: String(formData.get("serialNumber") || "").trim() || undefined,
    operatingHours: Number.isFinite(operatingHours) ? operatingHours : 0,
    flightCount: Number.isFinite(flightCount) ? flightCount : 0,
    aircraftId,
  };
}

export async function createComponentAction(
  _prev: ComponentFormState,
  formData: FormData,
): Promise<ComponentFormState> {
  const fields = readComponent(formData);
  if ("error" in fields) return { error: fields.error };

  try {
    const payload = await getPayloadClient();
    const organization = await requireOrganizationId();
    const created = await payload.create({
      collection: "components",
      data: {
        organization,
        name: fields.name,
        componentType: fields.componentType,
        status: fields.status,
        manufacturer: fields.manufacturer,
        model: fields.model,
        serialNumber: fields.serialNumber,
        operatingHours: fields.operatingHours,
        flightCount: fields.flightCount,
        aircraft: fields.aircraftId || undefined,
      },
      overrideAccess: true,
    });

    revalidatePath("/components");
    if (fields.aircraftId) revalidatePath(`/fleet/${fields.aircraftId}`);
    return { ok: true, id: String(created.id) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create component." };
  }
}

export async function updateComponentAction(
  _prev: ComponentFormState,
  formData: FormData,
): Promise<ComponentFormState> {
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing component id." };

  const fields = readComponent(formData);
  if ("error" in fields) return { error: fields.error };

  try {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "components",
      id,
      data: {
        name: fields.name,
        componentType: fields.componentType,
        status: fields.status,
        manufacturer: fields.manufacturer ?? null,
        model: fields.model ?? null,
        serialNumber: fields.serialNumber ?? null,
        operatingHours: fields.operatingHours,
        flightCount: fields.flightCount,
        aircraft: fields.aircraftId || null,
      },
      overrideAccess: true,
    });

    revalidatePath("/components");
    revalidatePath(`/components/${id}`);
    revalidatePath("/fleet");
    return { ok: true, id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update component." };
  }
}
