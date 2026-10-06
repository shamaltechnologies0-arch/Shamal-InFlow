import { listFlights } from "@/lib/data";
import { FlightsClient } from "@/components/flights/flights-client";

export default async function FlightsPage() {
  const data = await listFlights();
  return <FlightsClient data={data} />;
}
