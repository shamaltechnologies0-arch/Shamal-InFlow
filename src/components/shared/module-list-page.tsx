import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

type Props<T> = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  emptyMessage?: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  stats?: Array<{ label: string; value: string | number }>;
};

export function ModuleListPage<T>({
  title,
  description,
  actionHref,
  actionLabel,
  emptyMessage = "No records yet.",
  columns,
  rows,
  getRowKey,
  stats,
}: Props<T>) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          actionHref && actionLabel ? (
            <Link
              href={actionHref}
              className="inline-flex h-9 items-center rounded-xl bg-accent px-3.5 text-xs font-semibold text-background transition hover:brightness-110"
            >
              {actionLabel}
            </Link>
          ) : undefined
        }
      />
      {stats?.length ? (
        <div className="flex flex-wrap gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-[11px] font-semibold tracking-wider text-foreground-muted">{s.label}</p>
              <p className="text-xl font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      ) : null}
      {rows.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-sm text-foreground-muted">
          {emptyMessage}
        </p>
      ) : (
        <DataTable columns={columns} data={rows} getRowKey={getRowKey} />
      )}
    </div>
  );
}

export { StatusBadge };
