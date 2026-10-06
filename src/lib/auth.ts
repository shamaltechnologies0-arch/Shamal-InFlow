import type { User } from "@/payload-types";
import { getPayloadClient } from "@/lib/payload";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
};

export function getPayloadTokenCookieName(cookiePrefix = "payload") {
  return `${cookiePrefix}-token`;
}

export async function getSession(): Promise<SessionUser | null> {
  const payload = await getPayloadClient();
  const { headers } = await import("next/headers");
  const { user } = await payload.auth({ headers: await headers() });
  if (!user || user.collection !== "users") return null;

  const u = user as User;
  let organizationName = "Shamal Technologies";
  if (u.organization) {
    if (typeof u.organization === "object" && u.organization !== null && "name" in u.organization) {
      organizationName = String((u.organization as { name?: string }).name || organizationName);
    } else {
      try {
        const org = await payload.findByID({
          collection: "organizations",
          id: String(u.organization),
          depth: 0,
        });
        organizationName = org.name;
      } catch {
        // keep default
      }
    }
  }

  return {
    id: String(u.id),
    email: u.email,
    name: u.name || u.email.split("@")[0] || "Operator",
    role: u.role || "viewer",
    organization: organizationName,
  };
}

export async function clearAuthCookies() {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  jar.delete(getPayloadTokenCookieName("payload"));
  jar.delete("inflow-session");
}
