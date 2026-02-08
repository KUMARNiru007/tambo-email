"use client";

import { cn } from "@/lib/utils";
import { saveEmailDraft } from "@/services/save-email";
import { sendEmailAndPersist } from "@/services/send-email-and-persist";
import { Loader2, Send, Save, CheckCircle2 } from "lucide-react";
import * as React from "react";
import { z } from "zod";

export const emailActionsSchema = z.object({
  to: z.string().email().describe("Recipient email address"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body content"),
});

export type EmailActionsProps = z.infer<typeof emailActionsSchema> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * Renders Save draft and Send now buttons for an email.
 * Use right after EmailPreview with the same to, subject, body.
 * Calling the action persists via the backend.
 */
export const EmailActions = React.forwardRef<HTMLDivElement, EmailActionsProps>(
  ({ to, subject, body, className, ...props }, ref) => {
    const [status, setStatus] = React.useState<
      "idle" | "sending" | "saving" | "sent" | "saved" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const handleSend = async () => {
      // Validate inputs before sending
      if (!to || !subject || !body) {
        setStatus("error");
        setErrorMessage("Missing required fields (to, subject, or body)");
        return;
      }

      setStatus("sending");
      setErrorMessage(null);
      try {
        await sendEmailAndPersist({ 
          to: to || "", 
          subject: subject || "", 
          body: body || "" 
        });
        setStatus("sent");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Failed to send");
      }
    };

    const handleSaveDraft = async () => {
      // Validate inputs before saving
      if (!to || !subject || !body) {
        setStatus("error");
        setErrorMessage("Missing required fields (to, subject, or body)");
        return;
      }

      setStatus("saving");
      setErrorMessage(null);
      try {
        await saveEmailDraft({ 
          to: to || "", 
          subject: subject || "", 
          body: body || "" 
        });
        setStatus("saved");
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to save draft"
        );
      }
    };

    const busy = status === "sending" || status === "saving";
    const done = status === "sent" || status === "saved";

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-2 pt-2",
          className
        )}
        {...props}
      >
        <button
        type="button"
        onClick={handleSaveDraft}
        disabled={busy || done}
        className={cn(
          "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
          "border-2 border-border bg-background hover:bg-muted text-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
          {status === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save as draft
        </button>
            <button
      type="button"
      onClick={handleSend}
      disabled={busy || done}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "shadow-md hover:shadow-lg",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      )}
    >
      {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      Send now
    </button>
        {status === "sent" && (
          <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 flex items-start gap-2">
    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-green-900 dark:text-green-100">
        Email sent successfully!
      </p>
      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
        Your email to {to} has been delivered
      </p>
    </div>
  </div>
        )}
        {status === "saved" && (
          <span className="text-sm text-muted-foreground">
            Draft saved.
          </span>
        )}
        {status === "error" && errorMessage && (
  <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
    <p className="text-sm text-destructive font-medium">Failed to send email</p>
    <p className="text-xs text-destructive/80 mt-1">{errorMessage}</p>
    <button 
      onClick={() => setStatus("idle")}
      className="text-xs underline mt-2"
    >
      Try again
    </button>
  </div>
)}
      </div>
    );
  }
);
EmailActions.displayName = "EmailActions";