export const USER_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "ops_manager", label: "Ops Manager" },
  { value: "pilot", label: "Operator" },
  { value: "maintenance", label: "Maintenance" },
  { value: "compliance", label: "Compliance" },
  { value: "viewer", label: "Viewer" },
] as const;

export type UserRole = (typeof USER_ROLES)[number]["value"];

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.some((role) => role.value === value);
}

export function userRoleLabel(value: string) {
  return USER_ROLES.find((role) => role.value === value)?.label ?? value;
}
