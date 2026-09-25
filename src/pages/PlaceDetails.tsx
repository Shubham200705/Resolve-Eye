import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockPlaces } from '@/data/mockData';
import { useAppStore } from '@/store/AppContext';
import { IssueCard } from '@/components/shared/IssueCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Plus,
  Shield,
  Utensils,
  Building2,
  Home,
} from 'lucide-react';
import { CATEGORY_LABELS, PLACE_LABELS, type PlaceCategory } from '@/types';

export function PlaceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issues } = useAppStore();

  const place = mockPlaces.find((p) => p.id === id);

  if (!place) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
        <EmptyState
          title="Place not found"
          description="The place you're looking for doesn't exist or has been removed."
          action={
            <Link to="/explore">
              <Button variant="outline">Back to Explore</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const placeIssues = issues.filter((i) => i.placeId === place.id);
  const activeIssues = placeIssues.filter((i) => i.status === 'submitted' || i.status === 'under_review' || i.status === 'in_progress');
  const resolvedIssuesList = placeIssues.filter((i) => i.status === 'resolved' || i.status === 'closed');

  const categoryIcon: Record<PlaceCategory, typeof Utensils> = {
    restaurant: Utensils,
    hostel: Building2,
    pg: Home,
  };
  const Icon = categoryIcon[place.category];

  const stats = [
    { label: 'Total Issues', value: place.totalIssues, icon: AlertCircle, color: 'text-navy bg-navy/5' },
    { label: 'Active', value: place.activeIssues, icon: AlertCircle, color: 'text-amber bg-amber-soft' },
    { label: 'Resolved', value: place.resolvedIssues, icon: CheckCircle2, color: 'text-emerald bg-emerald-soft' },
    { label: 'Resolution Rate', value: `${place.resolutionRate}%`, icon: TrendingUp, color: 'text-sky bg-sky-soft' },
    { label: 'Avg Resolution', value: `${place.avgResolutionDays}d`, icon: Clock, color: 'text-navy bg-navy/5' },
    { label: 'Rating', value: place.rating, icon: Star, color: 'text-amber bg-amber-soft' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Explore
      </Link>

      {/* Hero */}
      <Card className="p-0 overflow-hidden">
        <div className="relative h-56 sm:h-72 bg-muted">
          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-xs font-semibold">
                <Icon className="h-3.5 w-3.5" />
                {PLACE_LABELS[place.category]}
              </span>
              {place.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald/90 backdrop-blur px-2.5 py-1 text-xs font-semibold">
                  <Shield className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{place.name}</h1>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {place.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber text-amber" />
                {place.rating}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{place.description}</p>
          <Button
            onClick={() => navigate(`/report?place=${place.id}`)}
            className="bg-navy hover:bg-navy-light text-white gap-2 shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            Report Issue
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg mb-3 ${stat.color}`}>
                <StatIcon className="h-4.5 w-4.5" />
              </div>
              <p className="text-xl font-bold text-foreground leading-none">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Issue Categories */}
      <Card className="p-5">
        <h3 className="font-bold text-foreground mb-4">Reported Issue Categories</h3>
        <div className="flex flex-wrap gap-2">
          {place.issueCategories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-sm py-1.5 px-3">
              {CATEGORY_LABELS[cat]}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Active Issues */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Active Issues ({activeIssues.length})</h3>
        {activeIssues.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {activeIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} compact />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState icon={CheckCircle2} title="No active issues" description="All reported issues at this place have been resolved." />
          </Card>
        )}
      </div>

      {/* Resolved Issues */}
      {resolvedIssuesList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Resolved Issues ({resolvedIssuesList.length})</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {resolvedIssuesList.map((issue) => (
              <IssueCard key={issue.id} issue={issue} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
