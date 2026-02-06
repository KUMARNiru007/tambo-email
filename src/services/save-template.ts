"use server";

import { createSupabaseServerClient } from "@/lib/superbase/server";

/**
 * Save a new email template for the current authenticated user
 * @param name - Template name/title
 * @param content - Template content/body
 */
export async function saveTemplate(name: string, content: string) {
  const supabase = createSupabaseServerClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("templates")
    .insert({
      user_id: user.id,
      name,
      content,
    });

  if (error) {
    console.error("Error saving template:", error);
    throw error;
  }

  return { status: "saved", message: `Template "${name}" saved successfully` };
}