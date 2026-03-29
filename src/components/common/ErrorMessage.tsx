import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
