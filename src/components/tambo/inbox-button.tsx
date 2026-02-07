"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThreadHistoryContext } from "@/components/tambo/thread-history";

interface InboxButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

/**
 * Inbox button component for the sidebar
 */
export const InboxButton = React.forwardRef<
  HTMLButtonElement,
  InboxButtonProps
>(({ onClick, ...props }, ref) => {
  const { isCollapsed } = useThreadHistoryContext();

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex items-center rounded-md mb-4 hover:bg-backdrop transition-colors cursor-pointer relative",
        isCollapsed ? "p-1 justify-center" : "p-2 gap-2",
      )}
      title="Inbox"
      {...props}
    >
      <Inbox className="h-4 w-4 text-blue-600 hover:text-blue-700 transition-colors" />
      <span
        className={cn(
          "text-sm font-medium whitespace-nowrap absolute left-8 pb-0.5",
          isCollapsed
            ? "opacity-0 max-w-0 overflow-hidden pointer-events-none"
            : "opacity-100 transition-all duration-300 delay-100",
        )}
      >
        Inbox
      </span>
    </button>
  );
});
InboxButton.displayName = "InboxButton";
