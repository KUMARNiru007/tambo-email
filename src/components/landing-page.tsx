'use client';

import {
  ArrowRight,
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

const projectFeatures = [
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

const quickActions = [
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

const links = [
  { label: 'Tambo Docs', href: 'https://docs.tambo.co' },
  { label: 'Supabase Docs', href: 'https://supabase.com/docs' },
  { label: 'Resend Docs', href: 'https://resend.com/docs' },
  { label: 'GitHub', href: 'https://github.com' },
];

export function LandingPage() {
  return (
    <div className="relative w-full overflow-x-clip bg-background text-foreground">
      <div className="landing-gradient-bg pointer-events-none" />
      <div className="landing-gradient-orb landing-gradient-orb-left pointer-events-none" />
      <div className="landing-gradient-orb landing-gradient-orb-right pointer-events-none" />

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              T
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Tambo Email</p>
              <p className="text-xs leading-tight text-muted-foreground">Generative UI assistant</p>
            </div>
          </a>

          <div className="hidden items-center gap-5 text-sm md:flex">
            <a className="transition-colors hover:text-primary" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-primary" href="#flow">
              Flow
            </a>
            <a className="transition-colors hover:text-primary" href="#prompts">
              Prompts
            </a>
            <a className="transition-colors hover:text-primary" href="#links">
              Links
            </a>
          </div>

          <a
            href="/chat"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            Open App
          </a>
        </div>
      </nav>

      <section id="top" className="relative px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/75 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm shadow-md">
            <Sparkles className="h-4 w-4 text-primary" />
            Next.js 15 + Tambo + Supabase + Resend
          </p>
          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight sm:text-6xl">
            AI email assistant that
            <span className="landing-gradient-text"> renders the interface </span>
            while it works
          </h1>
          <p className="mx-auto mb-9 max-w-3xl text-balance text-lg text-muted-foreground sm:text-xl">
            One conversation drives real tools and real UI: charts, cards, inbox summaries, email previews, and send/draft actions in the same thread.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-transform hover:-translate-y-0.5"
            >
              Launch Tambo Email <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card/70 px-7 py-3 font-semibold shadow-md transition-colors hover:bg-card"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything Built in This Project</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Feature coverage mirrors the implemented tools, components, and data flows from the app.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projectFeatures.map((feature) => (
              <article
                key={feature.title}
                className="landing-card group rounded-2xl border border-border/80 bg-card/70 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="flow" className="bg-secondary/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">Product Flow</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
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
            ].map((step, idx) => (
              <div
                key={step.title}
                className="landing-card rounded-2xl border border-border/80 bg-card/75 p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    {idx + 1}
                  </div>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prompts" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">Prompt Starters</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            Directly based on the demo guide prompts used to trigger full component + tool flows.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((item) => (
              <div key={item.label} className="landing-card rounded-xl border border-border/80 bg-card/75 p-5">
                <p className="mb-2 text-sm font-semibold text-primary">{item.label}</p>
                <code className="block text-sm text-foreground/90">{item.value}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card/80 p-8 text-center shadow-xl shadow-black/5 backdrop-blur-sm sm:p-12">
          <h2 className="mb-3 text-3xl font-bold">Ready to run the full demo?</h2>
          <p className="mx-auto mb-7 max-w-2xl text-muted-foreground">
            Open chat, use the prompt chips, and watch components render in both thread and canvas.
          </p>
          <a
            href="/chat"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-transform hover:-translate-y-0.5"
          >
            Start Demo <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer id="links" className="border-t border-border/80 bg-secondary/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-sm font-semibold">Tambo Email</p>
            <p className="text-sm text-muted-foreground">
              AI assistant for email workflows with generative UI.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                className="rounded-md px-3 py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
