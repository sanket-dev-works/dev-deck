import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PrivacyBadge() {
  return (
    <Badge variant="secondary" className="gap-1.5 text-xs font-normal">
      <Shield className="h-3 w-3" />
      Processed locally in your browser
    </Badge>
  );
}
