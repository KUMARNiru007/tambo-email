"use server";

import { createSupabaseServerClient } from "@/lib/superbase/server";

/**
 * Summarize recent received emails for the current authenticated user
 * Returns a text summary of up to 5 most recent emails
 */
export async function summarizeEmails() {
  const supabase = createSupabaseServerClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Fetch recent received emails
  const { data, error } = await supabase
    .from("emails")
    .select("subject, body, created_at")
    .eq("user_id", user.id)
    .eq("direction", "received")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching emails for summary:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      summary: "You have no received emails yet.",
      count: 0,
    };
  }

  // Create summary
  const summary = data
    .map((e, i) => `${i + 1}. ${e.subject} (${new Date(e.created_at).toLocaleDateString()})`)
    .join("\n");

  return {
    summary: `You have ${data.length} recent email${data.length > 1 ? 's' : ''}:\n\n${summary}`,
    count: data.length,
    emails: data,
  };
}