"use server";

import { createSupabaseServerClient } from "@/lib/superbase/server";

/**
 * List all email templates for the current authenticated user
 * Ordered by creation date (newest first)
 */
export async function listTemplates() {
  const supabase = createSupabaseServerClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error listing templates:", error);
    throw error;
  }

  return data || [];
}