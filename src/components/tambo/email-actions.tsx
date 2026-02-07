"use client";

import { cn } from "@/lib/utils";
import { saveEmailDraft } from "@/services/save-email";
import { sendEmailAndPersist } from "@/services/send-email-and-persist";
import { Loader2, Send, Save } from "lucide-react";
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
      setStatus("sending");
      setErrorMessage(null);
      try {
        await sendEmailAndPersist({ to, subject, body });
        setStatus("sent");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Failed to send");
      }
    };

    const handleSaveDraft = async () => {
      setStatus("saving");
      setErrorMessage(null);
      try {
        await saveEmailDraft({ to, subject, body });
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
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            "border border-border bg-background hover:bg-muted text-foreground",
            (busy || done) && "opacity-60 cursor-not-allowed"
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
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            (busy || done) && "opacity-60 cursor-not-allowed"
          )}
        >
          {status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send now
        </button>
        {status === "sent" && (
          <span className="text-sm text-green-600 dark:text-green-400">
            Email sent.
          </span>
        )}
        {status === "saved" && (
          <span className="text-sm text-muted-foreground">
            Draft saved.
          </span>
        )}
        {status === "error" && errorMessage && (
          <span className="text-sm text-destructive">{errorMessage}</span>
        )}
      </div>
    );
  }
);
EmailActions.displayName = "EmailActions";
