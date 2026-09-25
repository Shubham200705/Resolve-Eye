import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/AppContext';
import { DashboardStat } from '@/components/shared/DashboardStat';
import { IssueCard } from '@/components/shared/IssueCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Bell,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import type { IssueStatus } from '@/types';

export function UserDashboard() {
  const { issues, notifications } = useAppStore();
  const userIssues = issues.filter((i) => i.submittedBy === 'Aarav Sharma');

  const totalReported = userIssues.length;
  const activeIssues = userIssues.filter((i) => i.status === 'submitted' || i.status === 'under_review' || i.status === 'in_progress').length;
  const resolvedIssues = userIssues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
  const resolvedWithDays = userIssues.filter((i) => i.resolutionDays);
  const avgResolution = resolvedWithDays.length > 0
    ? (resolvedWithDays.reduce((sum, i) => sum + (i.resolutionDays ?? 0), 0) / resolvedWithDays.length).toFixed(1)
    : '0';

  const recentIssues = [...userIssues].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  ).slice(0, 4);

  const recentNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 4);

  const statusBreakdown: Record<IssueStatus, number> = {
    submitted: userIssues.filter((i) => i.status === 'submitted').length,
    under_review: userIssues.filter((i) => i.status === 'under_review').length,
    in_progress: userIssues.filter((i) => i.status === 'in_progress').length,
    resolved: userIssues.filter((i) => i.status === 'resolved').length,
    closed: userIssues.filter((i) => i.status === 'closed').length,
  };

  const statusMeta: { status: IssueStatus; label: string; color: string }[] = [
    { status: 'submitted', label: 'Submitted', color: 'bg-sky' },
    { status: 'under_review', label: 'Under Review', color: 'bg-amber' },
    { status: 'in_progress', label: 'In Progress', color: 'bg-amber' },
    { status: 'resolved', label: 'Resolved', color: 'bg-emerald' },
    { status: 'closed', label: 'Closed', color: 'bg-muted-foreground' },
  ];

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      {/* Quick Report Banner */}
      <Card className="p-6 bg-navy text-white border-navy relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-sky/10 to-transparent" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Welcome back, Aarav</h2>
            <p className="text-sm text-white/60">You have {activeIssues} active issues being tracked. Keep an eye on their progress.</p>
          </div>
          <Link to="/report">
            <Button className="bg-sky hover:bg-sky/90 text-white gap-2 h-10 px-6 rounded-xl font-semibold whitespace-nowrap">
              <Plus className="h-4.5 w-4.5" />
              Report New Issue
            </Button>
          </Link>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStat label="Total Reported" value={totalReported} icon={<FileText className="h-5 w-5" />} accent="navy" trend={{ value: 12, label: 'vs last month' }} />
        <DashboardStat label="Active Complaints" value={activeIssues} icon={<AlertCircle className="h-5 w-5" />} accent="amber" trend={{ value: 0, label: 'awaiting action' }} />
        <DashboardStat label="Resolved Issues" value={resolvedIssues} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" trend={{ value: 8, label: 'vs last month' }} />
        <DashboardStat label="Avg Resolution" value={`${avgResolution}d`} icon={<Clock className="h-5 w-5" />} accent="sky" trend={{ value: -15, label: 'faster than avg' }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Issues */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent Issues</h3>
            <Link to="/my-issues">
              <Button variant="ghost" size="sm" className="text-sky font-semibold gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          {recentIssues.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {recentIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} compact />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
                icon={FileText}
                title="No issues reported yet"
                description="Start reporting problems to track their resolution progress."
                action={
                  <Link to="/report">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" /> Report an Issue
                    </Button>
                  </Link>
                }
              />
            </Card>
          )}
        </div>

        {/* Right Column: Status + Notifications */}
        <div className="space-y-6">
          {/* Status Overview */}
          <Card className="p-5">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-sky" />
              Issue Status Overview
            </h3>
            <div className="space-y-3">
              {statusMeta.map(({ status, label, color }) => {
                const count = statusBreakdown[status];
                const pct = totalReported > 0 ? (count / totalReported) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${color}`} />
                        <span className="text-sm text-muted-foreground">{label}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Notification Preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-sky" />
                Recent Notifications
              </h3>
              <Link to="/notifications">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-sky">
                  All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentNotifications.map((n) => (
                <Link key={n.id} to={n.issueId ? `/issues/${n.issueId}` : '/notifications'} className="block">
                  <div className={`p-3 rounded-lg border transition-all hover:shadow-sm ${n.read ? 'bg-card border-border' : 'bg-sky-soft/40 border-sky/20'}`}>
                    <p className="text-sm font-semibold text-foreground leading-snug mb-0.5 line-clamp-1">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{n.message}</p>
                    <p className="text-[0.7rem] text-muted-foreground">{timeAgo(n.timestamp)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
