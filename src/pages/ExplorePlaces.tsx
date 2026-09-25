import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockPlaces } from '@/data/mockData';
import { PlaceCard } from '@/components/shared/PlaceCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Utensils, Building2, Home, SlidersHorizontal, X } from 'lucide-react';
import type { PlaceCategory } from '@/types';
import { cn } from '@/lib/utils';

const categories: { value: PlaceCategory | 'all'; label: string; icon: typeof Utensils }[] = [
  { value: 'all', label: 'All Places', icon: Search },
  { value: 'restaurant', label: 'Restaurants', icon: Utensils },
  { value: 'hostel', label: 'Hostels', icon: Building2 },
  { value: 'pg', label: 'PGs', icon: Home },
];

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'active', label: 'Most Active Issues' },
  { value: 'resolved', label: 'Most Resolved' },
  { value: 'rate', label: 'Best Resolution Rate' },
];

export function ExplorePlaces() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState('rating');

  const filteredPlaces = useMemo(() => {
    let result = mockPlaces;
    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'active': return b.activeIssues - a.activeIssues;
        case 'resolved': return b.resolvedIssues - a.resolvedIssues;
        case 'rate': return b.resolutionRate - a.resolutionRate;
        default: return 0;
      }
    });
    return result;
  }, [search, category, sortBy]);

  const hasFilters = search.trim() || category !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all',
                  category === cat.value
                    ? 'bg-navy text-white'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {filteredPlaces.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'}
            {hasFilters && ' matching your filters'}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Search}
          title="No places found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            hasFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
              >
                Clear Filters
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
