import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ShiftStatus } from "@/lib/shifts";

type ShiftRow = {
  id: string;
  start_time: string;
  end_time: string;
  status: ShiftStatus;
  venues: { name: string } | null;
  staff: { full_name: string } | null;
};

const STATUS_STYLES: Record<ShiftStatus, string> = {
  scheduled: "bg-slate-800 text-slate-300",
  confirmed: "bg-emerald-950/60 text-emerald-400",
  absent: "bg-red-950/60 text-red-400",
  completed: "bg-slate-800 text-slate-500",
  cancelled: "bg-slate-800 text-slate-500 line-through",
};

function formatRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const day = startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const startTime = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = endDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day}, ${startTime}–${endTime}`;
}

export default async function ShiftsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shifts")
    .select("id, start_time, end_time, status, venues(name), staff(full_name)")
    .order("start_time", { ascending: false });

  if (error) throw new Error(error.message);
  const shifts = (data ?? []) as unknown as ShiftRow[];

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Shifts</h1>
          <p className="mt-1 text-sm text-slate-500">
            {shifts.length} shift{shifts.length === 1 ? "" : "s"} scheduled
          </p>
        </div>
        <Link
          href="/shifts/new"
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          + Add Shift
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Venue</th>
              <th className="px-4 py-2.5 font-medium">Staff</th>
              <th className="px-4 py-2.5 font-medium">When</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="px-4 py-2.5 font-medium text-slate-200">
                  {shift.venues?.name ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-slate-400">
                  {shift.staff?.full_name ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-slate-400">
                  {formatRange(shift.start_time, shift.end_time)}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[shift.status]}`}
                  >
                    {shift.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/shifts/${shift.id}/edit`}
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
