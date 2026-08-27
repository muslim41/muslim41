"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseVenueForm } from "@/lib/venues";

export async function createVenue(formData: FormData) {
  const supabase = await createClient();
  const venue = parseVenueForm(formData);

  const { error } = await supabase.from("venues").insert(venue);
  if (error) throw new Error(error.message);

  revalidatePath("/venues");
  revalidatePath("/dashboard");
  redirect("/venues");
}

export async function updateVenue(id: string, formData: FormData) {
  const supabase = await createClient();
  const venue = parseVenueForm(formData);

  const { error } = await supabase.from("venues").update(venue).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/venues");
  revalidatePath("/dashboard");
  redirect("/venues");
}

export async function toggleVenueActive(id: string, nextActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("venues")
    .update({ active: nextActive })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/venues");
  revalidatePath("/dashboard");
}
