"use client";

import { cn } from "@/lib/utils";
import { useTamboThreadInput } from "@tambo-ai/react";
import { Check, Inbox, Loader2, Mail, Reply } from "lucide-react";
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
  const { setValue, submit, isPending } = useTamboThreadInput();
  const [selectedIdx, setSelectedIdx] = React.useState<Set<number>>(new Set());
  const [isDrafting, setIsDrafting] = React.useState(false);

  const toggleSelect = (i: number) => {
    setSelectedIdx((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border bg-background shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 p-4 pb-3">
        <Inbox className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">{title}</h3>
        {count >= 0 && (
          <span className="text-sm text-muted-foreground">({count} emails)</span>
        )}
      </div>
      <p className="text-sm text-foreground whitespace-pre-line px-4 pb-3">
        {summary}
      </p>
      {items && items.length > 0 && (
        <ul className="border-t border-border divide-y divide-border">
          {items.map((item, i) => {
            const selected = selectedIdx.has(i);
            return (
              <li
                key={i}
                onClick={() => toggleSelect(i)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors",
                  selected
                    ? "bg-primary/5 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40"
                )}
              >
                <div className="shrink-0">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-sm border flex items-center justify-center transition-all",
                      selected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </div>
                </div>
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate flex-1">{item.subject}</span>
                {item.date && (
                  <span className="text-xs shrink-0">{item.date}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {selectedIdx.size > 0 && items && (
        <div className="flex items-center justify-between border-t border-border bg-primary/5 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {selectedIdx.size} email{selectedIdx.size !== 1 && "s"} selected
          </p>
          <button
            type="button"
            disabled={isPending || isDrafting}
            onClick={async () => {
              if (isPending || isDrafting) return;
              const selected = Array.from(selectedIdx).map(
                (i) => items![i]
              );
              if (selected.length === 0) return;
              const list = selected
                .map((e) => `- ${e.subject}`)
                .join("\n");
              setIsDrafting(true);
              try {
                setValue(
                  `Draft reply responses for these emails:\n${list}\nUse DraftResponsePanel.`,
                );
                await new Promise((r) => setTimeout(r, 20));
                const p = submit({ streamResponse: true });
                setValue("");
                await p;
              } catch (error) {
                console.error("Failed to draft replies", error);
              } finally {
                setIsDrafting(false);
              }
            }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDrafting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Reply className="h-3.5 w-3.5" />
            )}
            Draft Replies
          </button>
        </div>
      )}
    </div>
  );
});
InboxSummaryCard.displayName = "InboxSummaryCard";
