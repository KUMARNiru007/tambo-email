"use client";

import React from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThreadHistoryContext } from "@/components/tambo/thread-history";

interface TemplateButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

/**
 * Template list button component for the sidebar
 */
export const TemplateButton = React.forwardRef<
  HTMLButtonElement,
  TemplateButtonProps
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
      title="Templates"
      {...props}
    >
      <FileText className="h-4 w-4 text-violet-600 hover:text-violet-700 transition-colors" />
      <span
        className={cn(
          "text-sm font-medium whitespace-nowrap absolute left-8 pb-0.5",
          isCollapsed
            ? "opacity-0 max-w-0 overflow-hidden pointer-events-none"
            : "opacity-100 transition-all duration-300 delay-100",
        )}
      >
        Templates
      </span>
    </button>
  );
});
TemplateButton.displayName = "TemplateButton";
