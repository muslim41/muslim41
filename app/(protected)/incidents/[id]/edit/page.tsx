import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { IncidentRecord } from "@/lib/incidents";
import { IncidentForm } from "@/components/IncidentForm";
import { updateIncident } from "../../actions";

export default async function EditIncidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data, error }, { data: venues }, { data: staff }] = await Promise.all([
    supabase.from("incidents").select("*").eq("id", id).maybeSingle(),
    supabase.from("venues").select("id, name").order("name"),
    supabase.from("staff").select("id, full_name").order("full_name"),
  ]);

  if (error) throw new Error(error.message);
  if (!data) notFound();
  const incident = data as IncidentRecord;

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-100">
          Edit Incident
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update details, severity, or resolution status
        </p>
      </div>

      <IncidentForm
        action={updateIncident.bind(null, incident.id)}
        incident={incident}
        venues={venues ?? []}
        staff={staff ?? []}
        submitLabel="Save Changes"
      />
    </div>
  );
}
