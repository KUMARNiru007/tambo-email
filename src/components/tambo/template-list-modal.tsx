"use client";

import React from "react";
import { X, Plus, FileText, Copy, Check, ChevronDown, ChevronUp, Loader2, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveTemplate } from "@/services/save-template";
import { listTemplates } from "@/services/list-templates";
import { useTamboThreadInput } from "@tambo-ai/react";

interface Template {
  id: string;
  name: string;
  content: string;
  created_at?: string;
}

interface TemplateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: Template) => void;
}

function extractVariables(content: string): string[] {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variableRegex.exec(content)) !== null) {
    if (!variables.includes(match[1].trim())) {
      variables.push(match[1].trim());
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

/**
 * Render template content with highlighted variables
 */
function TemplatePreview({ content }: { content: string }) {
  const parts = content.split(/(\{\{[^}]+\}\})/g);
  
  return (
    <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
      {parts.map((part, index) => {
        const isVariable = part.match(/\{\{([^}]+)\}\}/);
        if (isVariable) {
          return (
            <span
              key={index}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium border border-primary/20"
            >
              {isVariable[1].trim()}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}

/**
 * Individual template card component
 */
function TemplateCard({ template, onSelect }: { template: Template; onSelect?: (template: Template) => void }) {
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [isDrafting, setIsDrafting] = React.useState(false);
  const { setValue, submit, isPending } = useTamboThreadInput();
  const variables = extractVariables(template.content);
  const hasEmailVar = variables.some((v) => v.toLowerCase().includes("email"));
  const [formValues, setFormValues] = React.useState<Record<string, string>>(() => {
    const entries = variables.map((v) => [v, ""] as [string, string]);
    if (!hasEmailVar) entries.unshift(["_recipient_email", ""]);
    return Object.fromEntries(entries);
  });
  const allFilled =
    variables.every((v) => formValues[v]?.trim()) &&
    (hasEmailVar || formValues["_recipient_email"]?.trim());
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDraft = async (rawValues: Record<string, string>) => {
    if (isPending || isDrafting) return;
    setIsDrafting(true);
    try {
      const values = { ...rawValues };
      if (values["_recipient_email"]) {
        values["email"] = values["_recipient_email"];
        delete values["_recipient_email"];
      }
      const filled = fillTemplate(template.content, values);
      const emailField = values["email"] || values["Email"] || values["recipient_email"] || "not specified";
      setValue(
        `Draft an email using this template with the provided details:\n- Template: ${template.name}\n  Content: ${filled}\nRecipient email: ${emailField}\nShow the EmailPreview component.`,
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
  };
  
  return (
    <div className="border border-border rounded-lg bg-card hover:border-primary/30 transition-all">
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{template.name}</span>
          </h4>
          
          {variables.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs text-muted-foreground">Variables:</span>
              {variables.map((variable) => (
                <span
                  key={variable}
                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  {variable}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            title="Copy template"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Template Content:</p>
            <div className="bg-muted/30 rounded-lg p-3 max-h-60 overflow-y-auto">
              <TemplatePreview content={template.content} />
            </div>
          </div>

          {showForm && variables.length > 0 ? (
            <div className="border border-primary/30 rounded-lg bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
                <div className="flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Fill in details</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {!hasEmailVar && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter recipient email"
                      value={formValues["_recipient_email"] || ""}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, _recipient_email: e.target.value }))
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                    />
                  </div>
                )}
                {variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      {formatLabel(variable)}
                    </label>
                    <input
                      type={variable.toLowerCase().includes("email") ? "email" : "text"}
                      placeholder={`Enter ${formatLabel(variable).toLowerCase()}`}
                      value={formValues[variable] || ""}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, [variable]: e.target.value }))
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-muted/20">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!allFilled || isDrafting || isPending}
                  onClick={() => handleDraft(formValues)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDrafting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <PenLine className="h-3.5 w-3.5" />
                  )}
                  Draft Email
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (variables.length > 0) {
                  setShowForm(true);
                } else {
                  handleDraft({});
                }
              }}
              disabled={isDrafting || isPending}
              className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDrafting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PenLine className="h-4 w-4" />
              )}
              {variables.length > 0 ? "Use this template" : "Draft Email"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const TemplateListModal = React.forwardRef<
  HTMLDivElement,
  TemplateListModalProps
>(({ isOpen, onClose, onSelectTemplate }, ref) => {
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTemplate, setNewTemplate] = React.useState({ name: "", content: "" });
  const [error, setError] = React.useState<string | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Load templates when modal opens
  React.useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listTemplates();
      setTemplates(data);
    } catch (err) {
      setError("Failed to load templates");
      console.error("Error loading templates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.content) {
      setError("Please fill in all fields");
      return;
    }

    setIsAdding(true);
    setError(null);
    try {
      await saveTemplate({
        name: newTemplate.name,
        content: newTemplate.content,
      });
      setNewTemplate({ name: "", content: "" });
      setShowAddForm(false);
      await loadTemplates();
    } catch (err) {
      setError("Failed to add template");
      console.error("Error adding template:", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div
        ref={ref}
        className={cn(
          "bg-background shadow-xl w-full max-h-[90vh] flex flex-col",
          "sm:max-w-3xl sm:rounded-lg rounded-t-2xl sm:rounded-2xl"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Email Templates</h2>
            <span className="text-sm text-muted-foreground">
              ({templates.length})
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

        {/* Add Template Section */}
        <div className="border-b border-border p-4 bg-muted/30">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-2 rounded-md border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              Create New Template
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Create New Template</h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTemplate({ name: "", content: "" });
                    setError(null);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
              
              <form onSubmit={handleAddTemplate} className="space-y-3">
                <input
                  type="text"
                  placeholder="Template name (e.g., 'Follow-up Email')"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  disabled={isAdding}
                  className={cn(
                    "w-full px-3 py-2 rounded-md bg-background border border-border text-sm",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                    isAdding && "opacity-50 cursor-not-allowed",
                  )}
                />
                
                <textarea
                  placeholder="Template content... Use {{variable_name}} for dynamic values"
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                  disabled={isAdding}
                  rows={4}
                  className={cn(
                    "w-full px-3 py-2 rounded-md bg-background border border-border text-sm",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y",
                    isAdding && "opacity-50 cursor-not-allowed",
                  )}
                />
                
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                   Tip: Use double curly braces for variables, like <code className="bg-background px-1 py-0.5 rounded">{"name"}</code> or <code className="bg-background px-1 py-0.5 rounded">{"topic"}</code>
                </div>
                
                <button
                  type="submit"
                  disabled={isAdding}
                  className={cn(
                    "w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium",
                    "hover:bg-primary/90 transition-colors flex items-center justify-center gap-2",
                    isAdding && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Template
                    </>
                  )}
                </button>
              </form>
              
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading templates...</p>
              </div>
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="rounded-full bg-violet-500/10 p-4 mb-4">
                <FileText className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Create reusable email templates to save time when composing similar emails
              </p>
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg max-w-md">
                Tip: You can also ask the AI to create templates by saying 
                "Save a template named 'Weekly Update' with content..."
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={onSelectTemplate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TemplateListModal.displayName = "TemplateListModal";