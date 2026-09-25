export type IssueStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'urgent';
export type PlaceCategory = 'restaurant' | 'hostel' | 'pg';
export type IssueCategory =
  | 'hygiene'
  | 'water_supply'
  | 'electricity'
  | 'cleanliness'
  | 'food_quality'
  | 'maintenance'
  | 'safety'
  | 'other';

export type UserRole = 'user' | 'management' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  location: string;
  joinedDate: string;
  totalReports: number;
  resolvedReports: number;
  supportedIssues: number;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  location: string;
  address: string;
  rating: number;
  totalIssues: number;
  activeIssues: number;
  resolvedIssues: number;
  resolutionRate: number;
  avgResolutionDays: number;
  image: string;
  description: string;
  issueCategories: IssueCategory[];
  verified: boolean;
}

export interface Evidence {
  id: string;
  type: 'image' | 'video' | 'file';
  name: string;
  url: string;
}

export interface TimelineEntry {
  id: string;
  status: IssueStatus;
  timestamp: string;
  title: string;
  description: string;
  author: string;
  authorRole: UserRole;
}

export interface ManagementResponse {
  id: string;
  issueId: string;
  message: string;
  author: string;
  authorRole: UserRole;
  timestamp: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  placeId: string;
  placeName: string;
  placeCategory: PlaceCategory;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  submittedDate: string;
  lastUpdated: string;
  locationWithinPlace: string;
  dateOfIncident: string;
  evidence: Evidence[];
  supporters: number;
  hasSupported: boolean;
  resolutionRating?: number;
  timeline: TimelineEntry[];
  managementResponses: ManagementResponse[];
  submittedBy: string;
  submittedByAvatar: string;
  resolutionDays?: number;
}

export interface NotificationItem {
  id: string;
  type: 'complaint_submitted' | 'status_updated' | 'management_response' | 'issue_resolved' | 'support_received';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  issueId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface DraftComplaint {
  placeId?: string;
  category?: IssueCategory;
  title: string;
  description: string;
  dateOfIncident: string;
  locationWithinPlace: string;
  severity: IssueSeverity;
  evidence: Evidence[];
  aiDraft?: string;
}

export const STATUS_LABELS: Record<IssueStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const STATUS_COLORS: Record<IssueStatus, { bg: string; text: string; dot: string; border: string }> = {
  submitted: { bg: 'bg-sky-soft', text: 'text-sky', dot: 'bg-sky', border: 'border-sky/20' },
  under_review: { bg: 'bg-amber-soft', text: 'text-amber', dot: 'bg-amber', border: 'border-amber/20' },
  in_progress: { bg: 'bg-amber-soft', text: 'text-amber', dot: 'bg-amber', border: 'border-amber/20' },
  resolved: { bg: 'bg-emerald-soft', text: 'text-emerald', dot: 'bg-emerald', border: 'border-emerald/20' },
  closed: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground', border: 'border-border' },
};

export const SEVERITY_LABELS: Record<IssueSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const SEVERITY_COLORS: Record<IssueSeverity, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-sky-soft', text: 'text-sky', border: 'border-sky/20' },
  medium: { bg: 'bg-amber-soft', text: 'text-amber', border: 'border-amber/20' },
  high: { bg: 'bg-amber-soft', text: 'text-amber', border: 'border-amber/20' },
  urgent: { bg: 'bg-red-soft', text: 'text-red', border: 'border-red/20' },
};

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  hygiene: 'Hygiene',
  water_supply: 'Water Supply',
  electricity: 'Electricity',
  cleanliness: 'Cleanliness',
  food_quality: 'Food Quality',
  maintenance: 'Maintenance',
  safety: 'Safety',
  other: 'Other',
};

export const CATEGORY_ICONS: Record<IssueCategory, string> = {
  hygiene: 'Droplets',
  water_supply: 'Droplet',
  electricity: 'Zap',
  cleanliness: 'Sparkles',
  food_quality: 'UtensilsCrossed',
  maintenance: 'Wrench',
  safety: 'ShieldAlert',
  other: 'CircleDot',
};

export const PLACE_LABELS: Record<PlaceCategory, string> = {
  restaurant: 'Restaurant',
  hostel: 'Hostel',
  pg: 'PG Accommodation',
};

export const STATUS_ORDER: IssueStatus[] = ['submitted', 'under_review', 'in_progress', 'resolved', 'closed'];
