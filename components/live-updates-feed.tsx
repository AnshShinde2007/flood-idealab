'use client';

import { useState } from 'react';
import { RefreshCw, Filter, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UpdateCard } from './update-card';
import { FloodUpdate, WaterLevelStatus } from '@/lib/types';

interface LiveUpdatesFeedProps {
  updates: FloodUpdate[];
  lastUpdated: Date;
}

type FilterType = 'all' | WaterLevelStatus;

export function LiveUpdatesFeed({ updates, lastUpdated }: LiveUpdatesFeedProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredUpdates =
    filter === 'all'
      ? updates
      : updates.filter((update) => update.waterLevel === filter);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const filterLabels: Record<FilterType, string> = {
    all: 'All Updates',
    normal: 'Normal',
    rising: 'Rising',
    danger: 'Danger',
    critical: 'Critical',
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Live Updates</h2>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Clock className="h-3.5 w-3.5" />
            Last updated: {formatLastUpdated(lastUpdated)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{filterLabels[filter]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(filterLabels) as FilterType[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setFilter(key)}
                  className={filter === key ? 'bg-muted' : ''}
                >
                  {filterLabels[key]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
          {updates.filter((u) => u.waterLevel === 'critical').length} Critical
        </Badge>
        <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
          {updates.filter((u) => u.waterLevel === 'danger').length} Danger
        </Badge>
        <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent">
          {updates.filter((u) => u.waterLevel === 'rising').length} Rising
        </Badge>
        <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
          {updates.filter((u) => u.waterLevel === 'normal').length} Normal
        </Badge>
      </div>

      {/* Updates List */}
      <div className="space-y-3">
        {filteredUpdates.length > 0 ? (
          filteredUpdates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">
              No updates matching the selected filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
