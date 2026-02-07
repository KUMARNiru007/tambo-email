import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
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
  );
}
