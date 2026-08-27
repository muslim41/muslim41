import Link from "next/link";
import type { ShiftRecord } from "@/lib/shifts";
import { toDatetimeLocal } from "@/lib/shifts";

export function ShiftForm({
  action,
  shift,
  venues,
  staff,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  shift?: ShiftRecord;
  venues: { id: string; name: string }[];
  staff: { id: string; full_name: string }[];
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-lg space-y-4">
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
          defaultValue={shift?.venue_id ?? ""}
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
          htmlFor="staff_id"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Staff member
        </label>
        <select
          id="staff_id"
          name="staff_id"
          required
          defaultValue={shift?.staff_id ?? ""}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
        >
          <option value="" disabled>
            Select a staff member
          </option>
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
            htmlFor="start_time"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Start
          </label>
          <input
            id="start_time"
            name="start_time"
            type="datetime-local"
            required
            defaultValue={shift ? toDatetimeLocal(shift.start_time) : undefined}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="end_time"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            End
          </label>
          <input
            id="end_time"
            name="end_time"
            type="datetime-local"
            required
            defaultValue={shift ? toDatetimeLocal(shift.end_time) : undefined}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>
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
          defaultValue={shift?.status ?? "scheduled"}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
        >
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="absent">Absent</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          {submitLabel}
        </button>
        <Link
          href="/shifts"
          className="rounded border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
