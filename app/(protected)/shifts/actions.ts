"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseShiftForm } from "@/lib/shifts";

export async function createShift(formData: FormData) {
  const supabase = await createClient();
  const shift = parseShiftForm(formData);

  const { error } = await supabase.from("shifts").insert(shift);
  if (error) throw new Error(error.message);

  revalidatePath("/shifts");
  revalidatePath("/dashboard");
  redirect("/shifts");
}

export async function updateShift(id: string, formData: FormData) {
  const supabase = await createClient();
  const shift = parseShiftForm(formData);

  const { error } = await supabase.from("shifts").update(shift).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/shifts");
  revalidatePath("/dashboard");
  redirect("/shifts");
}
