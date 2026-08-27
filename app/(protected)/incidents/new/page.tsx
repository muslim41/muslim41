import { createClient } from "@/lib/supabase/server";
import { IncidentForm } from "@/components/IncidentForm";
import { createIncident } from "../actions";

export default async function NewIncidentPage() {
  const supabase = await createClient();
  const [{ data: venues }, { data: staff }] = await Promise.all([
    supabase.from("venues").select("id, name").eq("active", true).order("name"),
    supabase.from("staff").select("id, full_name").eq("active", true).order("full_name"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-100">Log Incident</h1>
        <p className="mt-1 text-sm text-slate-500">
          Record a new incident against a venue
        </p>
      </div>

      <IncidentForm
        action={createIncident}
        venues={venues ?? []}
        staff={staff ?? []}
        submitLabel="Log Incident"
      />
    </div>
  );
}
