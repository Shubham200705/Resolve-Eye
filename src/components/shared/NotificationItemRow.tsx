import type { NotificationItem } from '@/types';
import { cn } from '@/lib/utils';
import { MessageSquare, CheckCircle2, ArrowUp, Bell, FileText } from 'lucide-react';

interface NotificationItemRowProps {
  notification: NotificationItem;
  onClick?: () => void;
}

const typeIcon = {
  complaint_submitted: FileText,
  status_updated: Bell,
  management_response: MessageSquare,
  issue_resolved: CheckCircle2,
  support_received: ArrowUp,
};

const typeColor = {
  complaint_submitted: 'text-sky bg-sky-soft',
  status_updated: 'text-amber bg-amber-soft',
  management_response: 'text-navy bg-secondary',
  issue_resolved: 'text-emerald bg-emerald-soft',
  support_received: 'text-sky bg-sky-soft',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotificationItemRow({ notification, onClick }: NotificationItemRowProps) {
  const Icon = typeIcon[notification.type];
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex gap-3.5 p-4 rounded-lg border transition-all cursor-pointer hover:shadow-sm',
        notification.read ? 'bg-card border-border' : 'bg-sky-soft/40 border-sky/20'
      )}
    >
      <div className={cn('flex h-9 w-9 items-center justify-center rounded-full shrink-0', typeColor[notification.type])}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h4 className="text-sm font-semibold text-foreground leading-snug">{notification.title}</h4>
          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-sky shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{notification.message}</p>
        <p className="text-xs text-muted-foreground">{timeAgo(notification.timestamp)}</p>
      </div>
    </div>
  );
}
