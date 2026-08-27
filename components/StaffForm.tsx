import Link from "next/link";
import type { StaffRecord } from "@/lib/staff";

export function StaffForm({
  action,
  staff,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  staff?: StaffRecord;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <div>
        <label
          htmlFor="full_name"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
        >
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          defaultValue={staff?.full_name}
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          placeholder="e.g. Jordan Wallace"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="role"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            defaultValue={staff?.role ?? "guard"}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          >
            <option value="guard">Guard</option>
            <option value="supervisor">Supervisor</option>
            <option value="controller">Controller</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sia_licence_type"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            SIA licence type
          </label>
          <input
            id="sia_licence_type"
            name="sia_licence_type"
            type="text"
            defaultValue={staff?.sia_licence_type ?? "Door Supervisor"}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={staff?.email ?? ""}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={staff?.phone ?? ""}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="sia_licence_number"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            SIA licence number
          </label>
          <input
            id="sia_licence_number"
            name="sia_licence_number"
            type="text"
            defaultValue={staff?.sia_licence_number ?? ""}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="sia_licence_expiry"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            SIA licence expiry
          </label>
          <input
            id="sia_licence_expiry"
            name="sia_licence_expiry"
            type="date"
            defaultValue={staff?.sia_licence_expiry ?? ""}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={staff?.active ?? true}
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
          href="/staff"
          className="rounded border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
