import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/AppContext';
import { DashboardStat } from '@/components/shared/DashboardStat';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  Send,
  X,
} from 'lucide-react';
import {
  complaintTrendData,
  categoryDistributionData,
  resolutionPerformanceData,
  monthlyActivityData,
} from '@/data/mockData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Issue } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { cn } from '@/lib/utils';

export function ManagementDashboard() {
  const { issues, addManagementResponse, updateIssue } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [responseText, setResponseText] = useState('');

  const stats = useMemo(() => {
    const total = issues.length;
    const open = issues.filter((i) => i.status === 'submitted' || i.status === 'under_review').length;
    const inProgress = issues.filter((i) => i.status === 'in_progress').length;
    const resolved = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
    const resolvedWithDays = issues.filter((i) => i.resolutionDays);
    const avgDays = resolvedWithDays.length > 0
      ? (resolvedWithDays.reduce((sum, i) => sum + (i.resolutionDays ?? 0), 0) / resolvedWithDays.length).toFixed(1)
      : '0';
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total, open, inProgress, resolved, avgDays, rate };
  }, [issues]);

  const filteredIssues = useMemo(() => {
    let result = issues;
    if (statusFilter !== 'all') {
      if (statusFilter === 'open') {
        result = result.filter((i) => i.status === 'submitted' || i.status === 'under_review');
      } else {
        result = result.filter((i) => i.status === statusFilter);
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(q) || i.placeName.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [issues, search, statusFilter]);

  function handleRespond() {
    if (selectedIssue && responseText.trim()) {
      addManagementResponse(selectedIssue.id, responseText.trim());
      setResponseText('');
      const updated = issues.find((i) => i.id === selectedIssue.id);
      if (updated) setSelectedIssue(updated);
    }
  }

  function handleStatusChange(newStatus: Issue['status']) {
    if (selectedIssue) {
      updateIssue(selectedIssue.id, {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        timeline: [
          ...selectedIssue.timeline,
          {
            id: `t-${Date.now()}`,
            status: newStatus,
            timestamp: new Date().toISOString(),
            title: newStatus.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            description: 'Status updated by management.',
            author: 'Ravi Kumar',
            authorRole: 'management',
          },
        ],
      });
      setSelectedIssue({ ...selectedIssue, status: newStatus });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DashboardStat label="Total" value={stats.total} icon={<FileText className="h-5 w-5" />} accent="navy" />
        <DashboardStat label="Open" value={stats.open} icon={<AlertCircle className="h-5 w-5" />} accent="amber" />
        <DashboardStat label="In Progress" value={stats.inProgress} icon={<Clock className="h-5 w-5" />} accent="amber" />
        <DashboardStat label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
        <DashboardStat label="Avg Time" value={`${stats.avgDays}d`} icon={<TrendingUp className="h-5 w-5" />} accent="sky" />
        <DashboardStat label="Resolution Rate" value={`${stats.rate}%`} icon={<TrendingUp className="h-5 w-5" />} accent="emerald" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Complaint Trends */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-1">Complaint Trends</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly complaints vs resolutions</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={complaintTrendData}>
              <defs>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(214 32% 91%)',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="complaints" stroke="hsl(199 89% 48%)" fill="url(#colorComplaints)" strokeWidth={2} name="Complaints" />
              <Area type="monotone" dataKey="resolved" stroke="hsl(160 84% 39%)" fill="url(#colorResolved)" strokeWidth={2} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Resolution Performance */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-1">Resolution Performance</h3>
          <p className="text-xs text-muted-foreground mb-4">Weekly resolution rate trend</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={resolutionPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(214 32% 91%)',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="rate" stroke="hsl(199 89% 48%)" strokeWidth={3} dot={{ fill: 'hsl(199 89% 48%)', r: 4 }} name="Resolution Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-1">Issue Categories</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribution by category</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(214 32% 91%)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Activity */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-1">Monthly Activity</h3>
          <p className="text-xs text-muted-foreground mb-4">Reports, responses & resolutions</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(214 32% 91%)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="reports" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} name="Reports" />
              <Bar dataKey="responses" fill="hsl(35 92% 50%)" radius={[4, 4, 0, 0]} name="Responses" />
              <Bar dataKey="resolutions" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} name="Resolutions" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Complaint Table */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-foreground">Complaint Management</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {filteredIssues.length > 0 ? (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">ID</th>
                  <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Issue</th>
                  <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Place</th>
                  <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Category</th>
                  <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Severity</th>
                  <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <td className="py-3 px-2 font-mono text-xs font-semibold text-muted-foreground">{issue.id}</td>
                    <td className="py-3 px-2 max-w-[200px]">
                      <p className="font-medium text-foreground truncate">{issue.title}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{issue.placeName}</p>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground hidden md:table-cell truncate max-w-[140px]">{issue.placeName}</td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <Badge variant="secondary" className="text-xs">{CATEGORY_LABELS[issue.category]}</Badge>
                    </td>
                    <td className="py-3 px-2"><SeverityBadge severity={issue.severity} /></td>
                    <td className="py-3 px-2"><StatusBadge status={issue.status} /></td>
                    <td className="py-3 px-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sky font-semibold"
                        onClick={(e) => { e.stopPropagation(); setSelectedIssue(issue); }}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Search} title="No complaints found" description="Try adjusting your filters." />
        )}
      </Card>

      {/* Issue Detail Panel / Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={() => setSelectedIssue(null)}>
          <div
            className="bg-background w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b border-border p-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-muted-foreground">{selectedIssue.id}</span>
                  <StatusBadge status={selectedIssue.status} />
                  <SeverityBadge severity={selectedIssue.severity} />
                </div>
                <h3 className="font-bold text-foreground leading-tight">{selectedIssue.title}</h3>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="text-muted-foreground hover:text-foreground p-1 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Place & Info */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Place</p>
                  <p className="text-sm font-medium text-foreground">{selectedIssue.placeName}</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Category</p>
                  <p className="text-sm font-medium text-foreground">{CATEGORY_LABELS[selectedIssue.category]}</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Submitted</p>
                  <p className="text-sm font-medium text-foreground">{new Date(selectedIssue.submittedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Supporters</p>
                  <p className="text-sm font-medium text-foreground">{selectedIssue.supporters} people</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{selectedIssue.description}</p>
              </div>

              {/* Evidence */}
              {selectedIssue.evidence.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Evidence ({selectedIssue.evidence.length})</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedIssue.evidence.map((e) => (
                      <div key={e.id} className="rounded-lg border border-border overflow-hidden w-24">
                        {e.type === 'image' ? (
                          <img src={e.url} alt={e.name} className="w-full h-20 object-cover" />
                        ) : (
                          <div className="w-full h-20 flex items-center justify-center bg-muted">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <p className="text-[0.65rem] text-muted-foreground p-1 truncate">{e.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Responses */}
              {selectedIssue.managementResponses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Previous Responses</p>
                  <div className="space-y-2">
                    {selectedIssue.managementResponses.map((r) => (
                      <div key={r.id} className="rounded-lg border border-border p-3">
                        <p className="text-xs text-muted-foreground mb-1">{r.author} • {new Date(r.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                        <p className="text-sm text-foreground">{r.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response Composer */}
              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground mb-2">Respond to complainant</p>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response..."
                  rows={3}
                  className="text-sm"
                />
                <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    {selectedIssue.status !== 'resolved' && selectedIssue.status !== 'closed' && (
                      <>
                        {selectedIssue.status === 'submitted' && (
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange('under_review')}>
                            Mark Under Review
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange('in_progress')}>
                          Mark In Progress
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange('resolved')} className="text-emerald border-emerald/30 hover:bg-emerald-soft">
                          Mark Resolved
                        </Button>
                      </>
                    )}
                    {selectedIssue.status === 'resolved' && (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange('closed')}>
                        Close Issue
                      </Button>
                    )}
                  </div>
                  <Button onClick={handleRespond} disabled={!responseText.trim()} size="sm" className="gap-1.5">
                    <Send className="h-3.5 w-3.5" />
                    Send Response
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
