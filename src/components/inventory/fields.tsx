import type { AircraftOption } from "@/lib/data";

export const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-brand-blue/40";

export function AircraftField({
  options,
  defaultValue = "",
}: {
  options: AircraftOption[];
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm md:col-span-2">
      <span className="text-foreground-muted">Assigned drone</span>
      <select name="aircraft" defaultValue={defaultValue} className={fieldClass}>
        <option value="">Unassigned</option>
        {options.map((aircraft) => (
          <option key={aircraft.id} value={aircraft.id}>
            {aircraft.label}
          </option>
        ))}
      </select>
    </label>
  );
}
