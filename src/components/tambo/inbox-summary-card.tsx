"use client";

import { cn } from "@/lib/utils";
import { Inbox, Mail } from "lucide-react";
import * as React from "react";
import { z } from "zod";

export const inboxSummaryCardSchema = z.object({
  title: z.string().describe("Card title, e.g. 'Inbox summary' or 'Recent emails'"),
  summary: z.string().describe("Text summary of the inbox or email list"),
  count: z.number().describe("Number of emails in the summary"),
  items: z
    .array(
      z.object({
        subject: z.string().describe("Email subject line"),
        date: z.string().optional().describe("Date or date string when received"),
      })
    )
    .optional()
    .describe("Optional list of email subjects with dates"),
});

export type InboxSummaryCardProps = z.infer<typeof inboxSummaryCardSchema> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * Displays an inbox summary from summarizeEmails tool result.
 * Use after calling summarizeEmails to show the user their recent emails.
 */
export const InboxSummaryCard = React.forwardRef<
  HTMLDivElement,
  InboxSummaryCardProps
>(({ title, summary, count, items, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border bg-background p-4 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 mb-3">
        <Inbox className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">{title}</h3>
        {count >= 0 && (
          <span className="text-sm text-muted-foreground">({count} emails)</span>
        )}
      </div>
      <p className="text-sm text-foreground whitespace-pre-line mb-3">
        {summary}
      </p>
      {items && items.length > 0 && (
        <ul className="space-y-2 border-t border-border pt-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate flex-1">{item.subject}</span>
              {item.date && (
                <span className="text-xs flex-shrink-0">{item.date}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
InboxSummaryCard.displayName = "InboxSummaryCard";
