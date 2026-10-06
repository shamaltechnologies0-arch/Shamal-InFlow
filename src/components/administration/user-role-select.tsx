"use client";

import { useEffect, useState, useTransition } from "react";
import { updateUserRoleAction } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
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
  const [saved, setSaved] = useState(role);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(role);
    setSaved(role);
  }, [role]);
  const [pending, startTransition] = useTransition();
  const dirty = value !== saved;

  if (!canEdit) {
    return <span className="text-sm text-foreground">{userRoleLabel(role)}</span>;
  }

  function save() {
    const next = value;
    setError(null);
    startTransition(async () => {
      const result = await updateUserRoleAction(id, next);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(next);
    });
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <select
          value={value}
          disabled={pending}
          aria-label="Role"
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-brand-blue/40"
        >
          {USER_ROLES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {dirty ? (
          <Button type="button" size="sm" disabled={pending} onClick={save}>
            {pending ? "Saving…" : "Save"}
          </Button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-[11px] text-status-critical">{error}</p> : null}
    </div>
  );
}
