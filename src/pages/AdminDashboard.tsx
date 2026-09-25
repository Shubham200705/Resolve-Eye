import { useState } from 'react';
import { useAppStore } from '@/store/AppContext';
import { mockPlaces } from '@/data/mockData';
import { DashboardStat } from '@/components/shared/DashboardStat';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Users,
  Building2,
  FileText,
  Flag,
  Activity,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Ban,
  MoreHorizontal,
} from 'lucide-react';
import { CATEGORY_LABELS, PLACE_LABELS } from '@/types';

export function AdminDashboard() {
  const { issues, notifications } = useAppStore();
  const [search, setSearch] = useState('');

  // Mock admin data
  const mockUsers = [
    { id: 'u-001', name: 'Aarav Sharma', email: 'aarav.s@email.com', role: 'user', reports: 14, status: 'active', joined: 'Jun 2024' },
    { id: 'u-002', name: 'Ravi Kumar', email: 'ravi.k@email.com', role: 'management', reports: 0, status: 'active', joined: 'Mar 2024' },
    { id: 'u-003', name: 'Priya Singh', email: 'priya.s@email.com', role: 'management', reports: 2, status: 'active', joined: 'Apr 2024' },
    { id: 'u-004', name: 'Suresh Patel', email: 'suresh.p@email.com', role: 'management', reports: 1, status: 'active', joined: 'May 2024' },
    { id: 'u-005', name: 'Anita Rao', email: 'anita.r@email.com', role: 'management', reports: 3, status: 'active', joined: 'Feb 2024' },
    { id: 'u-006', name: 'Deepak Verma', email: 'deepak.v@email.com', role: 'management', reports: 1, status: 'suspended', joined: 'Jul 2024' },
    { id: 'u-007', name: 'Meera Nair', email: 'meera.n@email.com', role: 'user', reports: 8, status: 'active', joined: 'Aug 2024' },
    { id: 'u-008', name: 'Karthik Reddy', email: 'karthik.r@email.com', role: 'user', reports: 5, status: 'active', joined: 'Sep 2024' },
  ];

  const reportedContent = issues.filter((i) => i.severity === 'urgent' || i.supporters > 10);

  const platformStats = [
    { label: 'Total Users', value: '1,247', icon: <Users className="h-5 w-5" />, accent: 'navy' as const },
    { label: 'Active Places', value: mockPlaces.length.toString(), icon: <Building2 className="h-5 w-5" />, accent: 'sky' as const },
    { label: 'Total Complaints', value: '2,847', icon: <FileText className="h-5 w-5" />, accent: 'amber' as const },
    { label: 'Reported Content', value: reportedContent.length.toString(), icon: <Flag className="h-5 w-5" />, accent: 'red' as const },
  ];

  const filteredUsers = mockUsers.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      {/* Admin Notice */}
      <div className="flex items-start gap-3 rounded-xl bg-navy/5 border border-navy/10 p-4">
        <Eye className="h-5 w-5 text-navy shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Administrator Dashboard</p>
          <p className="text-xs text-muted-foreground mt-0.5">This is a conceptual admin interface for demonstration purposes. All data is simulated.</p>
        </div>
      </div>

      {/* Platform Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat) => (
          <DashboardStat key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} accent={stat.accent} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview" className="py-1.5">Overview</TabsTrigger>
          <TabsTrigger value="users" className="py-1.5">Users</TabsTrigger>
          <TabsTrigger value="places" className="py-1.5">Places</TabsTrigger>
          <TabsTrigger value="moderation" className="py-1.5">Moderation</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-sky" />
                Platform Activity (Last 30 days)
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'New user registrations', value: '142', change: '+12%' },
                  { label: 'New complaints filed', value: '287', change: '+8%' },
                  { label: 'Issues resolved', value: '231', change: '+15%' },
                  { label: 'Management responses', value: '198', change: '+6%' },
                  { label: 'Reported content flagged', value: '12', change: '-3%' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">{item.value}</span>
                      <span className={`text-xs font-semibold ${item.change.startsWith('+') ? 'text-emerald' : 'text-red'}`}>{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-sky" />
                Places by Category
              </h3>
              <div className="space-y-4">
                {(['restaurant', 'hostel', 'pg'] as const).map((cat) => {
                  const count = mockPlaces.filter((p) => p.category === cat).length;
                  const pct = (count / mockPlaces.length) * 100;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{PLACE_LABELS[cat]}</span>
                        <span className="text-sm text-muted-foreground">{count} places</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-sky transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">Top Issue Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CATEGORY_LABELS).slice(0, 6).map(([key, label]) => (
                    <Badge key={key} variant="secondary" className="text-xs">{label}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h3 className="font-bold text-foreground">User Management</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
            </div>
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">User</th>
                      <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Role</th>
                      <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Reports</th>
                      <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                      <th className="text-left py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Joined</th>
                      <th className="text-right py-2.5 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{user.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          <Badge variant={user.role === 'management' ? 'default' : 'secondary'} className="text-xs capitalize">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground">{user.reports}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === 'active' ? 'bg-emerald-soft text-emerald' : 'bg-red-soft text-red'}`}>
                            {user.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 hidden lg:table-cell text-muted-foreground">{user.joined}</td>
                        <td className="py-3 px-2 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon={Search} title="No users found" description="Try a different search term." />
            )}
          </Card>
        </TabsContent>

        {/* Places */}
        <TabsContent value="places" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="font-bold text-foreground">Place Management</h3>
              <Button size="sm" className="gap-1.5">
                <Building2 className="h-4 w-4" />
                Add Place
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPlaces.map((place) => (
                <div key={place.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={place.image} alt={place.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm truncate">{place.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{place.location}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{PLACE_LABELS[place.category]}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="rounded-md bg-muted/50 py-1.5">
                      <p className="text-sm font-bold text-foreground">{place.totalIssues}</p>
                      <p className="text-[0.6rem] text-muted-foreground">Total</p>
                    </div>
                    <div className="rounded-md bg-muted/50 py-1.5">
                      <p className="text-sm font-bold text-amber">{place.activeIssues}</p>
                      <p className="text-[0.6rem] text-muted-foreground">Active</p>
                    </div>
                    <div className="rounded-md bg-muted/50 py-1.5">
                      <p className="text-sm font-bold text-emerald">{place.resolutionRate}%</p>
                      <p className="text-[0.6rem] text-muted-foreground">Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${place.verified ? 'text-emerald' : 'text-muted-foreground'}`}>
                      {place.verified ? <><CheckCircle2 className="h-3 w-3" /> Verified</> : 'Unverified'}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                      <Eye className="h-3 w-3" /> View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Moderation */}
        <TabsContent value="moderation" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
              <Flag className="h-4.5 w-4.5 text-red" />
              Complaint Moderation
            </h3>
            <p className="text-sm text-muted-foreground mb-5">Review complaints flagged for moderation due to high severity or high support.</p>
            {reportedContent.length > 0 ? (
              <div className="space-y-3">
                {reportedContent.map((issue) => (
                  <div key={issue.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono font-bold text-muted-foreground">{issue.id}</span>
                          <StatusBadge status={issue.status} />
                          {issue.severity === 'urgent' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-soft text-red px-2 py-0.5 text-xs font-semibold">
                              <AlertTriangle className="h-3 w-3" /> Urgent
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-foreground text-sm">{issue.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{issue.placeName} • {issue.supporters} supporters</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                          <Eye className="h-3 w-3" /> Review
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive gap-1">
                          <Trash2 className="h-3 w-3" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={CheckCircle2} title="No flagged content" description="All complaints are within normal parameters." />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
