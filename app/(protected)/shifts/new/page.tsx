import { createClient } from "@/lib/supabase/server";
import { ShiftForm } from "@/components/ShiftForm";
import { createShift } from "../actions";

export default async function NewShiftPage() {
  const supabase = await createClient();
  const [{ data: venues }, { data: staff }] = await Promise.all([
    supabase.from("venues").select("id, name").eq("active", true).order("name"),
    supabase.from("staff").select("id, full_name").eq("active", true).order("full_name"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-100">Add Shift</h1>
        <p className="mt-1 text-sm text-slate-500">
          Assign a staff member to a venue for a shift
        </p>
      </div>

      <ShiftForm
        action={createShift}
        venues={venues ?? []}
        staff={staff ?? []}
        submitLabel="Add Shift"
      />
    </div>
  );
}
