export function TopNav() {
  return (
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
  );
}
