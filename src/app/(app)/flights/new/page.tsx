import { listFlightFormOptions } from "@/lib/data";
import { ManualFlightForm } from "@/components/flights/manual-flight-form";

export default async function NewFlightPage() {
  const options = await listFlightFormOptions();
  return <ManualFlightForm options={options} />;
}
