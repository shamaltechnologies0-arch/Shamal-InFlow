import { listMaintenance } from "@/lib/data";
import { MaintenanceClient } from "@/components/maintenance/maintenance-client";

export default async function MaintenancePage() {
  const data = await listMaintenance();
  return <MaintenanceClient data={data} />;
}
