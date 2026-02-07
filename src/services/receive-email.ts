"use server";

import { createSupabaseServerClient } from "@/lib/superbase/server";

/**
 * Receive an email (save it to the database as received)
 * This is for demo/testing purposes to simulate receiving emails
 */
export async function receiveEmail({
  from,
  subject,
  body,
}: {
  from: string;
  subject: string;
  body: string;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase.from("emails").insert({
    user_id: user.id,
    from_email: from,
    to_email: user.email || "you@example.com", // Default to user's email
    subject,
    body,
    status: "received",
    direction: "received",
  });

  if (error) {
    console.error("Error receiving email:", error);
    throw error;
  }

  return { status: "received", message: "Email received successfully" };
}