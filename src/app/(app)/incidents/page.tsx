import { listIncidents } from "@/lib/data";
import { IncidentsClient } from "@/components/incidents/incidents-client";

export default async function IncidentsPage() {
  const data = await listIncidents();
  return <IncidentsClient data={data} />;
}
