import type { Payload, SanitizedConfig } from "payload";
import { getPayload } from "payload";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@shamal.sa";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "ShamalInFlow!2026";

/** Creates the organization and admin login only. Operational records are entered in the app. */
export async function seedIfEmpty(payload: Payload) {
  const existingUsers = await payload.find({
    collection: "users",
    limit: 1,
    overrideAccess: true,
  });

  if (existingUsers.totalDocs > 0) {
    payload.logger.info("Admin already present — sample operational data is not seeded.");
    return;
  }

  const orgs = await payload.find({
    collection: "organizations",
    limit: 1,
    overrideAccess: true,
  });
  const org =
    orgs.docs[0] ??
    (await payload.create({
      collection: "organizations",
      data: {
        name: "Shamal Technologies",
        code: "SHAMAL",
        status: "active",
      },
      overrideAccess: true,
    }));

  await payload.create({
    collection: "users",
    data: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: "Ops Admin",
      role: "admin",
      organization: org.id,
    },
    overrideAccess: true,
  });

  payload.logger.info(`Admin account ready for ${ADMIN_EMAIL}`);
}

/** Used by `npx payload seed` via payload.config bin */
export const script = async (config: SanitizedConfig) => {
  const payload = await getPayload({ config });
  await seedIfEmpty(payload);
  process.exit(0);
};
