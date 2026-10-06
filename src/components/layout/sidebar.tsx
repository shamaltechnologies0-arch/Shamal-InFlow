"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Plug,
  Settings,
  Target,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/auth";

type NavLeaf = { href: string; label: string };
type NavGroup = {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: NavLeaf[];
};

/** PRD §38 product structure */
const nav: NavGroup[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Missions",
    icon: Target,
    children: [
      { href: "/missions", label: "Planned missions" },
      { href: "/missions/approvals", label: "Approvals" },
      { href: "/checklists", label: "Checklists" },
      { href: "/risk-assessments", label: "Risk assessments" },
    ],
  },
  {
    label: "Inventory",
    icon: Boxes,
    children: [
      { href: "/fleet", label: "Drones" },
      { href: "/components", label: "Components" },
      { href: "/equipment", label: "Equipment" },
      { href: "/batteries", label: "Batteries" },
    ],
  },
  {
    label: "Maintenance",
    icon: Wrench,
    children: [
      { href: "/maintenance", label: "Work orders" },
      { href: "/inspections", label: "Inspections" },
      { href: "/maintenance/schedules", label: "Schedules" },
    ],
  },
  {
    label: "Operators",
    icon: Users,
    children: [
      { href: "/operators", label: "Pilots" },
      { href: "/operators/skills", label: "Skills" },
    ],
  },
  { label: "Incidents", href: "/incidents", icon: AlertTriangle },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { href: "/reports", label: "Generate" },
      { href: "/reports/generated", label: "Generated" },
      { href: "/reports/import", label: "Import data" },
    ],
  },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Integrations", href: "/integrations", icon: Plug },
  {
    label: "Administration",
    icon: Settings,
    children: [
      { href: "/administration", label: "Overview" },
      { href: "/administration/users", label: "Users & roles" },
      { href: "/administration/config", label: "Configuration" },
      { href: "/administration/audit", label: "Audit trail" },
    ],
  },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  ops_manager: "Ops Manager",
  pilot: "Pilot",
  maintenance: "Maintenance",
  compliance: "Compliance",
  viewer: "Observer",
};

function formatRole(role: string) {
  return ROLE_LABELS[role] ?? role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  if (href === "/flights") return pathname === "/flights" || pathname.startsWith("/flights/");
  if (href === "/reports") return pathname === "/reports";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupOpenByPath(pathname: string): Record<string, boolean> {
  const open: Record<string, boolean> = {};
  for (const item of nav) {
    if (!item.children) continue;
    open[item.label] = item.children.some((c) => isActive(pathname, c.href));
  }
  return open;
}

export function Sidebar({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    groupOpenByPath(pathname),
  );

  useEffect(() => {
    setOpenGroups((prev) => ({ ...prev, ...groupOpenByPath(pathname) }));
  }, [pathname]);

  const displayName = user?.name ?? "Not signed in";
  const displayRole = user ? formatRole(user.role) : "Sign in required";
  const initials = initialsFromName(displayName);

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="border-b border-border/80 px-3 py-4">
        <Link
          href="/administration"
          className="group flex items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-white/[0.03]"
        >
          <span
            className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/25 bg-gradient-to-br from-accent/25 to-brand-blue/20 text-sm font-semibold tracking-wide text-foreground"
            aria-hidden
          >
            {initials}
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-status-operational" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground group-hover:text-accent">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-xs text-foreground-muted">{displayRole}</p>
          </div>
        </Link>

        <div className="mt-3 flex items-center gap-3 px-1 text-xs">
          <Link
            href="/administration"
            className="text-foreground-muted transition-colors hover:text-accent"
          >
            Profile
          </Link>
          <span className="text-border" aria-hidden>
            ·
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-foreground-muted transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <nav className="nav-scroll flex-1 overflow-y-auto px-2 py-3">
        {nav.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const open = openGroups[item.label];
            const childActive = item.children.some((c) => isActive(pathname, c.href));
            return (
              <div key={item.label} className="mb-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((s) => ({ ...s, [item.label]: !s[item.label] }))
                  }
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors",
                    childActive
                      ? "text-foreground"
                      : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      childActive ? "text-accent" : "opacity-70",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 opacity-50 transition-transform duration-200",
                      open ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="mb-1 ml-[18px] space-y-0.5 border-l border-border/70 pl-3">
                      {item.children.map((child) => {
                        const active = isActive(pathname, child.href);
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                              "block rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors",
                              active
                                ? "bg-accent/10 font-medium text-accent"
                                : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground",
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                "mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-accent" : "opacity-70")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
