import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/AppContext';
import { IssueCard } from '@/components/shared/IssueCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X, Plus, FileText, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IssueStatus } from '@/types';
import { cn } from '@/lib/utils';

const tabFilters: { value: IssueStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'submitted', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'supporters', label: 'Most Supported' },
];

export function MyIssues() {
  const { issues } = useAppStore();
  const userIssues = issues.filter((i) => i.submittedBy === 'Aarav Sharma');

  const [tab, setTab] = useState<IssueStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredIssues = useMemo(() => {
    let result = userIssues;
    if (tab === 'submitted') {
      result = result.filter((i) => i.status === 'submitted' || i.status === 'under_review');
    } else if (tab !== 'all') {
      result = result.filter((i) => i.status === tab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(q) || i.placeName.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'recent': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'oldest': return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
        case 'supporters': return b.supporters - a.supporters;
        default: return 0;
      }
    });
    return result;
  }, [userIssues, tab, search, sortBy]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: userIssues.length };
    counts['submitted'] = userIssues.filter((i) => i.status === 'submitted' || i.status === 'under_review').length;
    counts['in_progress'] = userIssues.filter((i) => i.status === 'in_progress').length;
    counts['resolved'] = userIssues.filter((i) => i.status === 'resolved').length;
    counts['closed'] = userIssues.filter((i) => i.status === 'closed').length;
    return counts;
  }, [userIssues]);

  const hasFilters = search.trim() || tab !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as IssueStatus | 'all')}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList className="h-auto flex-wrap">
            {tabFilters.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="gap-1.5 py-1.5">
                {t.label}
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold',
                  tab === t.value ? 'bg-navy text-white' : 'bg-muted text-muted-foreground'
                )}>
                  {tabCounts[t.value] || 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          <Link to="/report">
            <Button size="sm" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              Report New
            </Button>
          </Link>
        </div>
      </Tabs>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, place, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredIssues.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={FileText}
          title={hasFilters ? "No issues match your filters" : "No issues reported yet"}
          description={hasFilters ? "Try adjusting your search or filters." : "Start reporting problems to track their resolution."}
          action={
            hasFilters ? (
              <Button variant="outline" onClick={() => { setSearch(''); setTab('all'); }}>
                Clear Filters
              </Button>
            ) : (
              <Link to="/report">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Report an Issue
                </Button>
              </Link>
            )
          }
        />
      )}
    </div>
  );
}
