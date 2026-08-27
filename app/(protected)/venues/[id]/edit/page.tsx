import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { VenueRecord } from "@/lib/venues";
import { VenueForm } from "@/components/VenueForm";
import { updateVenue } from "../../actions";

export default async function EditVenuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) notFound();
  const venue = data as VenueRecord;

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-100">
          Edit {venue.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Update venue details</p>
      </div>

      <VenueForm
        action={updateVenue.bind(null, venue.id)}
        venue={venue}
        submitLabel="Save Changes"
      />
    </div>
  );
}
