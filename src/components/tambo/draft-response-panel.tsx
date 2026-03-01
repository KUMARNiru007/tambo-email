"use client";

import { cn } from "@/lib/utils";
import { saveEmailDraft } from "@/services/save-email";
import { sendEmailAndPersist } from "@/services/send-email-and-persist";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Loader2,
  Mail,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

export const draftResponsePanelSchema = z.object({
  drafts: z
    .array(
      z.object({
        id: z.string().describe("Unique draft identifier (matches the email id)"),
        to: z.string().describe("Recipient email address"),
        originalSubject: z.string().describe("Subject of the original email"),
        from: z.string().describe("Original sender name or email"),
        subject: z.string().describe("Reply subject line"),
        body: z.string().describe("Draft reply body content"),
        tone: z
          .enum(["professional", "friendly", "concise", "formal"])
          .optional()
          .describe("Tone used for the draft"),
      })
    )
    .describe("Array of draft replies, one per selected email"),
});

export type DraftResponsePanelProps = z.infer<typeof draftResponsePanelSchema> &
  React.HTMLAttributes<HTMLDivElement>;

/* ------------------------------------------------------------------ */
/*  Tone badge                                                         */
/* ------------------------------------------------------------------ */

const toneBadge: Record<string, { label: string; cls: string }> = {
  professional: {
    label: "Professional",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  },
  friendly: {
    label: "Friendly",
    cls: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300",
  },
  concise: {
    label: "Concise",
    cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
  },
  formal: {
    label: "Formal",
    cls: "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300",
  },
};

/* ------------------------------------------------------------------ */
/*  Single draft card                                                  */
/* ------------------------------------------------------------------ */

function DraftCard({
  draft,
  index,
}: {
  draft: z.infer<typeof draftResponsePanelSchema>["drafts"][number];
  index: number;
}) {
  const [expanded, setExpanded] = React.useState(true);
  const [status, setStatus] = React.useState<
    "idle" | "sending" | "saving" | "sent" | "saved" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const busy = status === "sending" || status === "saving";
  const done = status === "sent" || status === "saved";

  const handleSend = async () => {
    setStatus("sending");
    setErrorMsg(null);
    try {
      await sendEmailAndPersist({
        to: draft.to,
        subject: draft.subject,
        body: draft.body,
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Send failed");
    }
  };

  const handleSave = async () => {
    setStatus("saving");
    setErrorMsg(null);
    try {
      await saveEmailDraft({
        to: draft.to,
        subject: draft.subject,
        body: draft.body,
      });
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Save failed");
    }
  };

  const badge = toneBadge[draft.tone ?? "professional"];

  return (
    <div
      className={cn(
        "rounded-xl border transition-all overflow-hidden",
        done
          ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20"
          : "border-border bg-card"
      )}
    >
      {/* ---- Header ---- */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            Re: {draft.originalSubject}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            To: {draft.to} — from {draft.from}
          </p>
        </div>
        {badge && (
          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
              badge.cls
            )}
          >
            <Sparkles className="h-3 w-3" />
            {badge.label}
          </span>
        )}
        {done && (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
        )}
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* ---- Body ---- */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border">
          {/* Subject */}
          <div className="pt-3">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Subject
            </label>
            <p className="text-sm text-foreground mt-0.5">{draft.subject}</p>
          </div>

          {/* Draft body */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Draft reply
            </label>
            <div className="mt-1 rounded-lg border border-border bg-background p-3 text-sm text-foreground whitespace-pre-line leading-relaxed">
              {draft.body}
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <p className="text-xs text-red-500">{errorMsg}</p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={busy || done}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors",
                "border border-border bg-background hover:bg-muted text-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {status === "saving" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : status === "saved" ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {status === "saved" ? "Saved" : "Save draft"}
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={busy || done}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {status === "sending" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : status === "sent" ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {status === "sent" ? "Sent ✓" : "Send now"}
            </button>

            <span className="ml-auto text-[10px] text-muted-foreground hidden sm:inline">
              <Edit3 className="inline h-3 w-3 mr-0.5 -translate-y-px" />
              Ask AI to change tone
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/**
 * DraftResponsePanel
 *
 * Renders AI-generated draft replies for multiple selected emails.
 * Each draft can be individually sent or saved as a draft.
 */
export const DraftResponsePanel = React.forwardRef<
  HTMLDivElement,
  DraftResponsePanelProps
>(({ drafts, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <div className="rounded-lg bg-primary/10 p-2">
          <Mail className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base text-foreground leading-tight">
            Draft Replies
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {drafts.length} draft{drafts.length !== 1 && "s"} ready for review
          </p>
        </div>
      </div>

      {/* Draft list */}
      <div className="p-4 space-y-3">
        {drafts.map((draft, i) => (
          <DraftCard key={draft.id} draft={draft} index={i} />
        ))}
      </div>

      {/* Footer tip */}
      <div className="px-5 py-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          💡 Say <span className="font-medium">&quot;Make it more formal&quot;</span> or{" "}
          <span className="font-medium">&quot;Shorten the reply to #1&quot;</span> to refine
        </p>
      </div>
    </div>
  );
});
DraftResponsePanel.displayName = "DraftResponsePanel";
