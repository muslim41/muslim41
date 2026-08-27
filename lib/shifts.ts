export type ShiftStatus =
  | "scheduled"
  | "confirmed"
  | "absent"
  | "completed"
  | "cancelled";

export type ShiftRecord = {
  id: string;
  venue_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  status: ShiftStatus;
  created_at: string;
};

export type ShiftInput = {
  venue_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  status: string;
};

export function parseShiftForm(formData: FormData): ShiftInput {
  return {
    venue_id: String(formData.get("venue_id") ?? ""),
    staff_id: String(formData.get("staff_id") ?? ""),
    start_time: new Date(String(formData.get("start_time"))).toISOString(),
    end_time: new Date(String(formData.get("end_time"))).toISOString(),
    status: String(formData.get("status") ?? "scheduled"),
  };
}

// Converts an ISO timestamp to the "YYYY-MM-DDTHH:mm" format
// <input type="datetime-local"> expects for its defaultValue.
export function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
