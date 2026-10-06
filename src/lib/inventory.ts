export const AIRCRAFT_TYPES = [
  { value: "multi_rotors", label: "Multi-rotors" },
  { value: "fixed_wing", label: "Fixed wing" },
  { value: "vtol", label: "VTOL" },
  { value: "helicopter", label: "Helicopter" },
  { value: "other", label: "Other" },
] as const;

export const PROPULSION_TYPES = [
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "gas", label: "Gas" },
  { value: "other", label: "Other" },
] as const;

export const AIRCRAFT_STATUSES = [
  { value: "operational", label: "Operational / Airworthy" },
  { value: "inspection_due", label: "Inspection Due" },
  { value: "maintenance_due", label: "Maintenance Due" },
  { value: "grounded", label: "Grounded" },
  { value: "retired", label: "Retired" },
] as const;

export const COMPONENT_TYPES = [
  { value: "motor", label: "Motor" },
  { value: "propeller_cw", label: "Propeller CW" },
  { value: "propeller_ccw", label: "Propeller CCW" },
  { value: "esc", label: "ESC" },
  { value: "landing_gear", label: "Landing Gear" },
  { value: "arm", label: "Arm" },
  { value: "flight_controller", label: "Flight Controller" },
  { value: "gnss", label: "GNSS" },
  { value: "other", label: "Other" },
] as const;

export const COMPONENT_STATUSES = [
  { value: "operational", label: "Operational" },
  { value: "maintenance", label: "Maintenance" },
  { value: "retired", label: "Retired" },
  { value: "removed", label: "Removed" },
] as const;

export const EQUIPMENT_TYPES = [
  { value: "camera", label: "Camera" },
  { value: "gimbal", label: "Gimbal" },
  { value: "lidar", label: "LiDAR" },
  { value: "rtk", label: "RTK" },
  { value: "charger", label: "Charger" },
  { value: "case", label: "Case" },
  { value: "controller", label: "Controller" },
  { value: "tablet", label: "Tablet" },
  { value: "ground_station", label: "Ground Station" },
  { value: "survey", label: "Survey" },
  { value: "gnss", label: "GNSS" },
  { value: "other", label: "Other" },
] as const;

export const EQUIPMENT_STATUSES = [
  { value: "operational", label: "Operational" },
  { value: "maintenance", label: "Maintenance" },
  { value: "retired", label: "Retired" },
  { value: "lost", label: "Lost" },
] as const;

export function isListed<T extends string>(
  value: string,
  options: readonly { value: T }[],
): value is T {
  return options.some((option) => option.value === value);
}

export function optionLabel(
  value: string,
  options: readonly { value: string; label: string }[],
) {
  return options.find((option) => option.value === value)?.label ?? value.replace(/_/g, " ");
}
