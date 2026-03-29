import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md">
      <Terminal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
        <Link href="/tools">
          <Button variant="outline">Browse Tools</Button>
        </Link>
      </div>
    </div>
  );
}
