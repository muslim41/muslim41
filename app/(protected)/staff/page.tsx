import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { StaffRecord } from "@/lib/staff";
import { toggleStaffActive } from "./actions";

function licenceBadge(expiry: string | null) {
  if (!expiry) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
        No licence on file
      </span>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);
  const expiryDate = new Date(expiry);

  const formatted = expiryDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (expiryDate < today) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-950/60 px-2 py-0.5 text-xs font-medium text-red-400">
        Expired {formatted}
      </span>
    );
  }
  if (expiryDate <= in30Days) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2 py-0.5 text-xs font-medium text-amber-400">
        Expires {formatted}
      </span>
    );
  }
  return <span className="text-xs text-slate-400">Valid to {formatted}</span>;
}

export default async function StaffPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .order("full_name");

  if (error) throw new Error(error.message);
  const staff = (data ?? []) as StaffRecord[];

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Staff</h1>
          <p className="mt-1 text-sm text-slate-500">
            {staff.length} people on ABC Security Ltd&apos;s roster
          </p>
        </div>
        <Link
          href="/staff/new"
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          + Add Staff
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Contact</th>
              <th className="px-4 py-2.5 font-medium">SIA Licence</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {staff.map((person) => (
              <tr key={person.id} className={person.active ? undefined : "opacity-50"}>
                <td className="px-4 py-2.5 font-medium text-slate-200">
                  {person.full_name}
                </td>
                <td className="px-4 py-2.5 capitalize text-slate-400">
                  {person.role}
                </td>
                <td className="px-4 py-2.5 text-xs text-slate-400">
                  {person.email && <div>{person.email}</div>}
                  {person.phone && <div>{person.phone}</div>}
                </td>
                <td className="px-4 py-2.5">{licenceBadge(person.sia_licence_expiry)}</td>
                <td className="px-4 py-2.5">
                  {person.active ? (
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
                      href={`/staff/${person.id}/edit`}
                      className="text-xs font-medium text-slate-400 transition hover:text-emerald-400"
                    >
                      Edit
                    </Link>
                    <form action={toggleStaffActive.bind(null, person.id, !person.active)}>
                      <button
                        type="submit"
                        className="text-xs font-medium text-slate-400 transition hover:text-red-400"
                      >
                        {person.active ? "Deactivate" : "Activate"}
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
