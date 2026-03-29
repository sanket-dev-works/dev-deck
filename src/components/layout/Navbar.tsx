'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { SearchBar } from '@/components/common/SearchBar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent" aria-hidden />
      <div className="container mx-auto flex h-14 items-center px-4 gap-4">
        <Link
          href="/"
          className="group mr-4 flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-brand shadow-sm transition-colors group-hover:border-brand/40 group-hover:bg-brand-muted/60">
            <Terminal className="h-4 w-4" />
          </span>
          <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/75">
            DevDeck
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md">
            Home
          </Link>
          <Link href="/tools" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md">
            Tools
          </Link>
        </nav>

        <SearchBar className="hidden md:block flex-1 max-w-md mx-auto" />

        <div className="ml-auto flex items-center gap-2">
          <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <span className="text-xs">&#8984;</span>K
          </kbd>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden h-9 w-9" />}
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="flex items-center gap-2 font-bold">
                <Terminal className="h-5 w-5" />
                DevDeck
              </SheetTitle>
              <div className="mt-6 flex flex-col gap-2">
                <SearchBar className="mb-4" />
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                >
                  All Tools
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
