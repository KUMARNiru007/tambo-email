"use client";

import type { messageVariants } from "@/components/tambo/message";
import {
  MessageInput,
  MessageInputError,
  MessageInputFileButton,
  MessageInputMcpPromptButton,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
  MessageSuggestionsStatus,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import {
  ThreadContainer,
  useThreadContainerContext,
} from "@/components/tambo/thread-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import {
  ThreadHistory,
  ThreadHistoryHeader,
  ThreadHistoryList,
  ThreadHistoryNewButton,
  ThreadHistorySearch,
  useThreadHistoryContext,
} from "@/components/tambo/thread-history";
import { useMergeRefs } from "@/lib/thread-hooks";
import type { Suggestion } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Mail, Clock, FileEdit, BarChart3, TrendingUp } from "lucide-react";
import { listEmails } from "@/services/list-emails";
import { emailStats } from "@/services/email-stats";
import { SendButton } from "@/components/tambo/send-button";
import { DraftButton } from "@/components/tambo/draft-button";
import { ContactButton } from "@/components/tambo/contact-button";
import { ContactListModal } from "@/components/tambo/contact-list-modal";

/**
 * Email list modal component
 */
interface EmailListModalProps {
  emails: Array<{
    id: string;
    to: string;
    subject: string;
    body: string;
    status: "sent" | "draft";
    createdAt: Date;
  }>;
  type: "sent" | "draft";
  isLoading: boolean;
  onClose: () => void;
}

const EmailListModal = React.forwardRef<HTMLDivElement, EmailListModalProps>(
  ({ emails, type, isLoading, onClose }, ref) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          ref={ref}
          className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              {type === "sent" ? (
                <Mail className="h-5 w-5 text-green-600" />
              ) : (
                <FileEdit className="h-5 w-5 text-orange-600" />
              )}
              <h2 className="text-lg font-semibold">
                {type === "sent" ? "Sent Emails" : "Draft Emails"}
              </h2>
              <span className="text-sm text-muted-foreground">
                ({emails.length})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-backdrop rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading emails...</div>
              </div>
            ) : emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-2">
                  No {type} emails found
                </div>
                <p className="text-sm text-muted-foreground">
                  {type === "sent"
                    ? "Emails you send will appear here"
                    : "Save drafts to see them here"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">To:</span>
                          <span className="text-sm text-muted-foreground">
                            {email.to}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {email.subject}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {email.createdAt
                            ? new Date(email.createdAt).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {email.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
EmailListModal.displayName = "EmailListModal";

/**
 * Stats Card Component for Analytics
 */
interface StatsCardProps {
  sent: number;
  drafts: number;
  isLoading?: boolean;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ sent, drafts, isLoading = false }, ref) => {
    const { isCollapsed } = useThreadHistoryContext();

    if (isCollapsed) {
      return (
        <div
          ref={ref}
          className="p-2 mb-4 bg-muted/50 rounded-lg border border-border/50 flex justify-center"
          title="Email Stats"
        >
          <BarChart3 className="h-4 w-4 text-primary" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="p-4 mb-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-sm">Email Analytics</h3>
        </div>

        {isLoading ? (
          <div className="text-xs text-muted-foreground">Loading stats...</div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Sent</span>
              </div>
              <span className="text-sm font-bold text-green-600">{sent}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-xs text-muted-foreground">Drafts</span>
              </div>
              <span className="text-sm font-bold text-orange-600">{drafts}</span>
            </div>

            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-sm font-bold">{sent + drafts}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
StatsCard.displayName = "StatsCard";

/**
 * Props for the MessageThreadFull component
 */
export interface MessageThreadFullProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional context key for the thread */
  contextKey?: string;
  /**
   * Controls the visual styling of messages in the thread.
   * Possible values include: "default", "compact", etc.
   * These values are defined in messageVariants from "@/components/tambo/message".
   * @example variant="compact"
   */
  variant?: VariantProps<typeof messageVariants>["variant"];
  /** Optional callback for send button click */
  onSendClick?: () => void;
  /** Optional callback for draft button click */
  onDraftClick?: () => void;
}

/**
 * A full-screen chat thread component with message history, input, and suggestions
 */
export const MessageThreadFull = React.forwardRef<
  HTMLDivElement,
  MessageThreadFullProps
>(
  (
    { className, contextKey, variant, onSendClick, onDraftClick, ...props },
    ref,
  ) => {
    const { containerRef, historyPosition } = useThreadContainerContext();
    const mergedRef = useMergeRefs<HTMLDivElement | null>(ref, containerRef);

    // State for managing email list view
    const [emailView, setEmailView] = React.useState<"sent" | "draft" | null>(null);
    const [emails, setEmails] = React.useState<
      Array<{
        id: string;
        to: string;
        subject: string;
        body: string;
        status: "sent" | "draft";
        createdAt: Date;
      }>
    >([]);
    const [isLoadingEmails, setIsLoadingEmails] = React.useState(false);

    // State for managing contact list view
    const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);

    // State for email stats
    const [stats, setStats] = React.useState({ sent: 0, drafts: 0 });
    const [isLoadingStats, setIsLoadingStats] = React.useState(false);

    // Load stats on mount and when modals close
    React.useEffect(() => {
      loadStats();
    }, [emailView, isContactModalOpen]);

    const loadStats = React.useCallback(async () => {
      setIsLoadingStats(true);
      try {
        // emailStats now handles auth internally
        const statsData = await emailStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load stats:", error);
        // Set default values on error
        setStats({ sent: 0, drafts: 0 });
      } finally {
        setIsLoadingStats(false);
      }
    }, []);

    // Function to load emails based on status
    const loadEmails = React.useCallback(async (status: "sent" | "draft") => {
      setIsLoadingEmails(true);
      try {
        const emailList = await listEmails(status);
        setEmails(emailList);
        setEmailView(status);
      } catch (error) {
        console.error("Failed to load emails:", error);
      } finally {
        setIsLoadingEmails(false);
      }
    }, []);

    // Handle send button click
    const handleSendClick = React.useCallback(async () => {
      await loadEmails("sent");
      onSendClick?.();
    }, [loadEmails, onSendClick]);

    // Handle draft button click
    const handleDraftClick = React.useCallback(async () => {
      await loadEmails("draft");
      onDraftClick?.();
    }, [loadEmails, onDraftClick]);

    // Handle contact button click
    const handleContactClick = React.useCallback(() => {
      setIsContactModalOpen(true);
    }, []);

    // Close email view
    const closeEmailView = React.useCallback(() => {
      setEmailView(null);
      setEmails([]);
      loadStats(); // Refresh stats when closing
    }, [loadStats]);

    // Close contact modal
    const closeContactModal = React.useCallback(() => {
      setIsContactModalOpen(false);
      loadStats(); // Refresh stats when closing
    }, [loadStats]);

    const threadHistorySidebar = (
      <ThreadHistory contextKey={contextKey} position={historyPosition}>
        <ThreadHistoryHeader />
        
        {/* Analytics Card */}
        <StatsCard sent={stats.sent} drafts={stats.drafts} isLoading={isLoadingStats} />
        
        {/* Action Buttons */}
        <SendButton onClick={handleSendClick} />
        <DraftButton onClick={handleDraftClick} />
        <ContactButton onClick={handleContactClick} />
        
        <ThreadHistoryNewButton />
        <ThreadHistorySearch />
        <ThreadHistoryList />
      </ThreadHistory>
    );

    const defaultSuggestions: Suggestion[] = [
      {
        id: "suggestion-1",
        title: "Send email",
        detailedSuggestion:
          "Help me compose and send an email. Find the recipient from my contacts if I mention a name, then show me a preview and let me send or save as draft.",
        messageId: "compose-query",
      },
      {
        id: "suggestion-2",
        title: "Email dashboard",
        detailedSuggestion:
          "Show my email analytics dashboard: charts for emails sent over the last 7 days and by category, plus top contacts and response rate.",
        messageId: "analytics-query",
      },
      {
        id: "suggestion-3",
        title: "Inbox summary",
        detailedSuggestion:
          "Summarize my inbox and show my recent received emails in a summary card.",
        messageId: "inbox-query",
      },
      {
        id: "suggestion-4",
        title: "Manage contacts",
        detailedSuggestion:
          "List my email contacts as selectable cards so I can pick who to email or manage them.",
        messageId: "contacts-query",
      },
    ];

    return (
      <>
        <div className="flex h-full w-full">
          {/* Thread History Sidebar - rendered first if history is on the left */}
          {historyPosition === "left" && threadHistorySidebar}

          <ThreadContainer
            ref={mergedRef}
            disableSidebarSpacing
            className={cn("flex-1 min-w-0 flex flex-col", className)}
            {...props}
          >
            <ScrollableMessageContainer className="p-4">
              <ThreadContent variant={variant}>
                <ThreadContentMessages />
              </ThreadContent>
            </ScrollableMessageContainer>

            {/* Message suggestions status */}
            <MessageSuggestions>
              <MessageSuggestionsStatus />
            </MessageSuggestions>

            {/* Message input */}
            <div className="px-4 pb-4">
              <MessageInput contextKey={contextKey}>
                <MessageInputTextarea placeholder="Type your message or paste images..." />
                <MessageInputToolbar>
                  <MessageInputFileButton />
                  <MessageInputMcpPromptButton />
                  <MessageInputSubmitButton />
                </MessageInputToolbar>
                <MessageInputError />
              </MessageInput>
            </div>

            {/* Message suggestions - show 4 for empty thread */}
            <MessageSuggestions initialSuggestions={defaultSuggestions} maxSuggestions={4}>
              <MessageSuggestionsList />
            </MessageSuggestions>
          </ThreadContainer>

          {/* Thread History Sidebar - rendered last if history is on the right */}
          {historyPosition === "right" && threadHistorySidebar}
        </div>

        {/* Email List Modal */}
        {emailView && (
          <EmailListModal
            emails={emails}
            type={emailView}
            isLoading={isLoadingEmails}
            onClose={closeEmailView}
          />
        )}

        {/* Contact List Modal */}
        <ContactListModal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
        />
      </>
    );
  },
);
MessageThreadFull.displayName = "MessageThreadFull";