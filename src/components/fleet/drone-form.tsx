"use client";

import { useActionState, useEffect, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createAircraftAction,
  deleteAircraftAction,
  updateAircraftAction,
  type AircraftUpdateState,
} from "@/app/actions/aircraft";
import { AIRCRAFT_STATUSES, AIRCRAFT_TYPES, PROPULSION_TYPES } from "@/lib/inventory";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DroneFormValues = {
  id: string;
  name: string;
  tail: string;
  model: string;
  manufacturer: string;
  legalId: string;
  serial: string;
  statusValue: string;
  hours: number;
  flightCount: number;
  internalSerial: string;
  flightControllerSerial: string;
  remoteControllerSerial: string;
  remoteController2Serial: string;
  softwareInformation: string;
  aircraftType: string;
  geometry: string;
  inventoryAssetNumber: string;
  description: string;
  tags: string;
  location: string;
  ownerLabel: string;
  complianceCategory: string;
  firmwareVersion: string;
  hardwareVersion: string;
  propulsionType: string;
  weightKg: number;
  maxGrossTakeoffKg: number;
  maxPayloadKg: number;
  color: string;
  maxSpeedMs: number;
  maxVerticalSpeedMs: number;
  maxFlightTimeSeconds: number;
  outOfSightDistance: number;
  purchaseDate: string;
  insurableValue: number;
  loanerDrone: boolean;
  excludedFromLegalReport: boolean;
  remoteId: string;
  connectivitySlot1: string;
  connectivitySlot1Extra: string;
  connectivitySlot2: string;
  connectivitySlot2Extra: string;
  videoSourceUrl: string;
};

const tabs = [
  { id: "overview", label: "Overview", title: "Drone overview" },
  { id: "geometry", label: "Geometry / Inventory", title: "Drone geometry / inventory" },
  { id: "extra", label: "Extra Information", title: "Extra information" },
  { id: "connect", label: "Connect", title: "Connect" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:ring-2 focus:ring-brand-blue/40";

const initial: AircraftUpdateState = {};

function splitSeconds(totalSeconds: number) {
  const total = Math.max(0, Math.round(totalSeconds));
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("block text-[11px] font-semibold uppercase tracking-wider text-foreground-muted", className)}>
      {label}
      {children}
      {hint ? <span className="mt-1 block text-[10px] font-normal normal-case tracking-normal">{hint}</span> : null}
    </label>
  );
}

function TimeInputs({
  prefix,
  hours,
  minutes,
  seconds,
}: {
  prefix: string;
  hours: number;
  minutes: number;
  seconds: number;
}) {
  return (
    <div className="mt-1 grid grid-cols-3 gap-2">
      <input name={`${prefix}H`} type="number" min={0} defaultValue={hours} className={inputClass.replace("mt-1 ", "")} aria-label="Hours" />
      <input name={`${prefix}M`} type="number" min={0} max={59} defaultValue={minutes} className={inputClass.replace("mt-1 ", "")} aria-label="Minutes" />
      <input name={`${prefix}S`} type="number" min={0} max={59} defaultValue={seconds} className={inputClass.replace("mt-1 ", "")} aria-label="Seconds" />
    </div>
  );
}

export function DroneForm({ mode, drone }: { mode: "create" | "edit"; drone?: DroneFormValues }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("overview");
  const actionFn = mode === "create" ? createAircraftAction : updateAircraftAction;
  const [state, action, pending] = useActionState(actionFn, initial);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const flightTime = splitSeconds(Math.round((drone?.hours ?? 0) * 3600));
  const maxFlight = splitSeconds(drone?.maxFlightTimeSeconds ?? 0);
  const activeTab = tabs.find((item) => item.id === tab) ?? tabs[0];

  useEffect(() => {
    if (state.ok && mode === "create" && state.id) router.push(`/fleet/${state.id}`);
    if (state.ok && mode === "edit") router.refresh();
  }, [mode, router, state.id, state.ok]);

  function onDelete() {
    if (!drone?.id) return;
    if (!window.confirm("Remove this drone from inventory?")) return;
    startDelete(async () => {
      try {
        await deleteAircraftAction(drone.id);
        router.push("/fleet");
        router.refresh();
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : "Failed to delete drone.");
      }
    });
  }

  return (
    <form action={action} className="space-y-6">
      {drone?.id ? <input type="hidden" name="id" value={drone.id} /> : null}
      <input type="hidden" name="registration" defaultValue={drone?.tail || ""} />

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              tab === item.id
                ? "border-status-operational bg-status-operational text-background"
                : "border-border bg-surface text-foreground hover:border-brand-blue/50",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold uppercase tracking-[0.14em] text-foreground">{activeTab.title}</h2>
        <div className="mx-auto mt-2 h-px w-16 bg-border" />
        <p className="mt-3 text-xs text-foreground-muted">
          Save stores every tab, including fields that are not on screen.
        </p>
      </div>

      <div className={cn("grid gap-4 md:grid-cols-3", tab !== "overview" && "hidden")}>
        <Field label="Drone name">
          <input name="name" defaultValue={drone?.name} className={inputClass} placeholder="Phoenix" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={drone?.statusValue || "operational"} className={inputClass}>
            {AIRCRAFT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Legal ID">
          <input name="legalId" defaultValue={drone?.legalId} className={inputClass} placeholder="KSA-55226" />
        </Field>
        <Field label="Brand">
          <input name="manufacturer" list="drone-brands" defaultValue={drone?.manufacturer || "DJI"} className={inputClass} />
          <datalist id="drone-brands">
            <option value="DJI" />
            <option value="Autel" />
            <option value="Freefly" />
            <option value="Quantum Systems" />
            <option value="Wingtra" />
            <option value="Parrot" />
          </datalist>
        </Field>
        <Field label="Model">
          <input name="model" list="drone-models" defaultValue={drone?.model} className={inputClass} placeholder="Matrice 350 RTK" />
          <datalist id="drone-models">
            <option value="Matrice 30" />
            <option value="Matrice 30T" />
            <option value="Matrice 300 RTK" />
            <option value="Matrice 350 RTK" />
            <option value="Mavic 3 Enterprise" />
            <option value="Trinity F90+" />
          </datalist>
        </Field>
        <Field label="Type">
          <select name="aircraftType" defaultValue={drone?.aircraftType || "multi_rotors"} className={inputClass}>
            {AIRCRAFT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Serial # (printed)">
          <input name="serialNumber" defaultValue={drone?.serial} className={inputClass} />
        </Field>
        <Field label="Serial # (internal)">
          <input name="internalSerial" defaultValue={drone?.internalSerial} className={inputClass} />
        </Field>
        <Field label="Flight controller serial #">
          <input name="flightControllerSerial" defaultValue={drone?.flightControllerSerial} className={inputClass} />
        </Field>
        <Field label="Remote controller serial #">
          <input name="remoteControllerSerial" defaultValue={drone?.remoteControllerSerial} className={inputClass} />
        </Field>
        <Field label="Remote controller 2 serial #" className="md:col-span-2">
          <input name="remoteController2Serial" defaultValue={drone?.remoteController2Serial} className={inputClass} />
        </Field>
        <Field label="Software information" className="md:col-span-3">
          <textarea name="softwareInformation" rows={3} defaultValue={drone?.softwareInformation} className={inputClass} />
        </Field>
        <p className="md:col-span-3 text-xs text-foreground-muted">
          Identifier: {drone?.id || "Assigned when you save"}
        </p>
      </div>

      <div className={cn("grid gap-4 md:grid-cols-2", tab !== "geometry" && "hidden")}>
        <Field label="Geometry">
          <input name="geometry" defaultValue={drone?.geometry} className={inputClass} placeholder="-" />
        </Field>
        <Field label="Inventory / asset #">
          <input name="inventoryAssetNumber" defaultValue={drone?.inventoryAssetNumber} className={inputClass} />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <textarea name="description" rows={3} defaultValue={drone?.description} className={inputClass} />
        </Field>
        <Field label="Tags" className="md:col-span-2">
          <input name="tags" defaultValue={drone?.tags} className={inputClass} placeholder="survey, thermal" />
        </Field>
        <Field label="Location" className="md:col-span-2">
          <input name="location" defaultValue={drone?.location} className={inputClass} placeholder="None" />
        </Field>
      </div>

      <div className={cn("grid gap-4 md:grid-cols-3", tab !== "extra" && "hidden")}>
        <Field label="Owner">
          <input name="ownerLabel" defaultValue={drone?.ownerLabel || "Shamal Technologies"} className={inputClass} />
        </Field>
        <Field label="Compliance category" className="md:col-span-2">
          <input name="complianceCategory" defaultValue={drone?.complianceCategory} className={inputClass} placeholder="-" />
        </Field>
        <Field label="Firmware version">
          <input name="firmwareVersion" defaultValue={drone?.firmwareVersion} className={inputClass} placeholder="Firmware version" />
        </Field>
        <Field label="Hardware version">
          <input name="hardwareVersion" defaultValue={drone?.hardwareVersion} className={inputClass} placeholder="Hardware version" />
        </Field>
        <Field label="Propulsion type">
          <select name="propulsionType" defaultValue={drone?.propulsionType || "electric"} className={inputClass}>
            {PROPULSION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Weight (kg)">
          <input name="weightKg" type="number" min={0} step="0.01" defaultValue={drone?.weightKg || ""} className={inputClass} />
        </Field>
        <Field label="Max gross takeoff limit (kg)">
          <input name="maxGrossTakeoffKg" type="number" min={0} step="0.01" defaultValue={drone?.maxGrossTakeoffKg ?? 0} className={inputClass} />
        </Field>
        <Field label="Max payload capacity (kg)">
          <input name="maxPayloadKg" type="number" min={0} step="0.01" defaultValue={drone?.maxPayloadKg ?? 0} className={inputClass} />
        </Field>
        <Field label="Color">
          <input name="color" defaultValue={drone?.color} className={inputClass} />
        </Field>
        <Field label="Max speed (m/s)">
          <input name="maxSpeedMs" type="number" min={0} step="0.1" defaultValue={drone?.maxSpeedMs ?? 0} className={inputClass} />
        </Field>
        <Field label="Max vertical speed (m/s)">
          <input name="maxVerticalSpeedMs" type="number" min={0} step="0.1" defaultValue={drone?.maxVerticalSpeedMs ?? 0} className={inputClass} />
        </Field>
        <Field label="Max flight time" hint="Format: hours : min : sec">
          <TimeInputs prefix="maxFlightTime" hours={maxFlight.h} minutes={maxFlight.m} seconds={maxFlight.s} />
        </Field>
        <Field label="Out of sight distance">
          <input name="outOfSightDistance" type="number" min={0} step="0.1" defaultValue={drone?.outOfSightDistance ?? 0} className={inputClass} />
        </Field>
        <Field label="Purchase date">
          <input name="purchaseDate" type="date" defaultValue={drone?.purchaseDate} className={inputClass} />
        </Field>
        <Field label="Insurable value">
          <input name="insurableValue" type="number" min={0} step="0.01" defaultValue={drone?.insurableValue ?? 0} className={inputClass} />
        </Field>
        <Field label="Initial flight #" >
          <input name="flightCount" type="number" min={0} defaultValue={drone?.flightCount ?? 0} className={inputClass} />
        </Field>
        <Field label="Initial flight time" hint="Format: hours : min : sec">
          <TimeInputs prefix="flightTime" hours={flightTime.h} minutes={flightTime.m} seconds={flightTime.s} />
        </Field>
        <div className="flex flex-col justify-end gap-3 pb-2">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input name="loanerDrone" type="checkbox" defaultChecked={drone?.loanerDrone} className="accent-brand-blue" />
            Loaner drone
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              name="excludedFromLegalReport"
              type="checkbox"
              defaultChecked={drone?.excludedFromLegalReport}
              className="accent-brand-blue"
            />
            Excluded from legal report
          </label>
        </div>
      </div>

      <div className={cn("grid gap-4", tab !== "connect" && "hidden")}>
        <Field label="Remote ID" className="max-w-md">
          <input name="remoteId" defaultValue={drone?.remoteId} className={inputClass} />
        </Field>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">Connectivity cards</p>
          <div className="mt-2 grid gap-3">
            <div className="grid items-center gap-2 md:grid-cols-[4rem_1fr_auto_8rem]">
              <span className="text-sm text-foreground">Slot 1</span>
              <input name="connectivitySlot1" defaultValue={drone?.connectivitySlot1} className={inputClass.replace("mt-1 ", "")} />
              <span className="text-foreground-muted">-</span>
              <input name="connectivitySlot1Extra" defaultValue={drone?.connectivitySlot1Extra} className={inputClass.replace("mt-1 ", "")} />
            </div>
            <div className="grid items-center gap-2 md:grid-cols-[4rem_1fr_auto_8rem]">
              <span className="text-sm text-foreground">Slot 2</span>
              <input name="connectivitySlot2" defaultValue={drone?.connectivitySlot2} className={inputClass.replace("mt-1 ", "")} />
              <span className="text-foreground-muted">-</span>
              <input name="connectivitySlot2Extra" defaultValue={drone?.connectivitySlot2Extra} className={inputClass.replace("mt-1 ", "")} />
            </div>
          </div>
        </div>
        <Field label="Video source URL">
          <input name="videoSourceUrl" defaultValue={drone?.videoSourceUrl} className={inputClass} placeholder="https://" />
        </Field>
      </div>

      {state.error ? <p className="text-center text-sm text-status-critical">{state.error}</p> : null}
      {deleteError ? <p className="text-center text-sm text-status-critical">{deleteError}</p> : null}
      {state.ok && mode === "edit" ? (
        <p className="text-center text-sm text-status-operational">Saved to MongoDB.</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={pending || isDeleting} className="min-w-28 rounded-full">
          {pending ? "Saving…" : "Save"}
        </Button>
        {mode === "edit" ? (
          <Button type="button" variant="outline" className="min-w-28 rounded-full" onClick={onDelete} disabled={pending || isDeleting}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        ) : null}
        <Link
          href="/fleet"
          className="inline-flex h-10 min-w-28 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground hover:bg-white/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
