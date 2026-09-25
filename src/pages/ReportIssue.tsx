import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockPlaces } from '@/data/mockData';
import { useAppStore } from '@/store/AppContext';
import { aiMockResponses } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Utensils,
  Building2,
  Home,
  Droplets,
  Zap,
  Sparkles,
  Wrench,
  ShieldAlert,
  CircleDot,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles as SparklesIcon,
  Send,
  CheckCircle2,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import type {
  PlaceCategory,
  IssueCategory,
  IssueSeverity,
  Evidence,
  Issue,
} from '@/types';
import {
  CATEGORY_LABELS,
  SEVERITY_LABELS,
  PLACE_LABELS,
  STATUS_LABELS,
} from '@/types';
import { cn } from '@/lib/utils';

const placeCategoryOptions: { value: PlaceCategory; label: string; icon: typeof Utensils; desc: string }[] = [
  { value: 'restaurant', label: 'Restaurant', icon: Utensils, desc: 'Dining establishments' },
  { value: 'hostel', label: 'Hostel', icon: Building2, desc: 'Shared accommodation' },
  { value: 'pg', label: 'PG Accommodation', icon: Home, desc: 'Paying guest housing' },
];

const issueCategoryOptions: { value: IssueCategory; label: string; icon: typeof Droplets }[] = [
  { value: 'hygiene', label: 'Hygiene', icon: Droplets },
  { value: 'water_supply', label: 'Water Supply', icon: Droplets },
  { value: 'electricity', label: 'Electricity', icon: Zap },
  { value: 'cleanliness', label: 'Cleanliness', icon: Sparkles },
  { value: 'food_quality', label: 'Food Quality', icon: Utensils },
  { value: 'maintenance', label: 'Maintenance', icon: Wrench },
  { value: 'safety', label: 'Safety', icon: ShieldAlert },
  { value: 'other', label: 'Other', icon: CircleDot },
];

const severityOptions: { value: IssueSeverity; label: string; desc: string; color: string }[] = [
  { value: 'low', label: 'Low', desc: 'Minor inconvenience', color: 'border-sky/30 bg-sky-soft text-sky' },
  { value: 'medium', label: 'Medium', desc: 'Noticeable impact', color: 'border-amber/30 bg-amber-soft text-amber' },
  { value: 'high', label: 'High', desc: 'Significant problem', color: 'border-amber/30 bg-amber-soft text-amber' },
  { value: 'urgent', label: 'Urgent', desc: 'Immediate attention needed', color: 'border-red/30 bg-red-soft text-red' },
];

const steps = ['Select Place', 'Issue Category', 'Describe Problem', 'Upload Evidence', 'AI Assistance', 'Review & Submit'];

export function ReportIssue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addIssue } = useAppStore();

  const [step, setStep] = useState(0);
  const [placeCategory, setPlaceCategory] = useState<PlaceCategory | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(searchParams.get('place') || '');
  const [issueCategory, setIssueCategory] = useState<IssueCategory | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateOfIncident, setDateOfIncident] = useState('');
  const [locationWithinPlace, setLocationWithinPlace] = useState('');
  const [severity, setSeverity] = useState<IssueSeverity>('medium');
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [aiDraft, setAiDraft] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredPlaces = mockPlaces.filter((p) => placeCategory === null || p.category === placeCategory);
  const selectedPlace = mockPlaces.find((p) => p.id === selectedPlaceId);

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!selectedPlaceId) newErrors.place = 'Please select a place';
    }
    if (step === 1) {
      if (!issueCategory) newErrors.category = 'Please select an issue category';
    }
    if (step === 2) {
      if (!title.trim()) newErrors.title = 'Issue title is required';
      if (!description.trim()) newErrors.description = 'Description is required';
      if (title.trim().length < 10) newErrors.title = 'Title must be at least 10 characters';
      if (description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
      setErrors({});
    }
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  }

  function simulateUpload(type: 'image' | 'video' | 'file') {
    const names: Record<string, string[]> = {
      image: ['evidence_photo.jpg', 'issue_screenshot.png', 'scene_photo.jpg'],
      video: ['incident_clip.mp4', 'recording.mp4'],
      file: ['incident_report.pdf', 'complaint_log.pdf'],
    };
    const name = names[type][Math.floor(Math.random() * names[type].length)];
    const newEvidence: Evidence = {
      id: `e-${Date.now()}`,
      type,
      name,
      url: type === 'image' ? 'https://images.unsplash.com/photo-1581578731548-cba46acebb9b?w=400&q=80' : '#',
    };
    setEvidence((prev) => [...prev, newEvidence]);
  }

  function removeEvidence(id: string) {
    setEvidence((prev) => prev.filter((e) => e.id !== id));
  }

  function generateAiDraft() {
    setAiLoading(true);
    setTimeout(() => {
      let responseKey = 'default';
      if (issueCategory === 'hygiene') responseKey = 'hygiene';
      else if (issueCategory === 'water_supply') responseKey = 'water';
      else if (issueCategory === 'electricity') responseKey = 'electricity';
      else if (issueCategory === 'maintenance') responseKey = 'maintenance';
      else if (issueCategory === 'safety') responseKey = 'safety';
      else responseKey = 'write';

      const baseDraft = aiMockResponses[responseKey] || aiMockResponses.default;
      const placeName = selectedPlace?.name || '[Place Name]';

      const draft = `Subject: ${title || '[Issue Title]'} at ${placeName}

I am writing to report an issue regarding ${issueCategory ? CATEGORY_LABELS[issueCategory].toLowerCase() : '[category]'} at ${placeName}, located at ${selectedPlace?.location || '[location]'}. The problem was observed on ${dateOfIncident || '[date]'}${locationWithinPlace ? ` at ${locationWithinPlace}` : ''}.

Description of the issue:
${description || '[Describe what happened, what you observed, and how it affects you or others]'}

Impact:
This issue ${severity === 'urgent' ? 'urgently' : ''} affects the health, safety, and comfort of patrons/residents. ${severity === 'urgent' ? 'Immediate action is required to prevent further harm.' : 'Prompt attention would be appreciated.'}

Evidence attached:
${evidence.length > 0 ? evidence.map((e) => `• ${e.name}`).join('\n') : 'No evidence attached at this time.'}

I request that this issue be addressed promptly. Please acknowledge receipt of this complaint and provide an estimated timeline for resolution.

Thank you for your attention to this matter.`;

      setAiDraft(draft);
      setAiResponse(baseDraft);
      setAiLoading(false);
    }, 1800);
  }

  function handleSubmit() {
    const newIssue: Issue = {
      id: `IS-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
      title,
      description,
      placeId: selectedPlaceId,
      placeName: selectedPlace?.name || 'Unknown',
      placeCategory: selectedPlace?.category || 'restaurant',
      category: issueCategory || 'other',
      severity,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      locationWithinPlace,
      dateOfIncident,
      evidence,
      supporters: 0,
      hasSupported: false,
      timeline: [
        {
          id: `t-${Date.now()}`,
          status: 'submitted',
          timestamp: new Date().toISOString(),
          title: 'Complaint Submitted',
          description: 'Issue reported and assigned tracking ID.',
          author: 'Aarav Sharma',
          authorRole: 'user',
        },
      ],
      managementResponses: [],
      submittedBy: 'Aarav Sharma',
      submittedByAvatar: 'https://i.pravatar.cc/150?img=11',
    };
    addIssue(newIssue);
    setSubmittedId(newIssue.id);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 lg:py-20">
        <Card className="p-8 sm:p-12 text-center animate-scale-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-soft mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Submitted Successfully</h2>
          <p className="text-muted-foreground mb-1">Your complaint has been filed and assigned tracking ID:</p>
          <p className="text-xl font-mono font-bold text-sky mb-6">{submittedId}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(`/issues/${submittedId}`)} className="gap-2">
              <FileText className="h-4 w-4" />
              Track This Issue
            </Button>
            <Button variant="outline" onClick={() => navigate('/my-issues')}>
              View All My Issues
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-1 shrink-0">
            <div className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
              i === step ? 'bg-navy text-white' : i < step ? 'bg-emerald-soft text-emerald' : 'bg-muted text-muted-foreground'
            )}>
              <span className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem]',
                i === step ? 'bg-white/20' : i < step ? 'bg-emerald text-white' : 'bg-muted-foreground/20'
              )}>
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6 lg:p-8">
        {/* Step 0: Select Place */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Where did the issue occur?</h3>
              <p className="text-sm text-muted-foreground">Select the type of place, then choose the specific place.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {placeCategoryOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => { setPlaceCategory(opt.value); setSelectedPlaceId(''); }}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all text-center',
                      placeCategory === opt.value
                        ? 'border-sky bg-sky-soft/30'
                        : 'border-border hover:border-sky/30 hover:bg-muted/30'
                    )}
                  >
                    <div className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl',
                      placeCategory === opt.value ? 'bg-sky text-white' : 'bg-muted text-muted-foreground'
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {placeCategory && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Select a specific place</Label>
                <div className="grid sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {filteredPlaces.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => setSelectedPlaceId(place.id)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all',
                        selectedPlaceId === place.id
                          ? 'border-sky bg-sky-soft/30'
                          : 'border-border hover:border-sky/30 hover:bg-muted/30'
                      )}
                    >
                      <img src={place.image} alt={place.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm truncate">{place.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{place.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-amber font-semibold flex items-center gap-0.5">
                            <SparklesIcon className="h-3 w-3" /> {place.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">{place.activeIssues} active</span>
                        </div>
                      </div>
                      {selectedPlaceId === place.id && (
                        <Check className="h-5 w-5 text-sky shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {errors.place && <p className="text-sm text-destructive font-medium">{errors.place}</p>}
          </div>
        )}

        {/* Step 1: Issue Category */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">What type of issue is it?</h3>
              <p className="text-sm text-muted-foreground">Choose the category that best describes the problem.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {issueCategoryOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setIssueCategory(opt.value)}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all text-center',
                      issueCategory === opt.value
                        ? 'border-sky bg-sky-soft/30'
                        : 'border-border hover:border-sky/30 hover:bg-muted/30'
                    )}
                  >
                    <div className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl',
                      issueCategory === opt.value ? 'bg-sky text-white' : 'bg-muted text-muted-foreground'
                    )}>
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <p className="font-semibold text-foreground text-xs">{opt.label}</p>
                  </button>
                );
              })}
            </div>
            {errors.category && <p className="text-sm text-destructive font-medium">{errors.category}</p>}
          </div>
        )}

        {/* Step 2: Describe Problem */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Describe the problem in detail</h3>
              <p className="text-sm text-muted-foreground">The more specific you are, the faster it can be resolved.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="mb-1.5 block">Issue Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  placeholder="e.g., Unhygienic kitchen conditions at restaurant"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="description" className="mb-1.5 block">Detailed Description <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe what happened, when you noticed it, and how it affects you or others..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="mb-1.5 block">Date of Incident</Label>
                  <Input id="date" type="date" value={dateOfIncident} onChange={(e) => setDateOfIncident(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="location" className="mb-1.5 block">Location within place</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main kitchen, Floor 2 bathroom"
                    value={locationWithinPlace}
                    onChange={(e) => setLocationWithinPlace(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Severity Level</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {severityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSeverity(opt.value)}
                      className={cn(
                        'rounded-xl border-2 p-3 text-center transition-all',
                        severity === opt.value ? opt.color : 'border-border hover:bg-muted/30'
                      )}
                    >
                      <p className="font-bold text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Upload Evidence */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Upload evidence (optional)</h3>
              <p className="text-sm text-muted-foreground">Attach photos, videos, or documents to support your complaint.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => simulateUpload('image')}
                className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-all hover:border-sky/40 hover:bg-sky-soft/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-soft text-sky">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-foreground">Photo</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG</p>
                </div>
              </button>
              <button
                onClick={() => simulateUpload('video')}
                className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-all hover:border-sky/40 hover:bg-sky-soft/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-soft text-emerald">
                  <Video className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-foreground">Video</p>
                  <p className="text-xs text-muted-foreground">MP4, MOV</p>
                </div>
              </button>
              <button
                onClick={() => simulateUpload('file')}
                className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-all hover:border-sky/40 hover:bg-sky-soft/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-soft text-amber">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-foreground">Document</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC</p>
                </div>
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              This is a simulated upload — no files are actually sent to a server.
            </p>

            {evidence.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Attached Evidence ({evidence.length})</Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {evidence.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      {e.type === 'image' ? (
                        <img src={e.url} alt={e.name} className="h-12 w-12 rounded-md object-cover shrink-0" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted shrink-0">
                          {e.type === 'video' ? <Video className="h-5 w-5 text-muted-foreground" /> : <FileText className="h-5 w-5 text-muted-foreground" />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{e.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{e.type}</p>
                      </div>
                      <button onClick={() => removeEvidence(e.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: AI Assistance */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-xl bg-sky-soft/30 border border-sky/20 p-4">
              <AlertTriangle className="h-5 w-5 text-sky shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Simulated AI Assistance</p>
                <p className="text-xs text-muted-foreground mt-0.5">This is a frontend demonstration. No real AI model is being used. All responses are predefined mock content.</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">AI-Powered Complaint Enhancement</h3>
              <p className="text-sm text-muted-foreground">Let our AI assistant help you craft a clearer, more professional complaint.</p>
            </div>

            <Button onClick={generateAiDraft} disabled={aiLoading} className="gap-2 w-full sm:w-auto">
              {aiLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating draft...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  Generate Professional Complaint Draft
                </>
              )}
            </Button>

            {aiResponse && !aiLoading && (
              <div className="space-y-4">
                {/* AI Suggestions */}
                <div className="rounded-xl border border-sky/20 bg-sky-soft/20 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-sky" />
                    <p className="text-sm font-semibold text-sky">AI Suggestions</p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{aiResponse.split('---')[0]}</p>
                  {issueCategory === 'safety' && (
                    <div className="rounded-lg bg-red-soft border border-red/20 p-3 mt-2">
                      <p className="text-sm font-semibold text-red flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4" /> Safety Guidance
                      </p>
                      <p className="text-xs text-red mt-1">If anyone is in immediate danger, contact emergency services first, then file this report.</p>
                    </div>
                  )}
                </div>

                {/* Generated Draft */}
                {aiDraft && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Generated Complaint Draft (editable)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1"
                        onClick={() => navigator.clipboard?.writeText(aiDraft)}
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </Button>
                    </div>
                    <Textarea
                      value={aiDraft}
                      onChange={(e) => setAiDraft(e.target.value)}
                      rows={14}
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">You can edit the draft above before submitting. The final description will use this text if provided.</p>
                  </div>
                )}
              </div>
            )}

            {!aiResponse && !aiLoading && (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <SparklesIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Click the button above to generate a professional complaint draft with AI suggestions.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Review your complaint</h3>
              <p className="text-sm text-muted-foreground">Please verify all details before submitting.</p>
            </div>

            <div className="space-y-4">
              {/* Summary rows */}
              <div className="grid sm:grid-cols-2 gap-4">
                <ReviewRow label="Place" value={selectedPlace?.name || ''} sub={selectedPlace ? PLACE_LABELS[selectedPlace.category] : ''} />
                <ReviewRow label="Category" value={issueCategory ? CATEGORY_LABELS[issueCategory] : ''} />
                <ReviewRow label="Severity" value={SEVERITY_LABELS[severity]} />
                <ReviewRow label="Date of Incident" value={dateOfIncident || 'Not specified'} />
                <ReviewRow label="Location" value={locationWithinPlace || 'Not specified'} />
                <ReviewRow label="Evidence" value={`${evidence.length} file(s)`} />
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Issue Title</p>
                <p className="text-sm font-semibold text-foreground">{title}</p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-foreground whitespace-pre-line">{description}</p>
              </div>

              {aiDraft && (
                <div className="rounded-lg border border-sky/20 bg-sky-soft/10 p-4">
                  <p className="text-xs font-semibold text-sky uppercase tracking-wide mb-1">AI-Enhanced Draft</p>
                  <p className="text-sm text-foreground whitespace-pre-line font-mono text-xs">{aiDraft}</p>
                </div>
              )}

              {evidence.length > 0 && (
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Evidence Files</p>
                  <div className="flex flex-wrap gap-2">
                    {evidence.map((e) => (
                      <span key={e.id} className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                        {e.type === 'image' ? <ImageIcon className="h-3 w-3" /> : e.type === 'video' ? <Video className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                        {e.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-amber-soft/30 border border-amber/20 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                By submitting, you confirm that the information provided is accurate to the best of your knowledge.
                False reports may result in account restrictions.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 0} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} className="gap-1.5">
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2 bg-emerald hover:bg-emerald/90 text-white">
              <Send className="h-4 w-4" />
              Submit Complaint
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function ReviewRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}
