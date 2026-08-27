import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { IncidentSeverity, IncidentStatus } from "@/lib/incidents";

type IncidentRow = {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  occurred_at: string;
  venues: { name: string } | null;
};

const SEVERITY_STYLES: Record<IncidentSeverity, string> = {
  low: "bg-slate-800 text-slate-300",
  medium: "bg-amber-950/60 text-amber-400",
  high: "bg-orange-950/60 text-orange-400",
  critical: "bg-red-950/60 text-red-400",
};

const STATUS_STYLES: Record<IncidentStatus, string> = {
  open: "bg-red-950/60 text-red-400",
  investigating: "bg-amber-950/60 text-amber-400",
  closed: "bg-slate-800 text-slate-500",
};

export default async function IncidentsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("incidents")
    .select("id, title, severity, status, occurred_at, venues(name)")
    .order("occurred_at", { ascending: false });

  if (error) throw new Error(error.message);
  const incidents = (data ?? []) as unknown as IncidentRow[];

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Incidents</h1>
          <p className="mt-1 text-sm text-slate-500">
            {incidents.length} incident{incidents.length === 1 ? "" : "s"} logged
          </p>
        </div>
        <Link
          href="/incidents/new"
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          + Log Incident
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Title</th>
              <th className="px-4 py-2.5 font-medium">Venue</th>
              <th className="px-4 py-2.5 font-medium">Occurred</th>
              <th className="px-4 py-2.5 font-medium">Severity</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td className="px-4 py-2.5 font-medium text-slate-200">
                  {incident.title}
                </td>
                <td className="px-4 py-2.5 text-slate-400">
                  {incident.venues?.name ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-slate-400">
                  {new Date(incident.occurred_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${SEVERITY_STYLES[incident.severity]}`}
                  >
                    {incident.severity}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[incident.status]}`}
                  >
                    {incident.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/incidents/${incident.id}/edit`}
                    className="text-xs font-medium text-slate-400 transition hover:text-emerald-400"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
