import { Link } from 'react-router-dom';
import { useAppStore, currentUser } from '@/store/AppContext';
import { DashboardStat } from '@/components/shared/DashboardStat';
import { IssueCard } from '@/components/shared/IssueCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  FileText,
  CheckCircle2,
  ArrowUp,
  Calendar,
  MapPin,
  Mail,
  Settings,
  Bell,
  Shield,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Profile() {
  const { issues } = useAppStore();
  const userIssues = issues.filter((i) => i.submittedBy === 'Aarav Sharma');
  const resolvedIssues = userIssues.filter((i) => i.status === 'resolved' || i.status === 'closed');
  const supportedIssues = userIssues.filter((i) => i.hasSupported);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      {/* Profile Header */}
      <Card className="p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald border-2 border-background">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground mb-3">{currentUser.email}</p>
            <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {currentUser.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined {new Date(currentUser.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <span className="rounded-lg bg-navy/5 px-3 py-1.5 text-sm font-semibold text-navy text-center">
              {currentUser.role === 'user' ? 'Standard User' : currentUser.role}
            </span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <DashboardStat label="Total Reports" value={currentUser.totalReports} icon={<FileText className="h-5 w-5" />} accent="navy" />
        <DashboardStat label="Resolved" value={currentUser.resolvedReports} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
        <DashboardStat label="Supported" value={currentUser.supportedIssues} icon={<ArrowUp className="h-5 w-5" />} accent="sky" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Issues</TabsTrigger>
          <TabsTrigger value="supported">Supported</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Report History */}
        <TabsContent value="history" className="space-y-4">
          {userIssues.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {userIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} compact />
              ))}
            </div>
          ) : (
            <Card><EmptyState icon={FileText} title="No reports yet" description="Start reporting issues to see them here." /></Card>
          )}
        </TabsContent>

        {/* Resolved */}
        <TabsContent value="resolved" className="space-y-4">
          {resolvedIssues.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {resolvedIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} compact />
              ))}
            </div>
          ) : (
            <Card><EmptyState icon={CheckCircle2} title="No resolved issues" description="Your resolved complaints will appear here." /></Card>
          )}
        </TabsContent>

        {/* Supported */}
        <TabsContent value="supported" className="space-y-4">
          {supportedIssues.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {supportedIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} compact />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
                icon={ArrowUp}
                title="No supported issues"
                description="Support other users' issues to help amplify them."
                action={<Link to="/explore"><Button variant="outline">Explore Issues</Button></Link>}
              />
            </Card>
          )}
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-sky" />
              Notification Settings
            </h3>
            <p className="text-sm text-muted-foreground mb-5">Choose which notifications you want to receive.</p>
            <div className="space-y-1">
              {[
                { label: 'Complaint submitted confirmations', desc: 'When you file a new complaint', defaultOn: true },
                { label: 'Status updates', desc: 'When your issue status changes', defaultOn: true },
                { label: 'Management responses', desc: 'When management replies to your issue', defaultOn: true },
                { label: 'Issue resolved', desc: 'When your issue is marked resolved', defaultOn: true },
                { label: 'Support received', desc: 'When others support your issue', defaultOn: false },
                { label: 'Email digest', desc: 'Weekly summary of your activity', defaultOn: false },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{setting.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{setting.desc}</p>
                  </div>
                  <Switch defaultChecked={setting.defaultOn} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-emerald" />
              Privacy & Security
            </h3>
            <p className="text-sm text-muted-foreground mb-5">Control your profile visibility and data.</p>
            <div className="space-y-1">
              {[
                { label: 'Public profile', desc: 'Allow others to see your report history', defaultOn: true },
                { label: 'Anonymous reporting', desc: 'Hide your name on complaints by default', defaultOn: false },
                { label: 'Show supporter count', desc: 'Display issues you have supported', defaultOn: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{setting.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{setting.desc}</p>
                  </div>
                  <Switch defaultChecked={setting.defaultOn} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
              <Settings className="h-4.5 w-4.5 text-muted-foreground" />
              Account
            </h3>
            <p className="text-sm text-muted-foreground mb-5">Manage your account information.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="gap-2 flex-1">
                <Mail className="h-4 w-4" />
                Change Email
              </Button>
              <Button variant="outline" className="gap-2 flex-1">
                <Shield className="h-4 w-4" />
                Change Password
              </Button>
              <Button variant="outline" className="gap-2 flex-1 text-destructive border-destructive/30 hover:bg-red-soft">
                Delete Account
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
