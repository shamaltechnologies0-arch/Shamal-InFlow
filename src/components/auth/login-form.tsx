"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8 space-y-7">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-foreground-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@shamal.sa"
          className="w-full rounded-xl border border-border/80 bg-background/50 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/60 transition focus:border-accent/40 focus:ring-2 focus:ring-[var(--ring)]"
        />
      </label>

      <label className="relative block">
        <span className="mb-1.5 block text-xs font-medium text-foreground-muted">Password</span>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-xl border border-border/80 bg-background/50 px-3 py-2.5 pr-10 text-sm text-foreground outline-none placeholder:text-foreground-muted/60 transition focus:border-accent/40 focus:ring-2 focus:ring-[var(--ring)]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute bottom-2.5 right-3 text-foreground-muted hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </label>

      {state.error ? (
        <p className="text-sm text-status-critical" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-background shadow-soft transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-xs text-link underline-offset-2 transition hover:text-accent hover:underline"
        >
          Lost password?
        </button>
      </div>
    </form>
  );
}
