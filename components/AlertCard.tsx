import type { VenueStaffing } from "@/lib/dashboard-data";

export function AlertCard({
  understaffedVenues,
}: {
  understaffedVenues: VenueStaffing[];
}) {
  if (understaffedVenues.length === 0) return null;

  return (
    <div className="mt-8 rounded-lg border border-red-900/60 bg-red-950/20 p-5">
      <div className="mb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 text-red-400"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-sm font-semibold text-red-400">
          Staffing Alert — {understaffedVenues.length} venue
          {understaffedVenues.length === 1 ? "" : "s"} below required
          headcount
        </h2>
      </div>
      <ul className="divide-y divide-red-900/40">
        {understaffedVenues.map((venue) => (
          <li
            key={venue.id}
            className="flex items-center justify-between py-2 text-sm"
          >
            <div>
              <span className="font-medium text-slate-200">{venue.name}</span>
              <span className="ml-2 text-slate-500">{venue.city}</span>
            </div>
            <span className="font-medium text-red-400 tabular-nums">
              {venue.assigned_today} / {venue.required_headcount} assigned
              &nbsp;
              <span className="text-red-500">(-{venue.shortfall})</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
