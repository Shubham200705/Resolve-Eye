import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Eye,
  ArrowRight,
  FileText,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  Shield,
  Users,
  Utensils,
  Building2,
  Home,
  Sparkles,
  Zap,
  Search,
  ArrowUp,
  Star,
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy">
              <Eye className="h-5 w-5 text-sky" />
            </div>
            <span className="text-xl font-bold tracking-tight text-navy">ResolveEye</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Workflow</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="hidden sm:block">
              <Button variant="ghost" className="text-sm font-semibold">Sign In</Button>
            </Link>
            <Link to="/report">
              <Button className="bg-navy hover:bg-navy-light text-white gap-2">
                <FileText className="h-4 w-4" />
                Report an Issue
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-soft border border-sky/20 px-4 py-1.5 text-sm font-semibold text-sky mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Resolution-focused, not review-focused
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
              Problems Deserve Resolution,
              <br />
              <span className="text-sky">Not Just Reviews.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Report issues, connect with management, and track progress from complaint to resolution.
              Built for restaurants, hostels, and PG accommodations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/report">
                <Button size="lg" className="bg-navy hover:bg-navy-light text-white font-semibold gap-2 h-12 px-8 rounded-xl w-full sm:w-auto">
                  Report an Issue
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="outline" className="font-semibold gap-2 h-12 px-8 rounded-xl w-full sm:w-auto border-border">
                  <Search className="h-4.5 w-4.5" />
                  Explore Places
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {[
              { label: 'Issues Reported', value: '2,847', icon: FileText },
              { label: 'Issues Resolved', value: '2,318', icon: CheckCircle2 },
              { label: 'Avg Resolution', value: '5.2 days', icon: TrendingUp },
              { label: 'Resolution Rate', value: '81%', icon: Shield },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-5 text-center border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5 mx-auto mb-3">
                    <Icon className="h-5 w-5 text-navy" />
                  </div>
                  <p className="text-2xl font-bold text-navy">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">How ResolveEye Works</h2>
            <p className="text-lg text-muted-foreground">A clear, structured process from reporting to resolution — designed for accountability.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: 'Report an Issue', desc: 'Document the problem with photos, descriptions, and severity levels. Our AI assistant helps you write a clear, professional complaint.', step: '01' },
              { icon: MessageSquare, title: 'Connect with Management', desc: 'Management receives your complaint and responds directly. Track their responses and stay informed at every step.', step: '02' },
              { icon: CheckCircle2, title: 'Track to Resolution', desc: 'Follow the status timeline from submission to resolution. Rate the quality of resolution and hold management accountable.', step: '03' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-7 relative overflow-hidden border-border hover:shadow-lg transition-shadow">
                  <span className="absolute top-4 right-5 text-5xl font-extrabold text-muted/20">{item.step}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-soft mb-5">
                    <Icon className="h-6 w-6 text-sky" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Places */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Supported Place Types</h2>
            <p className="text-lg text-muted-foreground">ResolveEye is built for the places where everyday issues matter most.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Utensils, title: 'Restaurants', desc: 'Report hygiene, food quality, and service issues at restaurants you visit.', color: 'sky' },
              { icon: Building2, title: 'Hostels', desc: 'Flag safety, maintenance, and facility problems at your hostel.', color: 'emerald' },
              { icon: Home, title: 'PG Accommodations', desc: 'Report water, electricity, cleanliness, and food issues at your PG.', color: 'amber' },
            ].map((item) => {
              const Icon = item.icon;
              const colors: Record<string, string> = {
                sky: 'bg-sky-soft text-sky',
                emerald: 'bg-emerald-soft text-emerald',
                amber: 'bg-amber-soft text-amber',
              };
              return (
                <Card key={item.title} className="p-8 text-center border-border hover:shadow-lg transition-shadow">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-5 ${colors[item.color]}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-white/60">Everything you need to report, track, and resolve problems effectively.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'AI-Powered Assistance', desc: 'Get help categorizing issues, improving complaint clarity, and generating professional drafts — simulated but practical.' },
              { icon: FileText, title: 'Evidence Upload', desc: 'Attach photos, videos, and documents to strengthen your complaint and provide clear proof of the issue.' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Follow a structured status workflow from submission to resolution with a detailed activity timeline.' },
              { icon: ArrowUp, title: 'Community Support', desc: 'Other users can support your issue, increasing visibility and priority for management attention.' },
              { icon: Star, title: 'Resolution Rating', desc: 'After an issue is resolved, rate the quality of resolution to promote accountability and transparency.' },
              { icon: Zap, title: 'Management Tools', desc: 'Management gets a professional dashboard to review, respond, and track resolution performance with analytics.' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky/20 mb-4">
                    <Icon className="h-5.5 w-5.5 text-sky" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resolution Workflow */}
      <section id="workflow" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Resolution Workflow</h2>
            <p className="text-lg text-muted-foreground">Every complaint follows a clear, trackable path from report to resolution.</p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-2 max-w-5xl mx-auto">
            {[
              { label: 'Submitted', desc: 'Complaint filed', color: 'bg-sky' },
              { label: 'Under Review', desc: 'Management reviews', color: 'bg-amber' },
              { label: 'In Progress', desc: 'Action taken', color: 'bg-amber' },
              { label: 'Resolved', desc: 'Issue fixed', color: 'bg-emerald' },
              { label: 'Closed', desc: 'Confirmed done', color: 'bg-muted-foreground' },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 lg:gap-2 w-full lg:w-auto">
                <Card className="p-5 flex-1 lg:flex-none lg:w-44 text-center border-border">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step.color} text-white mx-auto mb-3`}>
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold text-navy">{step.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </Card>
                {i < 4 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 lg:rotate-0 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-soft px-4 py-1.5 text-sm font-semibold text-emerald mb-5">
                <Shield className="h-4 w-4" />
                Trust & Transparency
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-5 leading-tight">
                Accountability built into every complaint.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Unlike traditional review platforms, ResolveEye focuses on getting problems solved.
                Every complaint is tracked, every response is recorded, and every resolution is rated.
              </p>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle2, text: 'Transparent status tracking from submission to closure' },
                  { icon: MessageSquare, text: 'Direct communication channel with management' },
                  { icon: Users, text: 'Community support to amplify important issues' },
                  { icon: Star, text: 'Resolution ratings to measure management effectiveness' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <p className="text-sm text-foreground">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Card className="p-8 border-border">
              <div className="flex items-center gap-3 mb-6">
                <img src="https://i.pravatar.cc/150?img=11" alt="user" className="h-12 w-12 rounded-full" />
                <div>
                  <p className="font-semibold text-navy">Aarav Sharma</p>
                  <p className="text-sm text-muted-foreground">Reported 14 issues • 9 resolved</p>
                </div>
              </div>
              <p className="text-sm text-foreground italic leading-relaxed mb-6">
                "I reported a hygiene issue at my local restaurant and within 8 days it was actually fixed.
                The management responded directly, and I could track every step. This is how complaints should work."
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-5 w-5 ${s <= 4 ? 'fill-amber text-amber' : 'text-muted'}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-2">Resolution rated 4/5</span>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-lg bg-emerald-soft p-3 text-center">
                  <p className="text-2xl font-bold text-emerald">8</p>
                  <p className="text-xs text-muted-foreground">Days to resolve</p>
                </div>
                <div className="flex-1 rounded-lg bg-sky-soft p-3 text-center">
                  <p className="text-2xl font-bold text-sky">12</p>
                  <p className="text-xs text-muted-foreground">Supporters</p>
                </div>
                <div className="flex-1 rounded-lg bg-amber-soft p-3 text-center">
                  <p className="text-2xl font-bold text-amber">3</p>
                  <p className="text-xs text-muted-foreground">Updates</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Ready to report an issue?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join thousands of users who are making their communities better, one resolved complaint at a time.</p>
          <Link to="/report">
            <Button size="lg" className="bg-navy hover:bg-navy-light text-white font-semibold gap-2 h-12 px-8 rounded-xl">
              <FileText className="h-5 w-5" />
              Report an Issue
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Eye className="h-5 w-5 text-sky" />
                </div>
                <span className="text-xl font-bold">ResolveEye</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                A problem-reporting and resolution platform for restaurants, hostels, and PG accommodations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Explore Places</Link></li>
                <li><Link to="/report" className="hover:text-white transition-colors">Report an Issue</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Get Started</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/report" className="hover:text-white transition-colors">Report Issue</Link></li>
                <li><Link to="/management" className="hover:text-white transition-colors">For Management</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/50">© 2024 ResolveEye. All rights reserved.</p>
            <p className="text-xs text-white/40">Frontend demonstration — all data is simulated.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
