"use client";

import { cn } from "@/lib/utils";
import { useTamboComponentState } from "@tambo-ai/react";
import {
  AlertTriangle,
  Check,
  Clock,
  Mail,
  MessageSquare,
  Reply,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";

export const emailFollowUpListSchema = z.object({
  title: z
    .string()
    .describe("Heading for the follow-up list, e.g. 'Emails needing follow-up'"),
  emails: z
    .array(
      z.object({
        id: z.string().describe("Unique email identifier"),
        from: z.string().describe("Sender name or email address"),
        subject: z.string().describe("Email subject line"),
        snippet: z
          .string()
          .describe("Short preview / first line of the email body"),
        reason: z
          .string()
          .describe("Why this email needs follow-up, e.g. 'Deadline Friday'"),
        urgency: z
          .enum(["high", "medium", "low"])
          .describe("Urgency level for the follow-up"),
        receivedAt: z
          .string()
          .optional()
          .describe("When the email was received (human-readable)"),
      })
    )
    .describe("List of emails that need a follow-up"),
});

export type EmailFollowUpListProps = z.infer<typeof emailFollowUpListSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export type EmailFollowUpListState = {
  selectedIds: string[];
};

const urgencyConfig = {
  high: {
    bg: "bg-red-500/10 dark:bg-red-500/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300",
    dot: "bg-red-500",
    label: "Urgent",
    icon: AlertTriangle,
  },
  medium: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    dot: "bg-amber-500",
    label: "Medium",
    icon: Clock,
  },
  low: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    dot: "bg-blue-500",
    label: "Low",
    icon: MessageSquare,
  },
};

export const EmailFollowUpList = React.forwardRef<
  HTMLDivElement,
  EmailFollowUpListProps
>(({ title, emails: rawEmails, className, ...props }, ref) => {
  const emails = Array.isArray(rawEmails) ? rawEmails : [];
  const safeTitle = title ?? "Emails needing follow-up";

  const [state, setState] = useTamboComponentState<EmailFollowUpListState>(
    "email-follow-up-list",
    { selectedIds: [] }
  );

  const toggle = (id: string) => {
    if (!state) return;
    const next = state.selectedIds.includes(id)
      ? state.selectedIds.filter((v) => v !== id)
      : [...state.selectedIds, id];
    setState({ selectedIds: next });
  };

  const selectAll = () => {
    if (!state) return;
    if (state.selectedIds.length === emails.length) {
      setState({ selectedIds: [] });
    } else {
      setState({ selectedIds: emails.map((e) => e.id) });
    }
  };

  const selectedCount = state?.selectedIds.length ?? 0;

  if (emails.length === 0) {
    return (
      <div
        ref={ref}
        className={cn("w-full rounded-xl border border-border bg-card p-6 text-center text-muted-foreground", className)}
        {...props}
      >
        Loading follow-up emails...
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/10 p-2">
            <Reply className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-foreground leading-tight">
              {safeTitle}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {emails.length} email{emails.length !== 1 && "s"} found
              {selectedCount > 0 && (
                <span className="ml-1.5 font-medium text-primary">
                  · {selectedCount} selected
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={selectAll}
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
            selectedCount === emails.length
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
        >
          {selectedCount === emails.length ? "Deselect all" : "Select all"}
        </button>
      </div>

      <ul className="divide-y divide-border">
        {emails.map((email) => {
          const cfg = urgencyConfig[email.urgency] ?? urgencyConfig.medium;
          const UrgIcon = cfg.icon;
          const selected = state?.selectedIds.includes(email.id) ?? false;

          return (
            <li
              key={email.id}
              onClick={() => toggle(email.id)}
              className={cn(
                "flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors",
                selected ? cfg.bg : "hover:bg-muted/40"
              )}
            >
              <div className="shrink-0 mt-1">
                <div
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                    selected
                      ? "bg-primary border-primary text-primary-foreground scale-105"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-foreground truncate">
                    {email.from}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      cfg.badge
                    )}
                  >
                    <UrgIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                  {email.receivedAt && (
                    <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
                      {email.receivedAt}
                    </span>
                  )}
                </div>

                <p className="text-sm text-foreground mt-0.5 font-medium truncate">
                  {email.subject}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {email.snippet}
                </p>

                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-md px-2.5 py-1">
                  <Mail className="h-3 w-3" />
                  <span>{email.reason}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {selectedCount > 0 && (
        <div className="px-5 py-3 border-t border-border bg-primary/5">
          <p className="text-xs text-primary font-medium text-center">
             Say <span className="font-semibold">&quot;Draft replies for these&quot;</span> to
            generate responses for the {selectedCount} selected email
            {selectedCount !== 1 && "s"}
          </p>
        </div>
      )}
    </div>
  );
});
EmailFollowUpList.displayName = "EmailFollowUpList";
