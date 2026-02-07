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
      type: z.literal("bar"),
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
  color = "blue" 
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange";
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  const iconBgClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100",
  };

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all hover:shadow-md",
      colorClasses[color]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className="text-xs mt-1 opacity-70">{trend}</p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", iconBgClasses[color])}>
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
    // Calculate total emails sent
    const totalSent = sentPerDayChart.data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;
    
    // Calculate average per day
    const avgPerDay = sentPerDayChart.data.labels.length > 0 
      ? (totalSent / sentPerDayChart.data.labels.length).toFixed(1)
      : "0";

    // Transform data for bar chart
    const barChartData = sentPerDayChart.data.labels.map((label, index) => ({
      name: label,
      value: sentPerDayChart.data.datasets[0]?.data[index] || 0,
    }));

    // Transform data for pie chart if available
    const pieChartData = categoryChart?.data.labels.map((label, index) => ({
      name: label,
      value: categoryChart.data.datasets[0]?.data[index] || 0,
      fill: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"][index % 5],
    })) || [];

    // Calculate trend (comparing first half to second half)
    const midPoint = Math.floor(barChartData.length / 2);
    const firstHalf = barChartData.slice(0, midPoint).reduce((a, b) => a + b.value, 0);
    const secondHalf = barChartData.slice(midPoint).reduce((a, b) => a + b.value, 0);
    const trend = secondHalf > firstHalf ? "↑ Increasing" : secondHalf < firstHalf ? "↓ Decreasing" : "→ Stable";

    return (
      <div
        ref={ref}
        className={cn("w-full space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200", className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Email Analytics Dashboard
            </h2>
            <p className="text-sm text-slate-600 mt-1">{summary}</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Send}
            label="Total Sent"
            value={totalSent}
            trend="Last 7 days"
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Daily Average"
            value={avgPerDay}
            trend={trend}
            color="green"
          />
          <StatCard
            icon={Target}
            label="Response Rate"
            value={`${responseRate}%`}
            trend="Engagement"
            color="purple"
          />
          <StatCard
            icon={Users}
            label="Top Contacts"
            value={topContacts.length}
            trend="Active recipients"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Emails Sent Per Day */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              {sentPerDayChart.title}
            </h3>
            <div className="h-64">
              <RechartsCore.ResponsiveContainer width="100%" height="100%">
                <RechartsCore.BarChart data={barChartData}>
                  <RechartsCore.CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <RechartsCore.XAxis
                    dataKey="name"
                    stroke="#64748b"
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px' }}
                  />
                  <RechartsCore.YAxis
                    stroke="#64748b"
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: '12px' }}
                  />
                  <RechartsCore.Tooltip
                    cursor={{ fill: '#f1f5f9', opacity: 0.3 }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <RechartsCore.Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </RechartsCore.BarChart>
              </RechartsCore.ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Category Breakdown */}
          {categoryChart && pieChartData.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-green-600" />
                {categoryChart.title}
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
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
        {topContacts.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Top Contacts
            </h3>
            <div className="space-y-3">
              {topContacts.map((contact, index) => {
                const maxCount = Math.max(...topContacts.map(c => c.emailCount));
                const percentage = (contact.emailCount / maxCount) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900">{contact.name}</span>
                        <span className="text-sm text-slate-600 font-semibold">{contact.emailCount} emails</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">Quick Insights</h4>
              <p className="text-sm opacity-90">
                You're maintaining a {trend.toLowerCase()} pattern with {avgPerDay} emails per day on average. 
                Your {responseRate}% response rate is {responseRate >= 70 ? 'excellent' : responseRate >= 50 ? 'good' : 'needs improvement'}.
                {topContacts.length > 0 && ` Your top contact is ${topContacts[0].name} with ${topContacts[0].emailCount} emails.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AnalyticsDashboard.displayName = "AnalyticsDashboard";