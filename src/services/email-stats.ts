"use server";

import { createSupabaseServerClient } from "@/lib/superbase/server";

/**
 * Get email statistics for the current authenticated user
 * Returns count of sent and draft emails
 */
export async function emailStats() {
  const supabase = createSupabaseServerClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Fetch all emails for this user
  const { data, error } = await supabase
    .from("emails")
    .select("status")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching email stats:", error);
    throw error;
  }

  // Count by status
  const sent = data.filter(e => e.status === "sent").length;
  const drafts = data.filter(e => e.status === "draft").length;

  return { sent, drafts, total: sent + drafts };
}