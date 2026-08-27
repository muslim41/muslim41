import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ShiftRecord } from "@/lib/shifts";
import { ShiftForm } from "@/components/ShiftForm";
import { updateShift } from "../../actions";

export default async function EditShiftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data, error }, { data: venues }, { data: staff }] = await Promise.all([
    supabase.from("shifts").select("*").eq("id", id).maybeSingle(),
    // All venues/staff (not just active) so the current assignment stays
    // selectable even if it's since been deactivated.
    supabase.from("venues").select("id, name").order("name"),
    supabase.from("staff").select("id, full_name").order("full_name"),
  ]);

  if (error) throw new Error(error.message);
  if (!data) notFound();
  const shift = data as ShiftRecord;

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-100">Edit Shift</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the assignment, timing, or status
        </p>
      </div>

      <ShiftForm
        action={updateShift.bind(null, shift.id)}
        shift={shift}
        venues={venues ?? []}
        staff={staff ?? []}
        submitLabel="Save Changes"
      />
    </div>
  );
}
