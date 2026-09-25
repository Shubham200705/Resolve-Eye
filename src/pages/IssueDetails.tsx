import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppStore } from '@/store/AppContext';
import { mockPlaces } from '@/data/mockData';
import { Timeline } from '@/components/shared/Timeline';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  ArrowUp,
  MessageSquare,
  Star,
  Image as ImageIcon,
  Video,
  FileText,
  Building2,
  Send,
  CheckCircle2,
} from 'lucide-react';
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type IssueStatus,
} from '@/types';
import { cn } from '@/lib/utils';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function IssueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issues, supportIssue, rateResolution, updateIssue, addManagementResponse } = useAppStore();

  const issue = issues.find((i) => i.id === id);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingBox, setShowRatingBox] = useState(false);

  if (!issue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
        <EmptyState
          title="Issue not found"
          description="This issue may have been removed or the ID is incorrect."
          action={<Button variant="outline" onClick={() => navigate('/my-issues')}>Back to My Issues</Button>}
        />
      </div>
    );
  }

  const currentIssue = issue;
  const place = mockPlaces.find((p) => p.id === currentIssue.placeId);
  const isResolved = currentIssue.status === 'resolved' || currentIssue.status === 'closed';
  const canRate = currentIssue.status === 'resolved' && !currentIssue.resolutionRating;

  const handleSupport = () => {
    supportIssue(currentIssue.id);
  };

  const handleRate = () => {
    if (rating > 0) {
      rateResolution(currentIssue.id, rating);
      setShowRatingBox(false);
    }
  };

  const handleAddResponse = () => {
    if (comment.trim()) {
      addManagementResponse(currentIssue.id, comment.trim());
      setComment('');
    }
  };

  const handleStatusUpdate = (newStatus: IssueStatus) => {
    updateIssue(currentIssue.id, {
      status: newStatus,
      lastUpdated: new Date().toISOString(),
      timeline: [
        ...currentIssue.timeline,
        {
          id: `t-${Date.now()}`,
          status: newStatus,
          timestamp: new Date().toISOString(),
          title: STATUS_LABELS[newStatus],
          description: 'Status updated by management.',
          author: 'Ravi Kumar',
          authorRole: 'management',
        },
      ],
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      <Link to="/my-issues" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to My Issues
      </Link>

      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-sm font-mono font-bold text-muted-foreground">{issue.id}</span>
          <StatusBadge status={issue.status} />
          <SeverityBadge severity={issue.severity} />
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{CATEGORY_LABELS[issue.category]}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 leading-tight">{issue.title}</h1>
        <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {issue.placeName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Reported {formatDate(issue.submittedDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Updated {formatDate(issue.lastUpdated)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
          <Avatar className="h-9 w-9">
            <AvatarImage src={issue.submittedByAvatar} alt={issue.submittedBy} />
            <AvatarFallback>{issue.submittedBy[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{issue.submittedBy}</p>
            <p className="text-xs text-muted-foreground">Complainant</p>
          </div>
          <Button
            variant={issue.hasSupported ? 'default' : 'outline'}
            onClick={handleSupport}
            className={cn('gap-1.5', issue.hasSupported && 'bg-sky hover:bg-sky/90 text-white')}
          >
            <ArrowUp className="h-4 w-4" />
            {issue.hasSupported ? 'Supported' : 'Support'}
            <span className="ml-1 rounded-md bg-white/20 px-1.5 py-0.5 text-xs font-bold">{issue.supporters}</span>
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Description, Evidence, Responses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-3">Description</h3>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{issue.description}</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-5 pt-5 border-t border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Date of Incident</p>
                <p className="text-sm text-foreground">{issue.dateOfIncident ? formatDate(issue.dateOfIncident) : 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Location within place</p>
                <p className="text-sm text-foreground">{issue.locationWithinPlace || 'Not specified'}</p>
              </div>
            </div>
          </Card>

          {/* Evidence */}
          {issue.evidence.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4">Evidence Gallery ({issue.evidence.length})</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {issue.evidence.map((e) => (
                  <div key={e.id} className="rounded-lg border border-border overflow-hidden">
                    {e.type === 'image' ? (
                      <img src={e.url} alt={e.name} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 flex flex-col items-center justify-center bg-muted gap-2">
                        {e.type === 'video' ? <Video className="h-8 w-8 text-muted-foreground" /> : <FileText className="h-8 w-8 text-muted-foreground" />}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground p-2 truncate flex items-center gap-1.5">
                      {e.type === 'image' ? <ImageIcon className="h-3 w-3" /> : e.type === 'video' ? <Video className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {e.name}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Management Responses */}
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-sky" />
              Management Responses ({issue.managementResponses.length})
            </h3>
            {issue.managementResponses.length > 0 ? (
              <div className="space-y-4">
                {issue.managementResponses.map((resp) => (
                  <div key={resp.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-bold">
                        {resp.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{resp.author}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(resp.timestamp)}</p>
                      </div>
                      <span className="rounded-md bg-navy/5 px-2 py-1 text-xs font-semibold text-navy">Management</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{resp.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No responses from management yet.</p>
            )}

            {/* Add Response (simulated management reply) */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Simulate a management response (demo):</p>
              <div className="flex gap-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type a management response..."
                  rows={2}
                  className="text-sm"
                />
              </div>
              <Button onClick={handleAddResponse} disabled={!comment.trim()} size="sm" className="mt-2 gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Post Response
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Timeline, Place, Actions */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-5">Progress Timeline</h3>
            <Timeline entries={issue.timeline} currentStatus={issue.status} />
          </Card>

          {/* Place Info */}
          {place && (
            <Card className="p-5">
              <h3 className="font-bold text-foreground mb-3">Place Information</h3>
              <Link to={`/places/${place.id}`} className="flex items-center gap-3 group">
                <img src={place.image} alt={place.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-sky transition-colors truncate">{place.name}</p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3 w-3" />
                    {place.location}
                  </p>
                </div>
              </Link>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center rounded-lg bg-muted/50 py-2">
                  <p className="text-sm font-bold text-foreground">{place.activeIssues}</p>
                  <p className="text-[0.65rem] text-muted-foreground">Active</p>
                </div>
                <div className="text-center rounded-lg bg-muted/50 py-2">
                  <p className="text-sm font-bold text-foreground">{place.resolvedIssues}</p>
                  <p className="text-[0.65rem] text-muted-foreground">Resolved</p>
                </div>
                <div className="text-center rounded-lg bg-muted/50 py-2">
                  <p className="text-sm font-bold text-foreground">{place.resolutionRate}%</p>
                  <p className="text-[0.65rem] text-muted-foreground">Rate</p>
                </div>
              </div>
            </Card>
          )}

          {/* Resolution Rating */}
          {isResolved && (
            <Card className="p-5">
              <h3 className="font-bold text-foreground mb-3">Resolution Quality</h3>
              {issue.resolutionRating ? (
                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn('h-6 w-6', s <= issue.resolutionRating! ? 'fill-amber text-amber' : 'text-muted')}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">You rated this resolution {issue.resolutionRating}/5</p>
                </div>
              ) : canRate ? (
                <div>
                  {showRatingBox ? (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">How well was this resolved?</p>
                      <div className="flex justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(s)}
                          >
                            <Star
                              className={cn(
                                'h-7 w-7 transition-colors',
                                s <= (hoverRating || rating) ? 'fill-amber text-amber' : 'text-muted hover:text-amber/50'
                              )}
                            />
                          </button>
                        ))}
                      </div>
                      <Button onClick={handleRate} disabled={rating === 0} size="sm" className="gap-1.5 w-full">
                        <CheckCircle2 className="h-4 w-4" />
                        Submit Rating
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setShowRatingBox(true)} variant="outline" className="w-full gap-2">
                      <Star className="h-4 w-4" />
                      Rate Resolution
                    </Button>
                  )}
                </div>
              ) : null}
            </Card>
          )}

          {/* Management Quick Actions (demo) */}
          {issue.status !== 'closed' && (
            <Card className="p-5">
              <h3 className="font-bold text-foreground mb-3">Status Actions (Demo)</h3>
              <p className="text-xs text-muted-foreground mb-3">Simulate management status updates:</p>
              <div className="flex flex-col gap-2">
                {issue.status === 'submitted' && (
                  <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('under_review')}>
                    Mark Under Review
                  </Button>
                )}
                {(issue.status === 'submitted' || issue.status === 'under_review') && (
                  <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('in_progress')}>
                    Mark In Progress
                  </Button>
                )}
                {(issue.status === 'submitted' || issue.status === 'under_review' || issue.status === 'in_progress') && (
                  <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('resolved')} className="text-emerald border-emerald/30 hover:bg-emerald-soft">
                    Mark Resolved
                  </Button>
                )}
                {issue.status === 'resolved' && (
                  <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('closed')}>
                    Close Issue
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
