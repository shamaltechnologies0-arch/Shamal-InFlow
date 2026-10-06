import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserForm } from "@/components/administration/create-user-form";
import { getSession } from "@/lib/auth";

export default async function NewUserPage() {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/administration/users");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add user"
        description="Create a login and assign a role. The person can sign in with this email and password."
        actions={
          <Link
            href="/administration/users"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-xs font-medium"
          >
            Cancel
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
