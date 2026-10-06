import { listFlightFormOptions } from "@/lib/data";
import { ImportFlightForm } from "@/components/flights/import-flight-form";

export default async function ImportFlightsPage() {
  const options = await listFlightFormOptions();
  return <ImportFlightForm options={options} />;
}
