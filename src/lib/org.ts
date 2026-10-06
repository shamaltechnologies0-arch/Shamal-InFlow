import { getPayloadClient } from "@/lib/payload";

export async function requireOrganizationId() {
  const payload = await getPayloadClient();
  const orgs = await payload.find({
    collection: "organizations",
    limit: 1,
    overrideAccess: true,
  });
  const org = orgs.docs[0];
  if (!org) {
    throw new Error("No organization found. Connect MongoDB and run the seed.");
  }
  return org.id;
}
