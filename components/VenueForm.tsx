import Link from "next/link";
import type { VenueRecord } from "@/lib/venues";

export function VenueForm({
  action,
  venue,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  venue?: VenueRecord;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Venue name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={venue?.name}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          placeholder="e.g. Meridian Shopping Centre"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          defaultValue={venue?.address}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          placeholder="Street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="city"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            defaultValue={venue?.city}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="venue_type"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Venue type
          </label>
          <input
            id="venue_type"
            name="venue_type"
            type="text"
            defaultValue={venue?.venue_type ?? "commercial"}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
            placeholder="e.g. retail, office, nightlife"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="required_headcount"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Required headcount
        </label>
        <input
          id="required_headcount"
          name="required_headcount"
          type="number"
          min={0}
          required
          defaultValue={venue?.required_headcount ?? 1}
          className="w-32 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={venue?.active ?? true}
          className="h-4 w-4 rounded border-slate-700 bg-slate-950 accent-emerald-500"
        />
        <label htmlFor="active" className="text-sm text-slate-300">
          Active
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          {submitLabel}
        </button>
        <Link
          href="/venues"
          className="rounded border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
