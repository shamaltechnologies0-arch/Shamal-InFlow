import { PageHeader } from "@/components/shared/page-header";

const notes = [
  {
    version: "0.1.0",
    date: "2026-10-01",
    items: [
      "Payload auth + MongoDB Atlas foundation",
      "Projects, Drones, Flights, Maintenance, Incidents, Documents modules",
      "Report / Import: Reports (PDF), Reports Generated, Import Data",
      "Top menu: Logout, Integration Hub, Release Notes",
    ],
  },
];

export default function ReleaseNotesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Release Notes" description="Shamal Inventory product changelog." />
      <div className="space-y-4">
        {notes.map((note) => (
          <article key={note.version} className="rounded border border-border bg-surface p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">v{note.version}</h2>
              <p className="text-xs text-foreground-muted">{note.date}</p>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground-muted">
              {note.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
