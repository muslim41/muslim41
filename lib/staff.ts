export type StaffRole = "guard" | "supervisor" | "controller";

export type StaffRecord = {
  id: string;
  full_name: string;
  role: StaffRole;
  email: string | null;
  phone: string | null;
  sia_licence_number: string | null;
  sia_licence_type: string;
  sia_licence_expiry: string | null;
  active: boolean;
  created_at: string;
};

export type StaffInput = {
  full_name: string;
  role: string;
  email: string | null;
  phone: string | null;
  sia_licence_number: string | null;
  sia_licence_type: string;
  sia_licence_expiry: string | null;
  active: boolean;
};

export function parseStaffForm(formData: FormData): StaffInput {
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const licenceNumber = String(formData.get("sia_licence_number") ?? "").trim();
  const licenceExpiry = String(formData.get("sia_licence_expiry") ?? "").trim();

  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    role: String(formData.get("role") ?? "guard").trim() || "guard",
    email: email || null,
    phone: phone || null,
    sia_licence_number: licenceNumber || null,
    sia_licence_type:
      String(formData.get("sia_licence_type") ?? "").trim() || "Door Supervisor",
    sia_licence_expiry: licenceExpiry || null,
    active: formData.get("active") === "on",
  };
}
