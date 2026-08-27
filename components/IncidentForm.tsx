import Link from "next/link";
import type { IncidentRecord } from "@/lib/incidents";
import { toDatetimeLocal } from "@/lib/shifts";

export function IncidentForm({
  action,
  incident,
  venues,
  staff,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  incident?: IncidentRecord;
  venues: { id: string; name: string }[];
  staff: { id: string; full_name: string }[];
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={incident?.title}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          placeholder="e.g. Unauthorised entry attempt"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={incident?.description}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label
          htmlFor="venue_id"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Venue
        </label>
        <select
          id="venue_id"
          name="venue_id"
          required
          defaultValue={incident?.venue_id ?? ""}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
        >
          <option value="" disabled>
            Select a venue
          </option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="reported_by"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Reported by
        </label>
        <select
          id="reported_by"
          name="reported_by"
          defaultValue={incident?.reported_by ?? ""}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
        >
          <option value="">Unknown / unspecified</option>
          {staff.map((person) => (
            <option key={person.id} value={person.id}>
              {person.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="severity"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            defaultValue={incident?.severity ?? "low"}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={incident?.status ?? "open"}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="occurred_at"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Occurred at
        </label>
        <input
          id="occurred_at"
          name="occurred_at"
          type="datetime-local"
          required
          defaultValue={
            incident ? toDatetimeLocal(incident.occurred_at) : toDatetimeLocal(new Date().toISOString())
          }
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          {submitLabel}
        </button>
        <Link
          href="/incidents"
          className="rounded border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
