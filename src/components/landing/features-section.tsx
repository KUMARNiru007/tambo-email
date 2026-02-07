import { projectFeatures, CheckCircle2 } from './data';

export function FeaturesSection() {
  return (
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
  );
}
