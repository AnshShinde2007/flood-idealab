'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { District, WaterLevelStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DistrictRankingsProps {
  districts: District[];
}

const severityOrder: Record<WaterLevelStatus, number> = {
  critical: 0,
  danger: 1,
  rising: 2,
  normal: 3,
};

const statusConfig: Record<WaterLevelStatus, { label: string; bar: string; badge: string }> = {
  critical: {
    label: 'Critical',
    bar: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  danger: {
    label: 'Danger',
    bar: 'bg-chart-4',
    badge: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  },
  rising: {
    label: 'Rising',
    bar: 'bg-accent',
    badge: 'bg-accent/50 text-accent-foreground border-accent',
  },
  normal: {
    label: 'Safe',
    bar: 'bg-chart-1',
    badge: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  },
};

const MAX_WATER_LEVEL = 30; // metres — used for bar width calculation
const DEFAULT_SHOW = 5;

export function DistrictRankings({ districts }: DistrictRankingsProps) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...districts].sort((a, b) => {
    const severityDiff = severityOrder[a.status] - severityOrder[b.status];
    if (severityDiff !== 0) return severityDiff;
    return (b.waterLevel ?? 0) - (a.waterLevel ?? 0);
  });

  const displayed = showAll ? sorted : sorted.slice(0, DEFAULT_SHOW);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Droplets className="h-4 w-4 text-primary" />
          District Water Levels
        </CardTitle>
        <p className="text-xs text-muted-foreground">Ranked by flood severity</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {displayed.map((district, idx) => {
            const config = statusConfig[district.status];
            const barWidth = district.waterLevel
              ? Math.min((district.waterLevel / MAX_WATER_LEVEL) * 100, 100)
              : 0;

            return (
              <div key={district.id} className="flex items-center gap-3 px-4 py-3">
                {/* Rank */}
                <span className="w-5 text-center text-xs font-semibold text-muted-foreground shrink-0">
                  {idx + 1}
                </span>

                {/* Name + bar */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {district.name}
                    </span>
                    {district.waterLevel && (
                      <span className="text-xs text-muted-foreground ml-2 shrink-0">
                        {district.waterLevel.toFixed(1)}m
                      </span>
                    )}
                  </div>
                  {/* Water level bar */}
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', config.bar)}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                {/* Status badge */}
                <Badge
                  variant="outline"
                  className={cn('text-xs shrink-0', config.badge)}
                >
                  {config.label}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Show more / less toggle */}
        <button
          onClick={() => setShowAll((s) => !s)}
          className="flex w-full items-center justify-center gap-1.5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t border-border"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Show fewer districts
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Show all {sorted.length} districts
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
