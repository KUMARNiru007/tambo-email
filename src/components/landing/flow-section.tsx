import { flowSteps } from './data';

export function FlowSection() {
  return (
    <section id="flow" className="bg-secondary/20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">Product Flow</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {flowSteps.map((step, idx) => (
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
  );
}
