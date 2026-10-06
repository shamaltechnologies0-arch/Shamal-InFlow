import { listBatteries } from "@/lib/data";
import { BatteriesClient } from "@/components/batteries/batteries-client";

export default async function BatteriesPage() {
  const batteries = await listBatteries();
  return <BatteriesClient batteries={batteries} />;
}
