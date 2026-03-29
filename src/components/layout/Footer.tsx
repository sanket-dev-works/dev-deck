import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/50 bg-muted/20 py-8 backdrop-blur-sm dark:bg-muted/10">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent"
        aria-hidden
      />
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background/80 text-brand shadow-sm">
            <Shield className="h-3.5 w-3.5" />
          </span>
          <span>All processing happens locally in your browser.</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs tracking-wide">
          <span className="text-foreground/90">DevDeck</span>
          <span className="text-border">&middot;</span>
          <span>Built for developers</span>
        </div>
      </div>
    </footer>
  );
}
