import { useState } from "react";
import DOMPurify from "dompurify";
import { Paperclip, X } from "lucide-react";

type EmailPreviewProps = {
  to: string;
  subject: string;
  body: string;
};

export function EmailPreview({ to, subject, body }: EmailPreviewProps) {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (fileToRemove: File) => {
    setAttachments((prev) => prev.filter((file) => file !== fileToRemove));
  };


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

      {/* File Attachments Section */}
      <div className="border-t border-border pt-3 space-y-2">
        <label className="block">
          <span className="text-sm font-medium">Attachments</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
        </label>

        {attachments.length > 0 && (
          <div className="space-y-1">
            {attachments.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 text-sm bg-muted rounded px-3 py-2"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  onClick={() => removeAttachment(file)}
                  className="hover:bg-destructive/10 rounded p-1 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400">
        Review this email before sending
      </div>
    </div>
  );
}