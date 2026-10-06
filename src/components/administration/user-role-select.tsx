"use client";

import { useState, useTransition } from "react";
import { updateUserRoleAction } from "@/app/actions/users";
import { USER_ROLES, userRoleLabel } from "@/lib/roles";

export function UserRoleSelect({
  id,
  role,
  canEdit,
}: {
  id: string;
  role: string;
  canEdit: boolean;
}) {
  const [value, setValue] = useState(role);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!canEdit) {
    return <span className="text-sm text-foreground">{userRoleLabel(role)}</span>;
  }

  return (
    <div>
      <select
        value={value}
        disabled={pending}
        aria-label="Role"
        onChange={(event) => {
          const next = event.target.value;
          const previous = value;
          setValue(next);
          setError(null);
          startTransition(async () => {
            const result = await updateUserRoleAction(id, next);
            if (result.error) {
              setValue(previous);
              setError(result.error);
            }
          });
        }}
        className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-brand-blue/40"
      >
        {USER_ROLES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-[11px] text-status-critical">{error}</p> : null}
    </div>
  );
}
