export type VenueRecord = {
  id: string;
  name: string;
  client_name: string;
  address: string;
  city: string;
  venue_type: string;
  required_headcount: number;
  active: boolean;
  created_at: string;
};

export type VenueInput = {
  name: string;
  address: string;
  city: string;
  venue_type: string;
  required_headcount: number;
  active: boolean;
};

export function parseVenueForm(formData: FormData): VenueInput {
  const headcount = Number(formData.get("required_headcount"));

  return {
    name: String(formData.get("name") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    venue_type: String(formData.get("venue_type") ?? "").trim() || "commercial",
    required_headcount: Number.isFinite(headcount) ? Math.max(0, Math.trunc(headcount)) : 1,
    active: formData.get("active") === "on",
  };
}
