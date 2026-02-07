import {
  BarChart3,
  BookOpenText,
  CheckCircle2,
  Database,
  FolderKanban,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Sparkles,
  Users,
} from 'lucide-react';

export const projectFeatures = [
  {
    title: 'Generative UI Components',
    description:
      'AI picks and renders AnalyticsDashboard, Graph, DataCard, EmailPreview, EmailActions, and InboxSummaryCard in chat and canvas.',
    icon: Sparkles,
    bullets: ['Component-first responses', 'Canvas + message rendering'],
  },
  {
    title: 'Compose, Preview, Send',
    description:
      'Ask naturally, preview the generated email, then send now or save as draft from action buttons.',
    icon: Mail,
    bullets: ['Resend integration', 'One-click Send / Save Draft'],
  },
  {
    title: 'Email Dashboard Analytics',
    description:
      'Generate 7-day activity charts, category breakdown, top contacts, and quick email metrics on command.',
    icon: BarChart3,
    bullets: ['Bar + pie chart data', 'Top contact activity'],
  },
  {
    title: 'Inbox Summary + Receive Demo',
    description:
      'Simulate receiving emails for demo and summarize recent inbox messages instantly in a dedicated summary card.',
    icon: LayoutDashboard,
    bullets: ['Received email simulation', 'Summary card output'],
  },
  {
    title: 'Contacts + Templates',
    description:
      'Manage contacts and reusable templates as selectable data cards, then reuse them in compose flows.',
    icon: Users,
    bullets: ['Duplicate-safe contact save', 'Template listing and reuse'],
  },
  {
    title: 'Auth + Persistent Data',
    description:
      'OTP auth with Supabase, plus stored sent/draft/received records and sidebar history views.',
    icon: Database,
    bullets: ['Session-protected app', 'Audit trail for emails'],
  },
];

export const flowSteps = [
  {
    icon: MessageSquareText,
    title: 'Ask in natural language',
    description: 'Users type intent, not commands.',
  },
  {
    icon: FolderKanban,
    title: 'AI runs registered tools',
    description: 'Email, contacts, templates, analytics, inbox.',
  },
  {
    icon: Sparkles,
    title: 'AI chooses components',
    description: 'Previews, cards, charts, and action UIs are rendered.',
  },
  {
    icon: BookOpenText,
    title: 'Data stays persistent',
    description: 'Supabase stores drafts, sent items, received items, contacts, templates.',
  },
];

export const quickActions = [
  {
    label: 'Email dashboard',
    value: 'Show my email analytics dashboard with charts.',
  },
  {
    label: 'Inbox summary',
    value: 'Summarize my inbox and show recent emails.',
  },
  {
    label: 'Manage contacts',
    value: 'List my contacts as selectable cards.',
  },
  {
    label: 'Send email',
    value: 'Compose and send an email to my contact about project updates.',
  },
];

export const links = [
  { label: 'Tambo Docs', href: 'https://docs.tambo.co' },
  { label: 'Supabase Docs', href: 'https://supabase.com/docs' },
  { label: 'Resend Docs', href: 'https://resend.com/docs' },
  { label: 'GitHub', href: 'https://github.com' },
];

export { CheckCircle2, Sparkles };
