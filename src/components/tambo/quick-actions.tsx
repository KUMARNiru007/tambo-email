"use client";

import { cn } from "@/lib/utils";
import { useTamboThreadInput } from "@tambo-ai/react";
import {
  BarChart3,
  Inbox,
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
    description: "See received emails to reply",
    message:
      "What emails need follow-up? Show me which received emails need replies with urgency.",
    gradient: "from-amber-500/15 to-orange-500/15",
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/20 hover:border-amber-500/40",
  },
  {
    id: "draft",
    icon: Send,
    label: "Draft Replies",
    description: "Generate replies quickly",
    message:
      "Draft responses for the selected follow-up emails in a DraftResponsePanel.",
    gradient: "from-emerald-500/15 to-green-500/15",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  {
    id: "inbox",
    icon: Inbox,
    label: "Inbox Summary",
    description: "Show received emails",
    message:
      "Summarize my inbox and show my recent received emails with dates.",
    gradient: "from-blue-500/15 to-cyan-500/15",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/20 hover:border-blue-500/40",
  },
  {
    id: "dashboard",
    icon: BarChart3,
    label: "Dashboard",
    description: "Charts and analytics",
    message:
      "Show my full email analytics dashboard with charts, response rate, and top contacts.",
    gradient: "from-violet-500/15 to-purple-500/15",
    iconColor: "text-violet-500",
    borderColor: "border-violet-500/20 hover:border-violet-500/40",
  },
  {
    id: "simulate",
    icon: Mail,
    label: "Simulate Reply",
    description: "Demo incoming email",
    message:
      "Simulate receiving a reply email from a client confirming they received my message, then show the inbox summary.",
    gradient: "from-pink-500/15 to-rose-500/15",
    iconColor: "text-pink-500",
    borderColor: "border-pink-500/20 hover:border-pink-500/40",
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
  await submit({ contextKey, streamResponse: true });
  setValue("");
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
        "mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-10",
        className,
      )}
    >
      <div className="text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Email Assistant
        </div>
        <h2 className="text-2xl font-bold text-foreground">Start with one click</h2>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
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
                "flex flex-col items-start gap-2 rounded-xl border bg-linear-to-br p-4 text-left transition-all",
                "hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
                action.gradient,
                action.borderColor,
                disabled && "cursor-not-allowed opacity-50 hover:scale-100",
              )}
            >
              <div className="rounded-lg bg-background/80 p-2">
                <Icon className={cn("h-4.5 w-4.5", action.iconColor)} />
              </div>
              <p className="text-sm font-semibold text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
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
    <div className={cn("flex items-center gap-2 overflow-x-auto px-4 pb-2", className)}>
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
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon className={cn("h-3.5 w-3.5", action.iconColor)} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}