import { Clock, MapPin, Droplets, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloodUpdate, WaterLevelStatus, ActionRequired } from '@/lib/types';
import { cn } from '@/lib/utils';

interface UpdateCardProps {
  update: FloodUpdate;
}

const statusConfig: Record<WaterLevelStatus, { label: string; className: string; icon: string }> = {
  normal: {
    label: 'Normal',
    className: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    icon: 'bg-chart-1',
  },
  rising: {
    label: 'Rising',
    className: 'bg-accent/50 text-accent-foreground border-accent',
    icon: 'bg-accent',
  },
  danger: {
    label: 'Danger',
    className: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
    icon: 'bg-chart-4',
  },
  critical: {
    label: 'Critical',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: 'bg-destructive',
  },
};

const actionConfig: Record<ActionRequired, { label: string; className: string }> = {
  safe: {
    label: 'Safe',
    className: 'bg-chart-1 text-white',
  },
  'stay-alert': {
    label: 'Stay Alert',
    className: 'bg-accent text-accent-foreground',
  },
  evacuate: {
    label: 'Evacuate Now',
    className: 'bg-destructive text-destructive-foreground',
  },
};

export function UpdateCard({ update }: UpdateCardProps) {
  const status = statusConfig[update.waterLevel];
  const action = actionConfig[update.action];
  const isUrgent = update.waterLevel === 'critical' || update.action === 'evacuate';

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        isUrgent && 'border-destructive/50 shadow-destructive/10'
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Left Section: Status and Location */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Status Indicator */}
            <div
              className={cn(
                'mt-0.5 h-3 w-3 shrink-0 rounded-full',
                status.icon,
                isUrgent && 'animate-pulse'
              )}
            />

            <div className="min-w-0 flex-1">
              {/* Location */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {update.location}
                </h3>
              </div>

              {/* District and Time */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {update.district}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {update.time}
                </span>
              </div>

              {/* Details */}
              {update.details && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {update.details}
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Badges */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
            <Badge
              variant="outline"
              className={cn('text-xs font-medium', status.className)}
            >
              <Droplets className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
            <Badge className={cn('text-xs font-semibold', action.className)}>
              {update.action === 'evacuate' && (
                <AlertCircle className="mr-1 h-3 w-3" />
              )}
              {action.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
