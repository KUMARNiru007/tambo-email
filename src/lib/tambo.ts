/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import { EmailActions, emailActionsSchema } from "@/components/tambo/email-actions";
import { EmailPreview } from "@/components/tambo/email-preview";
import {
  InboxSummaryCard,
  inboxSummaryCardSchema,
} from "@/components/tambo/inbox-summary-card";
import { Map, mapSchema } from "@/components/tambo/map";
import { saveEmailDraft } from "@/services/save-email";
import { listEmails } from "@/services/list-emails";
import { sendEmailAndPersist } from "@/services/send-email-and-persist";
import { listContacts } from "@/services/list-contacts";
import { saveContact } from "@/services/save-contact";
import { findContactByName, findContactByEmail } from "@/services/find-contact";
import { listTemplates } from "@/services/list-templates";
import { saveTemplate } from "@/services/save-template";
import { summarizeEmails } from "@/services/summarize-emails";
import { emailStats } from "@/services/email-stats";
import { getEmailDashboard } from "@/services/get-email-dashboard";

import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "saveEmailDraft",
    description: "Save an email draft to the database without sending it",
    tool: saveEmailDraft,
    toolSchema: z.function().args(
      z.object({
        to: z.string().email().describe("Recipient email address"),
        subject: z.string().describe("Email subject line"),
        body: z.string().describe("Email body content"),
      })
    ),
  },
  {
    name: "sendEmailAndPersist",
    description: "Send an email via Resend and persist it to the database as sent",
    tool: sendEmailAndPersist,
    toolSchema: z.function().args(
      z.object({
        to: z.string().email().describe("Recipient email address"),
        subject: z.string().describe("Email subject line"),
        body: z.string().describe("Email body content"),
      })
    ),
  },
  {
    name: "listEmails",
    description: "List email drafts or sent emails. Can filter by status or return all emails.",
    tool: listEmails,
    toolSchema: z.function().args(
      z.object({
        status: z.enum(["draft", "sent"]).optional().describe("Filter by email status"),
      }).optional()
    ),
  },
  {
    name: "listContacts",
    description: "List all saved email contacts for the current authenticated user",
    tool: async () => {
      // Wrapper to handle the server-side user authentication
      return await listContacts();
    },
    toolSchema: z.function().args(z.object({})),
  },
  {
    name: "saveContact",
    description: "Save a new email contact (name and email address) to the database for the current user",
    tool: saveContact,
    toolSchema: z.function().args(
      z.object({
        name: z.string().describe("Contact's full name"),
        email: z.string().email().describe("Contact's email address"),
      })
    ),
  },
  {
    name: "findContactByName",
    description: "Search for contacts by name (case-insensitive, partial match). Returns up to 5 matching contacts.",
    tool: findContactByName,
    toolSchema: z.function().args(
      z.object({
        name: z.string().describe("Name to search for (partial match supported)"),
      })
    ),
  },
  {
    name: "findContactByEmail",
    description: "Find a specific contact by their exact email address",
    tool: findContactByEmail,
    toolSchema: z.function().args(
      z.object({
        email: z.string().email().describe("Email address to search for"),
      })
    ),
  },
  {
    name: "saveTemplate",
    description:
      "Save a reusable email template. Pass an object with name (template name/title) and content (template body text). Call once per template.",
    tool: async (...toolArgs: unknown[]) => {
      const first = toolArgs[0];
      const second = toolArgs[1];
      let name = "";
      let content = "";
      if (first != null && typeof first === "object" && !Array.isArray(first)) {
        const obj = first as Record<string, unknown>;
        const inner =
          obj.param1 != null && typeof obj.param1 === "object"
            ? (obj.param1 as Record<string, unknown>)
            : obj;
        name = String(inner?.name ?? "").trim();
        content = String(inner?.content ?? "");
      } else if (typeof first === "string" && typeof second === "string") {
        name = first.trim();
        content = second;
      }
      return saveTemplate({ name, content });
    },
    toolSchema: z.function().args(
      z.object({
        name: z.string().describe("Template name/title"),
        content: z.string().describe("Template content/body"),
      })
    ),
  },
  {
    name: "listTemplates",
    description: "List all saved email templates for the current user, ordered by creation date (newest first)",
    tool: listTemplates,
    toolSchema: z.function().args(z.object({})),
  },
  {
    name: "summarizeEmails",
    description: "Summarize recent received emails in the inbox (up to 5 emails) for the current user",
    tool: summarizeEmails,
    toolSchema: z.function().args(z.object({})),
  },
  {
    name: "emailStats",
    description: "Get email analytics including count of sent emails and draft emails for the current user",
    tool: emailStats,
    toolSchema: z.function().args(z.object({})),
  },
  {
    name: "getEmailDashboard",
    description:
      "Get full email analytics dashboard data for the current user: charts (emails sent per day, category breakdown), top contacts, and response rate. Use this when the user asks for dashboard, analytics, email statistics, or how they are doing. Returned data is formatted for Graph components (sentPerDayChart, categoryChart).",
    tool: getEmailDashboard,
    toolSchema: z.function().args(z.object({})),
  },
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Perfect for visualizing email analytics, trends, and statistics.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items. Great for showing email lists or contact options.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "EmailPreview",
    description:
      "Preview an email before sending it. Shows recipient, subject, and body in a formatted card.",
    component: EmailPreview,
    propsSchema: z.object({
      to: z.string().email().describe("Recipient email address"),
      subject: z.string().describe("Email subject"),
      body: z.string().describe("Email body content"),
    }),
  },
  {
    name: "EmailActions",
    description:
      "Two buttons: Save as draft and Send now. Use immediately after EmailPreview with the same to, subject, and body so the user can persist the email.",
    component: EmailActions,
    propsSchema: emailActionsSchema,
  },
  {
    name: "Map",
    description:
      "Display an interactive map with markers and optional heatmap. Use for showing locations (e.g. contact offices, event places). Provide center (lat/lng), zoom, and markers array with lat, lng, label.",
    component: Map,
    propsSchema: mapSchema,
  },
  {
    name: "InboxSummaryCard",
    description:
      "Display an inbox summary with title, summary text, count, and optional list of email subjects/dates. Use after calling summarizeEmails: pass summary, count, and items (array of { subject, date }) from the tool result.",
    component: InboxSummaryCard,
    propsSchema: inboxSummaryCardSchema,
  },
];