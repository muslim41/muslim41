import { VenueForm } from "@/components/VenueForm";
import { createVenue } from "../actions";

export default function NewVenuePage() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-100">Add Venue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new site to ABC Security Ltd&apos;s contract book
        </p>
      </div>

      <VenueForm action={createVenue} submitLabel="Add Venue" />
    </div>
  );
}
