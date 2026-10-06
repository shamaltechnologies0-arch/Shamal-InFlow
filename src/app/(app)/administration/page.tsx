import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { getDashboardData } from "@/lib/dashboard";
import { listUsers } from "@/lib/data";

export default async function AdministrationPage() {
  let kpis = {
    activeDrones: 0,
    activePilots: 0,
    openIncidents: 0,
    overdueMaintenance: 0,
    expiredDocuments: 0,
    expiringDocuments: 0,
  };
  let userCount = 0;

  try {
    const [dash, users] = await Promise.all([getDashboardData(), listUsers()]);
    kpis = dash.kpis;
    userCount = users.length;
  } catch {
    // Mongo may be briefly unavailable; still render admin shell
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="Organization settings, access control, configuration, and compliance overview."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-white">Organization</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p><span className="text-foreground-muted">Entity:</span> Shamal Technologies</p>
            <p><span className="text-foreground-muted">Timezone:</span> Asia/Riyadh</p>
            <p><span className="text-foreground-muted">Active drones:</span> {kpis.activeDrones}</p>
            <p><span className="text-foreground-muted">Active pilots:</span> {kpis.activePilots}</p>
          </div>
        </section>
        <section className="rounded border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-white">Users & Roles</h2>
          <p className="mt-3 text-3xl font-semibold text-white">{userCount}</p>
          <p className="text-sm text-foreground-muted">Registered users</p>
          <Link href="/administration/users" className="mt-3 inline-block text-xs text-link hover:underline">
            Manage users & roles →
          </Link>
        </section>
        <section className="rounded border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-white">Compliance pulse</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li className="flex justify-between"><span className="text-foreground-muted">Open incidents</span><span>{kpis.openIncidents}</span></li>
            <li className="flex justify-between"><span className="text-foreground-muted">Overdue maintenance</span><span>{kpis.overdueMaintenance}</span></li>
            <li className="flex justify-between"><span className="text-foreground-muted">Expired documents</span><span>{kpis.expiredDocuments}</span></li>
            <li className="flex justify-between"><span className="text-foreground-muted">Expiring (30d)</span><span>{kpis.expiringDocuments}</span></li>
          </ul>
        </section>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/administration/config" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-white hover:bg-brand-blue/20">
          Configuration engine
        </Link>
        <Link href="/administration/audit" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-white hover:bg-brand-blue/20">
          Audit trail
        </Link>
        <Link href="/admin" className="rounded-lg bg-brand-blue px-3 py-2 text-xs font-semibold text-white hover:bg-brand-navy">
          Payload Admin
        </Link>
      </div>
    </div>
  );
}
