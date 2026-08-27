import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StaffRecord } from "@/lib/staff";
import { StaffForm } from "@/components/StaffForm";
import { updateStaff } from "../../actions";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) notFound();
  const staff = data as StaffRecord;

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-100">
          Edit {staff.full_name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Update staff details</p>
      </div>

      <StaffForm
        action={updateStaff.bind(null, staff.id)}
        staff={staff}
        submitLabel="Save Changes"
      />
    </div>
  );
}
