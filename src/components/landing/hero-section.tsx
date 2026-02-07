import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="top" className="relative flex min-h-screen items-center px-4 pb-16 pt-24 sm:px-6 lg:px-8">
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
            className="inline-flex items-center justify-center rounded-xl border border-primary/40 bg-primary/10 px-7 py-3 font-semibold text-foreground shadow-lg shadow-primary/10 backdrop-blur-sm transition-colors hover:bg-primary/15"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}
