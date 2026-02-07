"use server";

import { createSupabaseServerClient } from "@/lib/superbase/server";

/**
 * Save a new email template for the current authenticated user.
 * Accepts a single object so it works when invoked as a Tambo tool with { name, content }.
 */
export async function saveTemplate({
  name,
  content,
}: {
  name: string;
  content: string;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const nameStr =
    name != null && typeof name === "string" ? String(name).trim() : "";
  const contentStr =
    content != null && typeof content === "string" ? String(content) : "";

  if (!nameStr) {
    throw new Error("Template name is required");
  }

  const { error } = await supabase.from("templates").insert({
    user_id: user.id,
    name: nameStr,
    content: contentStr,
  });

  if (error) {
    console.error("Error saving template:", error);
    throw error;
  }

  return { status: "saved", message: `Template "${nameStr}" saved successfully` };
}