"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { 
  Mail, 
  Send, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import * as RechartsCore from "recharts";

/**
 * Zod schema for AnalyticsDashboard
 */
export const analyticsDashboardSchema = z.object({
  sentPerDayChart: z.object({
    title: z.string(),
    data: z.object({
      type: z.enum(["bar", "line", "area"]),
      labels: z.array(z.string()),
      datasets: z.array(z.object({
        label: z.string(),
        data: z.array(z.number()),
        color: z.string().optional(),
      })),
    }),
  }).describe("Chart showing emails sent per day over the last 7 days"),
  
  categoryChart: z.object({
    title: z.string(),
    data: z.object({
      type: z.literal("pie"),
      labels: z.array(z.string()),
      datasets: z.array(z.object({
        label: z.string(),
        data: z.array(z.number()),
      })),
    }),
  }).optional().describe("Optional pie chart showing email category breakdown"),
  
  topContacts: z.array(z.object({
    name: z.string(),
    emailCount: z.number(),
  })).describe("Top 5 contacts by email count"),
  
  responseRate: z.number().describe("Response rate percentage"),
  
  summary: z.string().describe("Text summary of email activity"),
});

export type AnalyticsDashboardProps = z.infer<typeof analyticsDashboardSchema> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * Stat card component for key metrics
 */
const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  tone = "primary"
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  tone?: "primary" | "success" | "warning" | "neutral";
}) => {
  const toneClasses = {
    primary: "border-border bg-card text-card-foreground",
    success: "border-border bg-card text-card-foreground",
    warning: "border-border bg-card text-card-foreground",
    neutral: "border-border bg-card text-card-foreground",
  };

  const iconToneClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    neutral: "bg-muted text-foreground",
  };

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-colors hover:bg-muted/35",
      toneClasses[tone]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className={cn("rounded-lg p-2", iconToneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

/**
 * Comprehensive Analytics Dashboard Component
 * Displays email analytics with multiple visualizations and key metrics
 */
export const AnalyticsDashboard = React.forwardRef<HTMLDivElement, AnalyticsDashboardProps>(
  ({ sentPerDayChart, categoryChart, topContacts, responseRate, summary, className, ...props }, ref) => {
    const sentChartData = sentPerDayChart?.data;
    const sentLabels = Array.isArray(sentChartData?.labels) ? sentChartData.labels : [];
    const sentValues = Array.isArray(sentChartData?.datasets?.[0]?.data)
      ? sentChartData.datasets[0].data
      : [];
    const safeTopContacts = Array.isArray(topContacts) ? topContacts : [];
    const safeResponseRate = Number.isFinite(responseRate) ? responseRate : 0;
    const safeSummary = typeof summary === "string" ? summary : "No analytics summary available yet.";

    // Calculate total emails sent
    const totalSent = sentValues.reduce((a, b) => a + b, 0);

    // Calculate average per day
    const avgPerDay = sentLabels.length > 0
      ? (totalSent / sentLabels.length).toFixed(1)
      : "0";

    // Transform data for trend chart
    const barChartData = sentLabels.map((label, index) => ({
      name: label,
      value: sentValues[index] || 0,
    }));

    // Transform data for pie chart if available
    const categoryLabels = Array.isArray(categoryChart?.data?.labels) ? categoryChart.data.labels : [];
    const categoryValues = Array.isArray(categoryChart?.data?.datasets?.[0]?.data)
      ? categoryChart.data.datasets[0].data
      : [];
    const pieChartData = categoryLabels.map((label, index) => ({
      name: label,
      value: categoryValues[index] || 0,
      fill: [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
      ][index % 5],
    }));

    // Calculate trend (comparing first half to second half)
    const midPoint = Math.floor(barChartData.length / 2);
    const firstHalf = barChartData.slice(0, midPoint).reduce((a, b) => a + b.value, 0);
    const secondHalf = barChartData.slice(midPoint).reduce((a, b) => a + b.value, 0);
    const trend = secondHalf > firstHalf ? "Increasing" : secondHalf < firstHalf ? "Decreasing" : "Stable";

    return (
      <div
        ref={ref}
        className={cn(
          "w-full space-y-6 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm md:p-6",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
              <BarChart3 className="h-5 w-5 text-primary md:h-6 md:w-6" />
              Email Analytics Dashboard
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{safeSummary}</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Send}
            label="Total Sent"
            value={totalSent}
            trend="Last 7 days"
            tone="primary"
          />
          <StatCard
            icon={TrendingUp}
            label="Daily Average"
            value={avgPerDay}
            trend={trend}
            tone="success"
          />
          <StatCard
            icon={Target}
            label="Response Rate"
            value={`${safeResponseRate}%`}
            trend="Engagement"
            tone="warning"
          />
          <StatCard
            icon={Users}
            label="Top Contacts"
            value={safeTopContacts.length}
            trend="Active recipients"
            tone="neutral"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart - Emails Sent Per Day */}
          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
              <Mail className="h-5 w-5 text-primary" />
              {sentPerDayChart?.title ?? "Emails sent"}
            </h3>
            <div className="h-64">
              <RechartsCore.ResponsiveContainer width="100%" height="100%">
                <RechartsCore.AreaChart data={barChartData}>
                  <defs>
                    <linearGradient id="sentTrendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <RechartsCore.CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <RechartsCore.XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px' }}
                  />
                  <RechartsCore.YAxis
                    stroke="var(--muted-foreground)"
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px' }}
                  />
                  <RechartsCore.Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <RechartsCore.Area
                    dataKey="value"
                    type="monotone"
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    fill="url(#sentTrendFill)"
                    dot={{ r: 3, fill: "var(--chart-3)" }}
                    activeDot={{ r: 5 }}
                  />
                </RechartsCore.AreaChart>
              </RechartsCore.ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Category Breakdown */}
          {categoryChart && pieChartData.length > 0 && (
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
                <PieChartIcon className="h-5 w-5 text-primary" />
                {categoryChart.title ?? "Emails by category"}
              </h3>
              <div className="h-64">
                <RechartsCore.ResponsiveContainer width="100%" height="100%">
                  <RechartsCore.PieChart>
                    <RechartsCore.Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      label={({ name, percent }) => 
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    />
                    <RechartsCore.Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <RechartsCore.Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </RechartsCore.PieChart>
                </RechartsCore.ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Top Contacts Section */}
        {safeTopContacts.length > 0 && (
          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
              <Users className="h-5 w-5 text-primary" />
              Top Contacts
            </h3>
            <div className="space-y-3">
              {safeTopContacts.map((contact, index) => {
                const maxCount = Math.max(...safeTopContacts.map((c) => c.emailCount), 1);
                const percentage = (contact.emailCount / maxCount) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{contact.name}</span>
                        <span className="text-sm font-semibold text-muted-foreground">{contact.emailCount} emails</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div 
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Insights */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="mb-1 text-base font-semibold">Quick Insights</h4>
              <p className="text-sm text-muted-foreground">
                You're maintaining a {trend.toLowerCase()} pattern with {avgPerDay} emails per day on average. 
                Your {safeResponseRate}% response rate is {safeResponseRate >= 70 ? 'excellent' : safeResponseRate >= 50 ? 'good' : 'needs improvement'}.
                {safeTopContacts.length > 0 && ` Your top contact is ${safeTopContacts[0].name} with ${safeTopContacts[0].emailCount} emails.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AnalyticsDashboard.displayName = "AnalyticsDashboard";
