import { listUsers } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { ModuleListPage } from "@/components/shared/module-list-page";
import { UserRoleSelect } from "@/components/administration/user-role-select";

export default async function AdminUsersPage() {
  const session = await getSession();
  const isAdmin = session?.role === "admin";
  let rows: Awaited<ReturnType<typeof listUsers>> = [];
  try {
    rows = await listUsers();
  } catch {
    rows = [];
  }

  return (
    <ModuleListPage
      title="Users & Roles"
      description="Add people and assign Administrator, Ops Manager, Operator, Maintenance, Compliance, or Viewer."
      emptyMessage="No users yet."
      actionHref={isAdmin ? "/administration/users/new" : undefined}
      actionLabel={isAdmin ? "Add user" : undefined}
      stats={[{ label: "USERS", value: rows.length }]}
      columns={[
        { key: "name", header: "Name", cell: (r) => r.name },
        { key: "email", header: "Email", cell: (r) => r.email },
        {
          key: "role",
          header: "Role",
          cell: (r) => <UserRoleSelect id={r.id} role={r.role} canEdit={isAdmin} />,
        },
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  );
}
