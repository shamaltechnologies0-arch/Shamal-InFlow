"use client";

import { CircleHelp } from "lucide-react";
import { useState } from "react";

type ImportCard = {
  id: string;
  title: string;
  description: string;
  section?: "core" | "platforms";
};

const imports: ImportCard[] = [
  {
    id: "flights",
    title: "Flight Mass-Import",
    description: "Import multiple flights at once, stored in CSV format file.",
    section: "core",
  },
  {
    id: "drones",
    title: "Drone Mass-Import",
    description: "Import multiple drones at once, stored in CSV format file.",
    section: "core",
  },
  {
    id: "batteries",
    title: "Battery Mass-Import",
    description: "Import multiple batteries at once, stored in CSV format file.",
    section: "core",
  },
  {
    id: "equipment",
    title: "Equipment Mass-Import",
    description: "Import multiple equipment at once, stored in CSV format file.",
    section: "core",
  },
  {
    id: "locations",
    title: "Locations Mass-Import",
    description: "Import multiple locations at once, stored in CSV format file.",
    section: "core",
  },
  {
    id: "customers",
    title: "Customers Mass-Import",
    description: "Import multiple customers at once, stored in CSV format file.",
    section: "core",
  },
  {
    id: "projects",
    title: "Projects Mass-Import",
    description: "Import multiple projects at once, stored in CSV format file.",
    section: "core",
  },
  {
    id: "airdata",
    title: "Airdata Mass-Import",
    description: "Import multiple flights at once, stored in CSV format file.",
    section: "platforms",
  },
  {
    id: "skyward",
    title: "Skyward Mass-Import",
    description: "Import multiple flights at once, stored in CSV format file.",
    section: "platforms",
  },
  {
    id: "aloft",
    title: "Aloft Mass-Import",
    description: "Import multiple flights at once, stored in CSV format file.",
    section: "platforms",
  },
];

export default function ImportDataPage() {
  const [message, setMessage] = useState<string | null>(null);

  function openImporter(title: string) {
    setMessage(`${title} — CSV importer UI will attach to Payload collections next.`);
    window.setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-brand-blue/40 pb-3">
        <h1 className="text-2xl font-semibold tracking-wide text-white">IMPORT DATA</h1>
        <button type="button" className="text-foreground-muted hover:text-white" aria-label="Help">
          <CircleHelp className="h-5 w-5" />
        </button>
      </div>

      {message ? (
        <p className="rounded border border-brand-blue/40 bg-brand-blue/15 px-3 py-2 text-sm text-white" role="status">
          {message}
        </p>
      ) : null}

      <section className="space-y-3">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {imports
            .filter((i) => i.section === "core")
            .map((item) => (
              <ImportCardView key={item.id} item={item} onOpen={openImporter} />
            ))}
        </div>
      </section>

      <section className="space-y-3 pt-2">
        <h2 className="text-sm font-bold tracking-wide text-white">MASS-IMPORT FROM OTHER PLATFORMS</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {imports
            .filter((i) => i.section === "platforms")
            .map((item) => (
              <ImportCardView key={item.id} item={item} onOpen={openImporter} />
            ))}
        </div>
      </section>
    </div>
  );
}

function ImportCardView({
  item,
  onOpen,
}: {
  item: ImportCard;
  onOpen: (title: string) => void;
}) {
  return (
    <article className="flex h-full flex-col rounded border border-border bg-surface p-5 shadow-soft">
      <h3 className="text-sm font-bold text-white">{item.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted">{item.description}</p>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => onOpen(item.title)}
          className="rounded-full border border-white/70 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-blue/30"
        >
          Mass-Importer
        </button>
      </div>
    </article>
  );
}
