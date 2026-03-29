import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';

export default function ToolNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md">
      <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Tool Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The tool you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/tools">
          <Button>Browse All Tools</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
