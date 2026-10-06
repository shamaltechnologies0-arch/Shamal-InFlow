import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  className?: string;
  dense?: boolean;
};

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  className,
  dense = true,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-border/80 bg-surface/50",
        className,
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-white/[0.03]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 font-medium text-foreground-muted",
                  dense ? "py-2.5 text-[11px] uppercase tracking-[0.05em]" : "py-3",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-b border-border-subtle last:border-0 transition-colors hover:bg-accent/[0.04]"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-3 text-foreground",
                    dense ? "py-2.5" : "py-3",
                    col.className,
                  )}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
