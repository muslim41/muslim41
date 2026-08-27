import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Venues", href: "#", active: false },
  { label: "Staff", href: "#", active: false },
  { label: "Shifts", href: "#", active: false },
  { label: "Incidents", href: "#", active: false },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800 bg-[#0a0e14]">
        <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5c-.34 0-.68.09-.98.27l-7 4.2A2 2 0 0 0 3 7.7v4.8c0 5.05 3.41 9.53 8.31 10.94.45.13.93.13 1.38 0C17.59 22.03 21 17.55 21 12.5V7.7a2 2 0 0 0-1.02-1.74l-7-4.2c-.3-.18-.64-.27-.98-.27Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-slate-100">
              SecOps
            </p>
            <p className="text-[11px] leading-tight text-slate-500">
              Control Room
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              aria-disabled={!item.active}
              className={
                item.active
                  ? "flex items-center justify-between rounded bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400"
                  : "flex items-center justify-between rounded px-3 py-2 text-sm text-slate-600"
              }
            >
              {item.label}
              {!item.active && (
                <span className="rounded-sm bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                  Soon
                </span>
              )}
            </span>
          ))}
        </nav>

        <div className="border-t border-slate-800 px-3 py-4">
          <div className="mb-3 px-3">
            <p className="truncate text-xs font-medium text-slate-300">
              {user.email}
            </p>
            <p className="text-[11px] text-slate-600">ABC Security Ltd</p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full rounded border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
