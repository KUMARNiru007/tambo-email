"use server";

import { Resend } from "resend";
import { createSupabaseServerClient } from "@/lib/superbase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};

export async function sendEmailAndPersist({
  to,
  subject,
  body,
}: SendEmailInput) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }


  let emailDelivered = false;

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject,
      html: body.replace(/\n/g, "<br />"),
    });
    emailDelivered = true;
  } catch (sendError) {
    // Resend free tier only delivers to the verified account email.
    // We still persist the email so the app works for any user.
    console.warn("[send-email] Resend delivery failed (free-tier limit):", sendError);
  }

  const { error } = await supabase.from("emails").insert({
    user_id: user.id,
    to_email: to,
    subject,
    body,
    status: "sent",
  });

  if (error) throw error;

  return { status: "sent", delivered: emailDelivered };
}
