import { quickActions } from './data';

export function PromptsSection() {
  return (
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
  );
}
