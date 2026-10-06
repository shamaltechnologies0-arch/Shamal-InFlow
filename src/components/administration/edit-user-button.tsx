"use client";

import { useActionState, useEffect, useState } from "react";
import { updateUserAction, type UserFormState } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/inventory/fields";
import { USER_ROLES } from "@/lib/roles";

const initial: UserFormState = {};

export function EditUserButton({
  id,
  name,
  email,
  role,
}: {
  id: string;
  name: string;
  email: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
        Edit
      </Button>
      {open ? (
        <EditUserDialog
          id={id}
          name={name}
          email={email}
          role={role}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

function EditUserDialog({
  id,
  name,
  email,
  role,
  onClose,
}: {
  id: string;
  name: string;
  email: string;
  role: string;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(updateUserAction, initial);

  useEffect(() => {
    if (state.ok) onClose();
  }, [onClose, state.ok]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <form
        action={action}
        className="relative z-10 grid w-full max-w-md gap-4 rounded-xl border border-border bg-surface p-5 shadow-panel"
      >
        <div>
          <h2 className="text-base font-semibold text-foreground">Edit user</h2>
          <p className="mt-1 text-xs text-foreground-muted">{email}</p>
        </div>
        <input type="hidden" name="id" value={id} />
        <label className="block text-sm">
          <span className="text-foreground-muted">Name</span>
          <input name="name" required defaultValue={name} className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Role</span>
          <select name="role" defaultValue={role} className={fieldClass}>
            {USER_ROLES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">New password</span>
          <input
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="Leave blank to keep the current password"
            className={fieldClass}
          />
        </label>
        {state.error ? <p className="text-sm text-status-critical">{state.error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
