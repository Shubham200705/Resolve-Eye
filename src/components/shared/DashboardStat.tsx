import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface DashboardStatProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; label: string };
  accent?: 'navy' | 'sky' | 'emerald' | 'amber' | 'red';
  className?: string;
}

const accentClasses = {
  navy: { bg: 'bg-navy text-white', soft: 'bg-navy/5 text-navy' },
  sky: { bg: 'bg-sky text-white', soft: 'bg-sky-soft text-sky' },
  emerald: { bg: 'bg-emerald text-white', soft: 'bg-emerald-soft text-emerald' },
  amber: { bg: 'bg-amber text-white', soft: 'bg-amber-soft text-amber' },
  red: { bg: 'bg-red text-white', soft: 'bg-red-soft text-red' },
};

export function DashboardStat({ label, value, icon, trend, accent = 'navy', className }: DashboardStatProps) {
  const colors = accentClasses[accent];
  return (
    <Card className={cn('p-5 transition-shadow hover:shadow-md', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', colors.soft)}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-semibold',
            trend.value >= 0 ? 'text-emerald' : 'text-red'
          )}>
            {trend.value >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground leading-none mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {trend && (
        <p className="text-xs text-muted-foreground/70 mt-2">{trend.label}</p>
      )}
    </Card>
  );
}
