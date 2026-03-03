"use client";

import { cn } from "@/lib/utils";
import { useTamboThreadInput } from "@tambo-ai/react";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Inbox,
  Loader2,
  Mail,
  Reply,
  Send,
  Sparkles,
} from "lucide-react";
import * as React from "react";

const QUICK_ACTIONS = [
  {
    id: "followups",
    icon: Reply,
    label: "Follow-ups",
    description: "Find emails that need your reply",
    message:
      "What emails need follow-up? Show me which received emails need replies with urgency.",
  },
  {
    id: "draft",
    icon: Send,
    label: "Draft Replies",
    description: "AI-generated responses in seconds",
    message:
      "Draft responses for the selected follow-up emails in a DraftResponsePanel.",
  },
  {
    id: "inbox",
    icon: Inbox,
    label: "Inbox Summary",
    description: "Snapshot of your latest emails",
    message:
      "Summarize my inbox and show my recent received emails with dates.",
  },
  {
    id: "dashboard",
    icon: BarChart3,
    label: "Dashboard",
    description: "Charts, trends & top contacts",
    message:
      "Show my full email analytics dashboard with charts, response rate, and top contacts.",
  },
  {
    id: "simulate",
    icon: Mail,
    label: "Simulate Reply",
    description: "Demo an incoming client email",
    message:
      "Simulate receiving a reply email from a client confirming they received my message, then show the inbox summary.",
  },
  {
    id: "templates",
    icon: FileText,
    label: "Templates",
    description: "Reusable email templates",
    message:
      "Show my saved email templates with variable highlights and expandable previews.",
  },
];

async function runAction(
  message: string,
  setValue: (value: string) => void,
  submit: (options?: { contextKey?: string; streamResponse?: boolean }) => Promise<void>,
  contextKey?: string,
) {
  setValue(message);
  await new Promise((r) => setTimeout(r, 20));
  const p = submit({ contextKey, streamResponse: true });
  setValue("");
  await p;
}

export function QuickActionHero({
  contextKey,
  className,
}: {
  contextKey?: string;
  className?: string;
}) {
  const { setValue, submit, isPending } = useTamboThreadInput();
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-2xl flex-col items-center gap-8 px-4 py-12",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            What can I help you with?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick an action or type anything below
          </p>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          const isLoading = loadingId === action.id;
          const disabled = Boolean(isPending || loadingId);

          return (
            <button
              key={action.id}
              disabled={disabled}
              onClick={async () => {
                if (disabled) return;
                setLoadingId(action.id);
                try {
                  await runAction(action.message, setValue, submit, contextKey);
                } catch (error) {
                  console.error("Quick action failed", error);
                } finally {
                  setLoadingId(null);
                }
              }}
              className={cn(
                "group relative flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5 text-left",
                "transition-all duration-200 ease-out",
                "hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm",
                "active:scale-[0.98]",
                disabled && "pointer-events-none opacity-40",
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 transition-colors group-hover:bg-primary/10">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {action.label}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
              </div>

              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-transparent transition-colors group-hover:text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function QuickActionBar({
  contextKey,
  className,
}: {
  contextKey?: string;
  className?: string;
}) {
  const { setValue, submit, isPending } = useTamboThreadInput();
  const [busy, setBusy] = React.useState(false);
  const barActions = QUICK_ACTIONS.slice(0, 4);

  return (
    <div className={cn("flex items-center gap-1.5 overflow-x-auto px-4 pb-2", className)}>
      {barActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            disabled={isPending || busy}
            onClick={async () => {
              if (isPending || busy) return;
              setBusy(true);
              try {
                await runAction(action.message, setValue, submit, contextKey);
              } catch (error) {
                console.error("Quick action failed", error);
              } finally {
                setBusy(false);
              }
            }}
            className={cn(
              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-border/50 bg-card px-2.5 py-1.5",
              "text-xs font-medium text-muted-foreground",
              "transition-all duration-150",
              "hover:border-primary/30 hover:bg-accent/50 hover:text-foreground",
              "disabled:pointer-events-none disabled:opacity-40",
            )}
          >
            <Icon className="h-3 w-3" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}