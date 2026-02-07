"use server";

import { createSupabaseServerClient } from "@/lib/superbase/server";

/**
 * Generate email dashboard data for visualization
 * Returns formatted data for the EmailDashboard component
 */
export async function generateDashboardData() {
  const supabase = createSupabaseServerClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Fetch all emails for this user
  const { data: emails, error } = await supabase
    .from("emails")
    .select("to_email, created_at, status")
    .eq("user_id", user.id)
    .eq("status", "sent")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching emails for dashboard:", error);
    throw error;
  }

  // Generate sentPerDay data (last 7 days)
  const today = new Date();
  const sentPerDay = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const count = emails.filter(email => {
      const emailDate = new Date(email.created_at);
      return emailDate.toDateString() === date.toDateString();
    }).length;
    
    sentPerDay.push({ day: dateStr, count });
  }

  // Generate category breakdown (simulate categories)
  const categoryBreakdown = [
    { category: "Work", count: Math.floor(emails.length * 0.5), color: "#3b82f6" },
    { category: "Personal", count: Math.floor(emails.length * 0.3), color: "#10b981" },
    { category: "Marketing", count: Math.floor(emails.length * 0.2), color: "#f59e0b" },
  ].filter(cat => cat.count > 0);

  // Generate top contacts
  const contactCounts: Record<string, number> = {};
  emails.forEach(email => {
    const to = email.to_email;
    contactCounts[to] = (contactCounts[to] || 0) + 1;
  });

  const topContacts = Object.entries(contactCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([email, count]) => ({
      name: email.split('@')[0], // Extract name from email
      emailCount: count,
    }));

  // Calculate response rate (simulate for now)
  const responseRate = Math.min(Math.floor((emails.length / Math.max(emails.length + 3, 1)) * 100), 95);

  return {
    sentPerDay,
    categoryBreakdown,
    topContacts,
    responseRate,
  };
}