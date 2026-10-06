import { listOperators } from "@/lib/data";
import { PageHeader } from "@/components/shared/page-header";

const skillColumns = [
  "bvlos",
  "night",
  "thermal",
  "rtk",
  "dock",
  "survey",
  "lidar",
  "mapping",
  "inspection",
] as const;

const labels: Record<(typeof skillColumns)[number], string> = {
  bvlos: "BVLOS",
  night: "Night",
  thermal: "Thermal",
  rtk: "RTK",
  dock: "Dock",
  survey: "Survey",
  lidar: "LiDAR",
  mapping: "Mapping",
  inspection: "Inspection",
};

export default async function OperatorSkillsPage() {
  const operators = await listOperators();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills & Capabilities"
        description="Regulatory, operations, business-case, and tool qualifications — PRD §17."
      />
      <div className="overflow-x-auto rounded border border-border bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-foreground-muted">
              <th className="px-4 py-3">Operator</th>
              {skillColumns.map((s) => (
                <th key={s} className="px-2 py-3 text-center">
                  {labels[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operators.length === 0 ? (
              <tr>
                <td colSpan={skillColumns.length + 1} className="px-4 py-8 text-foreground-muted">
                  No operators loaded.
                </td>
              </tr>
            ) : (
              operators.map((op) => (
                <tr key={op.id} className="border-b border-border/60">
                  <td className="px-4 py-3 font-medium text-white">{op.name}</td>
                  {skillColumns.map((s) => (
                    <td key={s} className="px-2 py-3 text-center">
                      {op.skills.includes(s) ? (
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-status-operational" />
                      ) : (
                        <span className="text-foreground-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-foreground-muted">
        Assign skills on operator records in Payload Admin. Custom skills can be added to the configuration engine.
      </p>
    </div>
  );
}
