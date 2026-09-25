import { STATUS_LABELS, STATUS_COLORS, STATUS_ORDER, type TimelineEntry, type IssueStatus } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface TimelineProps {
  entries: TimelineEntry[];
  currentStatus: IssueStatus;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Timeline({ entries, currentStatus }: TimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-6">
        {STATUS_ORDER.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const entry = entries.find((e) => e.status === status);

          if (!entry && !isCompleted) return null;

          return (
            <div key={status} className="relative flex gap-4">
              <div className={cn(
                'z-10 flex h-7 w-7 items-center justify-center rounded-full shrink-0 transition-colors',
                isCompleted ? 'bg-emerald text-white' : 'bg-muted text-muted-foreground'
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={cn(
                    'text-sm font-semibold',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {entry ? entry.title : STATUS_LABELS[status]}
                  </h4>
                  {index === currentIndex && (
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold',
                      STATUS_COLORS[status].bg,
                      STATUS_COLORS[status].text
                    )}>
                      Current
                    </span>
                  )}
                </div>
                {entry ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(entry.timestamp)} • {entry.author}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground/60">Awaiting update</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
