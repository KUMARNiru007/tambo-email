import { links } from './data';

export function FooterSection() {
  return (
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
  );
}
