import { Link } from 'react-router-dom';
import { CATEGORY_LABELS, type Issue } from '@/types';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { Card } from '@/components/ui/card';
import { ArrowUp, MessageSquare, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  issue: Issue;
  className?: string;
  compact?: boolean;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

export function IssueCard({ issue, className, compact }: IssueCardProps) {
  return (
    <Link to={`/issues/${issue.id}`} className="block group">
      <Card
        className={cn(
          'p-5 transition-all hover:shadow-md hover:border-sky/30 cursor-pointer relative overflow-hidden',
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-semibold text-muted-foreground">{issue.id}</span>
            <StatusBadge status={issue.status} />
            <SeverityBadge severity={issue.severity} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(issue.lastUpdated)}
          </span>
        </div>

        <h3 className="font-semibold text-foreground text-[0.95rem] leading-snug mb-2 group-hover:text-sky transition-colors line-clamp-2">
          {issue.title}
        </h3>

        {!compact && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{issue.description}</p>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[140px]">{issue.placeName}</span>
            </span>
            <span className="rounded-md bg-muted px-2 py-0.5 font-medium">{CATEGORY_LABELS[issue.category]}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className={cn(
              'flex items-center gap-1 font-medium',
              issue.hasSupported ? 'text-sky' : 'text-muted-foreground'
            )}>
              <ArrowUp className="h-3.5 w-3.5" />
              {issue.supporters}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              {issue.managementResponses.length}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
