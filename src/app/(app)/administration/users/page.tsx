import { listUsers } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { ModuleListPage } from "@/components/shared/module-list-page";
import { EditUserButton } from "@/components/administration/edit-user-button";
import { UserRoleSelect } from "@/components/administration/user-role-select";

export default async function AdminUsersPage() {
  const session = await getSession();
  const isAdmin = session?.role === "admin";
  let rows: Awaited<ReturnType<typeof listUsers>> = [];
  let loadError = false;
  try {
    rows = await listUsers();
  } catch (err) {
    console.error("Failed to list users:", err);
    loadError = true;
  }

  return (
    <ModuleListPage
      title="Users & Roles"
      description="Add people and assign Administrator, Ops Manager, Operator, Maintenance, Compliance, or Viewer."
      emptyMessage={loadError ? "Users could not be loaded. Refresh the page." : "No users yet."}
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
        ...(isAdmin
          ? [
              {
                key: "actions",
                header: "",
                cell: (r: (typeof rows)[number]) => (
                  <EditUserButton id={r.id} name={r.name} email={r.email} role={r.role} />
                ),
              },
            ]
          : []),
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  );
}
