import { SEVERITY_LABELS, SEVERITY_COLORS, type IssueSeverity } from '@/types';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: IssueSeverity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const colors = SEVERITY_COLORS[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
