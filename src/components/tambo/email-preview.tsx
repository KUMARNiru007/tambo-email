import { useState } from "react";
import DOMPurify from "dompurify";

type EmailPreviewProps = {
  to: string;
  subject: string;
  body: string;
};

export function EmailPreview({ to, subject, body }: EmailPreviewProps) {

  const safeBody = body ?? "";
  const sanitizedBody = DOMPurify.sanitize(safeBody.replace(/\n/g, "<br />"));

  return (
    <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
      <div className="text-sm text-muted-foreground">
        AI-generated email preview
      </div>

      <div>
        <p className="text-sm">
          <strong>To:</strong> {to || "(No recipient)"}
        </p>
        <p className="text-sm">
          <strong>Subject:</strong> {subject || "(No subject)"}
        </p>
      </div>

      <div
        className="border-t border-border pt-3 text-foreground"
        dangerouslySetInnerHTML={{ __html: sanitizedBody }}
      />

      <div className="text-xs text-gray-400">
        Review this email before sending
      </div>
    </div>
  );
}