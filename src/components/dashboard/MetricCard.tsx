import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  trend,
  icon: Icon,
  iconColor = 'text-primary',
  className,
}: MetricCardProps) {
  return (
    <div className={cn('metric-card group', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-card-label">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="metric-card-value">{value}</span>
            {unit && <span className="text-lg font-semibold text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110',
            iconColor
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span
            className={cn(
              'text-sm font-medium',
              trend === 'up' ? 'text-success' : 'text-destructive'
            )}
          >
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          <span className="text-sm text-muted-foreground">from last period</span>
        </div>
      )}
    </div>
  );
}
