"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseStaffForm } from "@/lib/staff";

export async function createStaff(formData: FormData) {
  const supabase = await createClient();
  const staff = parseStaffForm(formData);

  const { error } = await supabase.from("staff").insert(staff);
  if (error) throw new Error(error.message);

  revalidatePath("/staff");
  redirect("/staff");
}

export async function updateStaff(id: string, formData: FormData) {
  const supabase = await createClient();
  const staff = parseStaffForm(formData);

  const { error } = await supabase.from("staff").update(staff).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/staff");
  redirect("/staff");
}

export async function toggleStaffActive(id: string, nextActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("staff")
    .update({ active: nextActive })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/staff");
  revalidatePath("/dashboard");
}
