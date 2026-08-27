import { createClient } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/dashboard-data";

function StatCard({
  label,
  value,
  tone = "default",
  caption,
}: {
  label: string;
  value: number;
  tone?: "default" | "danger" | "warning";
  caption?: string;
}) {
  const toneClasses = {
    default: "border-slate-800 bg-slate-900/60",
    danger: "border-red-900/60 bg-red-950/30",
    warning: "border-amber-900/60 bg-amber-950/20",
  }[tone];

  const valueClasses = {
    default: "text-slate-100",
    danger: "text-red-400",
    warning: "text-amber-400",
  }[tone];

  return (
    <div className={`rounded-lg border ${toneClasses} p-5`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-semibold tabular-nums ${valueClasses}`}>
        {value}
      </p>
      {caption && <p className="mt-1 text-xs text-slate-500">{caption}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const summary = await getDashboardSummary(supabase);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            Operations Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">{today}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-900/60 bg-emerald-950/30 px-3 py-1.5 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Venues" value={summary.totalVenues} />
        <StatCard
          label="Guards on Shift Today"
          value={summary.guardsOnShiftToday}
        />
        <StatCard
          label="Understaffed Venues"
          value={summary.understaffedVenues.length}
          tone={summary.understaffedVenues.length > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Open Incidents"
          value={summary.openIncidents}
          tone={summary.openIncidents > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="SIA Licences Expiring (30 days)"
          value={summary.licencesExpiringSoon}
          tone={summary.licencesExpiringSoon > 0 ? "warning" : "default"}
        />
        <StatCard
          label="SIA Licences Already Expired"
          value={summary.licencesExpired}
          tone={summary.licencesExpired > 0 ? "danger" : "default"}
        />
      </div>

      {summary.understaffedVenues.length > 0 && (
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
              Staffing Alert — {summary.understaffedVenues.length} venue
              {summary.understaffedVenues.length === 1 ? "" : "s"} below
              required headcount
            </h2>
          </div>
          <ul className="divide-y divide-red-900/40">
            {summary.understaffedVenues.map((venue) => (
              <li
                key={venue.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <div>
                  <span className="font-medium text-slate-200">
                    {venue.name}
                  </span>
                  <span className="ml-2 text-slate-500">{venue.city}</span>
                </div>
                <span className="font-medium text-red-400 tabular-nums">
                  {venue.assigned_today} / {venue.required_headcount} assigned
                  &nbsp;
                  <span className="text-red-500">
                    (-{venue.shortfall})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-300">
          All Venues — Today&apos;s Staffing
        </h2>
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Venue</th>
                <th className="px-4 py-2.5 font-medium">City</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 text-right font-medium">
                  Assigned
                </th>
                <th className="px-4 py-2.5 text-right font-medium">
                  Required
                </th>
                <th className="px-4 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {summary.allVenues.map((venue) => (
                <tr
                  key={venue.id}
                  className={
                    venue.understaffed ? "bg-red-950/10" : undefined
                  }
                >
                  <td className="px-4 py-2.5 font-medium text-slate-200">
                    {venue.name}
                  </td>
                  <td className="px-4 py-2.5 text-slate-400">{venue.city}</td>
                  <td className="px-4 py-2.5 capitalize text-slate-400">
                    {venue.venue_type}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-300">
                    {venue.assigned_today}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-300">
                    {venue.required_headcount}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {venue.understaffed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-950/60 px-2 py-0.5 text-xs font-medium text-red-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        Understaffed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Fully staffed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
