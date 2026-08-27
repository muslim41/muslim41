export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "investigating" | "closed";

export type IncidentRecord = {
  id: string;
  venue_id: string;
  reported_by: string | null;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  occurred_at: string;
  created_at: string;
};

export type IncidentInput = {
  venue_id: string;
  reported_by: string | null;
  title: string;
  description: string;
  severity: string;
  status: string;
  occurred_at: string;
};

export function parseIncidentForm(formData: FormData): IncidentInput {
  const reportedBy = String(formData.get("reported_by") ?? "").trim();

  return {
    venue_id: String(formData.get("venue_id") ?? ""),
    reported_by: reportedBy || null,
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    severity: String(formData.get("severity") ?? "low"),
    status: String(formData.get("status") ?? "open"),
    occurred_at: new Date(String(formData.get("occurred_at"))).toISOString(),
  };
}
