"use server";

import { generateDashboardData } from "@/services/generate-dashboard-data";

/**
 * Get email dashboard data formatted for AI-rendered Graph components.
 * Use this tool when the user asks for analytics, dashboard, or email statistics.
 * Returns chart-ready data: sentPerDayChart (bar), categoryChart (pie), and summary stats.
 */
export async function getEmailDashboard() {
  const raw = await generateDashboardData();

  // Shape for Graph component: { data: { type, labels, datasets }, title }
  const sentPerDayChart = {
    title: "Emails sent (last 7 days)",
    data: {
      type: "bar" as const,
      labels: raw.sentPerDay.map((d) => d.day),
      datasets: [
        {
          label: "Sent",
          data: raw.sentPerDay.map((d) => d.count),
          color: "hsl(220, 100%, 62%)",
        },
      ],
    },
  };

  const categoryChart =
    raw.categoryBreakdown.length > 0
      ? {
          title: "Emails by category",
          data: {
            type: "pie" as const,
            labels: raw.categoryBreakdown.map((c) => c.category),
            datasets: [
              {
                label: "Count",
                data: raw.categoryBreakdown.map((c) => c.count),
                color: undefined,
              },
            ],
          },
        }
      : null;

  return {
    sentPerDayChart,
    categoryChart,
    topContacts: raw.topContacts,
    responseRate: raw.responseRate,
    summary: `You've sent ${raw.sentPerDay.reduce((a, d) => a + d.count, 0)} emails in the last 7 days. Response rate: ${raw.responseRate}%.`,
  };
}
