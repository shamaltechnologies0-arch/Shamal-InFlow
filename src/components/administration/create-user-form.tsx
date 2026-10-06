"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserAction, type UserFormState } from "@/app/actions/users";
import { USER_ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/inventory/fields";

const initial: UserFormState = {};

export function CreateUserForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(createUserAction, initial);

  useEffect(() => {
    if (state.ok) router.push("/administration/users");
  }, [router, state.ok]);

  return (
    <form action={action} className="grid max-w-xl gap-4">
      <label className="block text-sm">
        <span className="text-foreground-muted">Name</span>
        <input name="name" required className={fieldClass} placeholder="Full name" />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Email</span>
        <input name="email" type="email" required className={fieldClass} placeholder="name@shamal.sa" />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Password</span>
        <input name="password" type="password" required minLength={8} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Role</span>
        <select name="role" defaultValue="pilot" className={fieldClass}>
          {USER_ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </label>
      {state.error ? <p className="text-sm text-status-critical">{state.error}</p> : null}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save user"}
        </Button>
      </div>
    </form>
  );
}
