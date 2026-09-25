import { Link } from 'react-router-dom';
import type { Place } from '@/types';
import { PLACE_LABELS } from '@/types';
import { Card } from '@/components/ui/card';
import { Star, MapPin, AlertCircle, CheckCircle2, TrendingUp, Utensils, Building2, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: Place;
  className?: string;
}

const categoryIcon: Record<string, typeof Utensils> = {
  restaurant: Utensils,
  hostel: Building2,
  pg: Home,
};

export function PlaceCard({ place, className }: PlaceCardProps) {
  const Icon = categoryIcon[place.category];
  return (
    <Link to={`/places/${place.id}`} className="block group">
      <Card
        className={cn(
          'overflow-hidden transition-all hover:shadow-lg hover:border-sky/30 cursor-pointer p-0',
          className
        )}
      >
        <div className="relative h-44 overflow-hidden bg-muted">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-navy">
              <Icon className="h-3.5 w-3.5" />
              {PLACE_LABELS[place.category]}
            </span>
            {place.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground leading-snug group-hover:text-sky transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-4 w-4 fill-amber text-amber" />
              <span className="text-sm font-semibold">{place.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{place.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted/60 py-2.5 px-1">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber" />
              </div>
              <p className="text-lg font-bold text-foreground leading-none">{place.activeIssues}</p>
              <p className="text-[0.65rem] text-muted-foreground mt-1">Active</p>
            </div>
            <div className="rounded-lg bg-muted/60 py-2.5 px-1">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
              </div>
              <p className="text-lg font-bold text-foreground leading-none">{place.resolvedIssues}</p>
              <p className="text-[0.65rem] text-muted-foreground mt-1">Resolved</p>
            </div>
            <div className="rounded-lg bg-muted/60 py-2.5 px-1">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <TrendingUp className="h-3.5 w-3.5 text-sky" />
              </div>
              <p className="text-lg font-bold text-foreground leading-none">{place.resolutionRate}%</p>
              <p className="text-[0.65rem] text-muted-foreground mt-1">Rate</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
