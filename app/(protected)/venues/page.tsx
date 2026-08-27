import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { VenueRecord } from "@/lib/venues";
import { toggleVenueActive } from "./actions";

export default async function VenuesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  const venues = (data ?? []) as VenueRecord[];

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Venues</h1>
          <p className="mt-1 text-sm text-slate-500">
            {venues.length} venue{venues.length === 1 ? "" : "s"} on contract
            with ABC Security Ltd
          </p>
        </div>
        <Link
          href="/venues/new"
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          + Add Venue
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Venue</th>
              <th className="px-4 py-2.5 font-medium">City</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 text-right font-medium">
                Required
              </th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {venues.map((venue) => (
              <tr key={venue.id} className={venue.active ? undefined : "opacity-50"}>
                <td className="px-4 py-2.5 font-medium text-slate-200">
                  {venue.name}
                  <div className="text-xs font-normal text-slate-500">
                    {venue.address}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-slate-400">{venue.city}</td>
                <td className="px-4 py-2.5 capitalize text-slate-400">
                  {venue.venue_type}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-300">
                  {venue.required_headcount}
                </td>
                <td className="px-4 py-2.5">
                  {venue.active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/venues/${venue.id}/edit`}
                      className="text-xs font-medium text-slate-400 transition hover:text-emerald-400"
                    >
                      Edit
                    </Link>
                    <form action={toggleVenueActive.bind(null, venue.id, !venue.active)}>
                      <button
                        type="submit"
                        className="text-xs font-medium text-slate-400 transition hover:text-red-400"
                      >
                        {venue.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
