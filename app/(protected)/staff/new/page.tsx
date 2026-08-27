import { StaffForm } from "@/components/StaffForm";
import { createStaff } from "../actions";

export default function NewStaffPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-100">Add Staff</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new guard, supervisor, or controller to the roster
        </p>
      </div>

      <StaffForm action={createStaff} submitLabel="Add Staff" />
    </div>
  );
}
