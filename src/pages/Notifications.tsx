import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/store/AppContext';
import { NotificationItemRow } from '@/components/shared/NotificationItemRow';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCheck, FileText, MessageSquare, CheckCircle2, ArrowUp } from 'lucide-react';

const filterTabs = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'complaint_submitted', label: 'Submitted' },
  { value: 'status_updated', label: 'Updates' },
  { value: 'management_response', label: 'Responses' },
  { value: 'issue_resolved', label: 'Resolved' },
  { value: 'support_received', label: 'Support' },
];

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useAppStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications
    .filter((n) => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !n.read;
      return n.type === filter;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  function handleClick(id: string, issueId?: string) {
    markNotificationRead(id);
    if (issueId) navigate(`/issues/${issueId}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">Notifications</h3>
          <p className="text-sm text-muted-foreground">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllNotificationsRead} className="gap-1.5">
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="h-auto flex-wrap">
          {filterTabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="py-1.5 text-xs">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Notifications */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <NotificationItemRow key={n.id} notification={n} onClick={() => handleClick(n.id, n.issueId)} />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Bell}
            title="No notifications"
            description={filter === 'unread' ? "You're all caught up! No unread notifications." : "You don't have any notifications in this category yet."}
            action={filter !== 'all' && <Button variant="outline" onClick={() => setFilter('all')}>View All</Button>}
          />
        </Card>
      )}

      {/* Quick links */}
      <Card className="p-5 bg-navy text-white border-navy">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: FileText, label: 'Report Issue', link: '/report' },
            { icon: MessageSquare, label: 'AI Assistant', link: '/ai-assistant' },
            { icon: CheckCircle2, label: 'My Issues', link: '/my-issues' },
            { icon: ArrowUp, label: 'Explore', link: '/explore' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.link} className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors">
                <Icon className="h-5 w-5 text-sky" />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
