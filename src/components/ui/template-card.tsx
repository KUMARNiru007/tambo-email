"use client";

import { cn } from "@/lib/utils";
import { useTamboComponentState, useTamboThreadInput } from "@tambo-ai/react";
import * as React from "react";
import { z } from "zod";
import { Check, FileText, ChevronDown, ChevronUp, Loader2, PenLine, X } from "lucide-react";

function extractVariables(content: string): string[] {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variableRegex.exec(content)) !== null) {
    const variable = match[1].trim();
    if (!variables.includes(variable)) {
      variables.push(variable);
    }
  }
  
  return variables;
}

function fillTemplate(content: string, values: Record<string, string>): string {
  return content.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const trimmed = key.trim();
    return values[trimmed] || `{{${trimmed}}}`;
  });
}

function formatLabel(variable: string): string {
  return variable
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function VariableForm({
  variables,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  variables: string[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(variables.map((v) => [v, ""])),
  );

  const allFilled = variables.every((v) => values[v]?.trim());

  return (
    <div className="border border-primary/30 rounded-lg bg-card overflow-hidden mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Fill in template details</span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {variables.map((variable) => (
          <div key={variable}>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {formatLabel(variable)}
            </label>
            <input
              type={variable.toLowerCase().includes("email") ? "email" : "text"}
              placeholder={`Enter ${formatLabel(variable).toLowerCase()}`}
              value={values[variable] || ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [variable]: e.target.value }))
              }
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-muted/20">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!allFilled || isSubmitting}
          onClick={() => onSubmit(values)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <PenLine className="h-3.5 w-3.5" />
          )}
          Draft Email
        </button>
      </div>
    </div>
  );
}

/**
 * Render template content with highlighted variables
 */
function TemplateContentPreview({ content }: { content: string }) {
  const parts = content.split(/(\{\{[^}]+\}\})/g);
  
  return (
    <div className="text-sm leading-relaxed">
      {parts.map((part, index) => {
        const isVariable = part.match(/\{\{([^}]+)\}\}/);
        if (isVariable) {
          return (
            <span
              key={index}
              className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-primary/10 text-primary font-medium border border-primary/20 text-xs"
              title={`Variable: ${isVariable[1].trim()}`}
            >
              {isVariable[1].trim()}
            </span>
          );
        }
        return <span key={index} className="text-foreground">{part}</span>;
      })}
    </div>
  );
}

// Define option type for template cards
export type TemplateCardItem = {
  id: string;
  label: string; // Template name
  value: string; // Template ID or name for selection
  description?: string; // Short description
  content: string; // Full template content with variables
};

// Define the component state type
export type TemplateCardState = {
  selectedValues: string[];
  expandedCards: string[]; // Track which cards are expanded
};

// Define the component props schema with Zod
export const templateCardSchema = z.object({
  title: z.string().describe("Title displayed above the template cards"),
  options: z
    .array(
      z.object({
        id: z.string().describe("Unique identifier for this template"),
        label: z.string().describe("Template name/title"),
        value: z.string().describe("Value for selection (usually the template name)"),
        description: z
          .string()
          .optional()
          .describe("Optional brief description of the template"),
        content: z
          .string()
          .describe("Full template content with {{variables}}"),
      }),
    )
    .describe("Array of email templates to display"),
});

// Define the props type based on the Zod schema
export type TemplateCardProps = z.infer<typeof templateCardSchema> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * TemplateCard Component
 *
 * A specialized component for displaying email templates with variable highlighting,
 * expandable previews, and selection capabilities.
 */
export const TemplateCard = React.forwardRef<HTMLDivElement, TemplateCardProps>(
  ({ title, options, className, ...props }, ref) => {
    const { setValue, submit, isPending } = useTamboThreadInput();
    const [isDrafting, setIsDrafting] = React.useState(false);

    const [showForm, setShowForm] = React.useState(false);

    const [state, setState] = useTamboComponentState<TemplateCardState>(
      `template-card`,
      { selectedValues: [], expandedCards: [] },
    );

    // Handle template selection
    const handleToggleCard = (value: string) => {
      if (!state) return;

      const selectedValues = [...state.selectedValues];
      const index = selectedValues.indexOf(value);

      if (index > -1) {
        selectedValues.splice(index, 1);
      } else {
        selectedValues.push(value);
      }

      setState({ ...state, selectedValues });
    };

    // Handle card expansion
    const handleToggleExpand = (id: string) => {
      if (!state) return;

      const expandedCards = [...state.expandedCards];
      const index = expandedCards.indexOf(id);

      if (index > -1) {
        expandedCards.splice(index, 1);
      } else {
        expandedCards.push(id);
      }

      setState({ ...state, expandedCards });
    };

    if (!state) return null;

    return (
      <div ref={ref} className={cn("w-full space-y-3", className)} {...props}>
        {title && (
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {options && options.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({options.length} template{options.length !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        )}

        <div className="space-y-2">
          {options?.map((template) => {
            const isExpanded = state.expandedCards.includes(template.id);
            const isSelected = state.selectedValues.includes(template.value);
            const variables = extractVariables(template.content);

            return (
              <div
                key={template.id}
                className={cn(
                  "border rounded-lg bg-card transition-all",
                  isSelected && "border-primary/40 bg-primary/5",
                  !isSelected && "border-border hover:border-primary/30"
                )}
              >
                {/* Header */}
                <div className="p-3 flex items-start gap-3">
                  {/* Selection checkbox */}
                  <div
                    className="shrink-0 mt-0.5 cursor-pointer"
                    onClick={() => handleToggleCard(template.value)}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 border rounded-sm flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                  </div>

                  {/* Template info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "font-semibold text-sm",
                            isSelected ? "text-primary" : "text-foreground"
                          )}
                        >
                          {template.label}
                        </h3>
                        {template.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {template.description}
                          </p>
                        )}
                      </div>

                      {/* Expand/collapse button */}
                      <button
                        onClick={() => handleToggleExpand(template.id)}
                        className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>

                    {/* Variables badges */}
                    {variables.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Variables:
                        </span>
                        {variables.map((variable) => (
                          <span
                            key={variable}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                          >
                            {variable}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expandable content preview */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border pt-3">
                    <div className="bg-muted/30 rounded-lg p-3 max-h-48 overflow-y-auto">
                      <TemplateContentPreview content={template.content} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Helper text */}
        {state && state.selectedValues.length > 0 && (() => {
          const selectedTemplates = options?.filter((t) =>
            state.selectedValues.includes(t.value),
          ) ?? [];
          const allVars = Array.from(
            new Set(selectedTemplates.flatMap((t) => extractVariables(t.content))),
          );

          return showForm && allVars.length > 0 ? (
            <VariableForm
              variables={allVars}
              isSubmitting={isDrafting}
              onCancel={() => setShowForm(false)}
              onSubmit={async (values) => {
                if (isPending || isDrafting) return;
                setIsDrafting(true);
                try {
                  const filled = selectedTemplates
                    .map(
                      (t) =>
                        `- Template: ${t.label}\n  Content: ${fillTemplate(t.content, values)}`,
                    )
                    .join("\n");
                  setValue(
                    `Draft an email using these templates with the provided details:\n${filled}\nRecipient email: ${values["email"] || values["Email"] || "not specified"}\nShow the EmailPreview component.`,
                  );
                  await new Promise((r) => setTimeout(r, 20));
                  const p = submit({ streamResponse: true });
                  setValue("");
                  await p;
                  setShowForm(false);
                } catch (error) {
                  console.error("Failed to draft from template", error);
                } finally {
                  setIsDrafting(false);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-between border-t border-border bg-primary/5 px-4 py-3 mt-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                {state.selectedValues.length} template{state.selectedValues.length !== 1 && "s"} selected
              </p>
              <button
                type="button"
                disabled={isPending || isDrafting}
                onClick={() => {
                  if (allVars.length > 0) {
                    setShowForm(true);
                  } else {
                    (async () => {
                      if (isPending || isDrafting) return;
                      setIsDrafting(true);
                      try {
                        const summary = selectedTemplates
                          .map((t) => `- Template: ${t.label}\n  Content: ${t.content}`)
                          .join("\n");
                        setValue(
                          `Draft an email using these selected templates:\n${summary}\nShow the EmailPreview component.`,
                        );
                        await new Promise((r) => setTimeout(r, 20));
                        const p = submit({ streamResponse: true });
                        setValue("");
                        await p;
                      } catch (error) {
                        console.error("Failed to draft from template", error);
                      } finally {
                        setIsDrafting(false);
                      }
                    })();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDrafting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <PenLine className="h-3.5 w-3.5" />
                )}
                Draft Email
              </button>
            </div>
          );
        })()}
      </div>
    );
  },
);

TemplateCard.displayName = "TemplateCard";

export default TemplateCard;