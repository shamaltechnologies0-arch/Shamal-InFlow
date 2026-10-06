import { listAircraft } from "@/lib/data";
import { FleetClient } from "@/components/fleet/fleet-client";

export default async function FleetPage() {
  const aircraft = await listAircraft();
  return <FleetClient aircraft={aircraft} />;
}
