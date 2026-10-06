"use server";

import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import { requireOrganizationId } from "@/lib/org";
import { getSession } from "@/lib/auth";
import { isUserRole } from "@/lib/roles";

export type UserFormState = {
  ok?: boolean;
  error?: string;
};

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Only an administrator can manage users." as const };
  }
  return { session };
}

export async function createUserAction(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return { error: gate.error };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "viewer");

  if (!name) return { error: "Name is required." };
  if (!email.includes("@")) return { error: "A valid email is required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (!isUserRole(role)) return { error: "Choose a role." };

  try {
    const payload = await getPayloadClient();
    const organization = await requireOrganizationId();
    await payload.create({
      collection: "users",
      data: {
        name,
        email,
        password,
        role,
        organization,
      },
      overrideAccess: true,
    });
    revalidatePath("/administration/users");
    revalidatePath("/administration");
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create user.";
    if (message.toLowerCase().includes("email") || message.toLowerCase().includes("unique")) {
      return { error: "That email is already in use." };
    }
    return { error: message };
  }
}

export async function updateUserRoleAction(id: string, role: string) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return { error: gate.error };
  if (!id) return { error: "Missing user." };
  if (!isUserRole(role)) return { error: "Invalid role." };
  if (gate.session.id === id && role !== "admin") {
    return { error: "You cannot remove your own administrator role." };
  }

  try {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "users",
      id,
      data: { role },
      overrideAccess: true,
    });
    revalidatePath("/administration/users");
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update role.";
    return { error: message };
  }
}

export async function updateUserAction(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return { error: gate.error };

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "");
  const password = String(formData.get("password") || "");

  if (!id) return { error: "Missing user." };
  if (!name) return { error: "Name is required." };
  if (!isUserRole(role)) return { error: "Choose a role." };
  if (password && password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (gate.session.id === id && role !== "admin") {
    return { error: "You cannot remove your own administrator role." };
  }

  try {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "users",
      id,
      data: password ? { name, role, password } : { name, role },
      overrideAccess: true,
    });
    revalidatePath("/administration/users");
    revalidatePath("/administration");
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update user.";
    return { error: message };
  }
}
