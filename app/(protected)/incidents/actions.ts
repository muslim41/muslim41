"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseIncidentForm } from "@/lib/incidents";

export async function createIncident(formData: FormData) {
  const supabase = await createClient();
  const incident = parseIncidentForm(formData);

  const { error } = await supabase.from("incidents").insert(incident);
  if (error) throw new Error(error.message);

  revalidatePath("/incidents");
  revalidatePath("/dashboard");
  redirect("/incidents");
}

export async function updateIncident(id: string, formData: FormData) {
  const supabase = await createClient();
  const incident = parseIncidentForm(formData);

  const { error } = await supabase.from("incidents").update(incident).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/incidents");
  revalidatePath("/dashboard");
  redirect("/incidents");
}
