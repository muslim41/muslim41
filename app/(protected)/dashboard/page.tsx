import { createClient } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/dashboard-data";
import { StatCard } from "@/components/StatCard";
import { AlertCard } from "@/components/AlertCard";

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

      <AlertCard understaffedVenues={summary.understaffedVenues} />

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
