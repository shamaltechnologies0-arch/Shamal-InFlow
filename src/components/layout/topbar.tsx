"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, CircleHelp, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";
import { ShamalLogo } from "@/components/brand/shamal-logo";

const topLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/documents", label: "Documents" },
  { href: "/flights", label: "Flights" },
] as const;

const menuLinks = [
  { href: "/integrations", label: "Integration Hub" },
  { href: "/user-guide", label: "User Guide", note: "After core phases" },
  { href: "/release-notes", label: "Release Notes" },
] as const;

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <header className="relative z-40 flex h-14 shrink-0 items-center gap-5 border-b border-border/80 bg-surface/80 px-4 backdrop-blur-xl md:px-5">
      <ShamalLogo href="/" variant="full" />

      <nav className="hidden items-center gap-1 md:flex">
        {topLinks.map(({ href, label }) => {
          const active =
            href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground",
              )}
            >
              {label}
              {active ? (
                <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-accent" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="relative ml-auto hidden max-w-sm flex-1 lg:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
        <input
          placeholder="Search flights, drones, pilots…"
          className="h-9 w-full rounded-xl border border-border/80 bg-background/60 pl-9 pr-3 text-[13px] text-foreground outline-none placeholder:text-foreground-muted/70 transition focus:border-accent/40 focus:ring-2 focus:ring-[var(--ring)]"
          aria-label="Global search"
        />
      </div>

      <div className="relative ml-auto flex items-center gap-0.5 lg:ml-1" ref={panelRef}>
        <Link
          href="/notifications"
          className="rounded-lg p-2 text-foreground-muted transition-colors hover:bg-white/[0.05] hover:text-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Link>
        <button
          type="button"
          className="rounded-lg p-2 text-foreground-muted transition-colors hover:bg-white/[0.05] hover:text-accent"
          aria-label="Help"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-foreground-muted transition-colors hover:bg-white/[0.05] hover:text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {open ? (
          <div className="absolute right-0 top-11 w-56 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-panel animate-fade-up">
            <ul className="py-1.5 text-sm">
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2.5 text-foreground transition-colors hover:bg-accent/10"
                    onClick={() => setOpen(false)}
                  >
                    <span className="block font-medium">{item.label}</span>
                    {"note" in item && item.note ? (
                      <span className="block text-[11px] font-normal text-foreground-muted">
                        {item.note}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
              <li className="border-t border-border">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 text-left text-foreground transition-colors hover:bg-accent/10"
                  >
                    Logout
                  </button>
                </form>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
