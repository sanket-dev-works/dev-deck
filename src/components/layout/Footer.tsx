import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>All processing happens locally in your browser.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>DevDeck</span>
          <span>&middot;</span>
          <span>Built for developers</span>
        </div>
      </div>
    </footer>
  );
}
