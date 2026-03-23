'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Filter, Clock, Search, X, Wifi, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

const REFRESH_INTERVAL = 30; // seconds

// Simulated new updates that cycle in on auto-refresh
const simulatedNewUpdates: Omit<FloodUpdate, 'id' | 'timestamp'>[] = [
  {
    time: '',
    location: 'Kaziranga Buffer Zone',
    district: 'Golaghat',
    waterLevel: 'rising',
    action: 'stay-alert',
    details: 'Water encroaching on wildlife buffer zone. Rangers on standby.',
  },
  {
    time: '',
    location: 'Lakhimpur Bazaar',
    district: 'Lakhimpur',
    waterLevel: 'danger',
    action: 'evacuate',
    details: 'Market area flooded. Emergency services deployed.',
  },
  {
    time: '',
    location: 'Dhemaji Rural',
    district: 'Dhemaji',
    waterLevel: 'critical',
    action: 'evacuate',
    details: 'Embankment breached near Sissi River. Immediate rescue ops underway.',
  },
];

let simulatedIndex = 0;

export function LiveUpdatesFeed({ updates: initialUpdates, lastUpdated: initialLastUpdated }: LiveUpdatesFeedProps) {
  const [updates, setUpdates] = useState<FloodUpdate[]>(initialUpdates);
  const [lastUpdated, setLastUpdated] = useState<Date>(initialLastUpdated);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [newUpdateLabel, setNewUpdateLabel] = useState<string | null>(null);

  const doRefresh = useCallback((isAuto = false) => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      if (isAuto) {
        // Inject a simulated new update
        const template = simulatedNewUpdates[simulatedIndex % simulatedNewUpdates.length];
        simulatedIndex++;
        const newUpdate: FloodUpdate = {
          ...template,
          id: `sim-${Date.now()}`,
          timestamp: now,
          time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        };
        setUpdates((prev) => [newUpdate, ...prev]);
        setNewUpdateLabel(`New: ${template.location}`);
        setTimeout(() => setNewUpdateLabel(null), 4000);
      }
      setLastUpdated(now);
      setIsRefreshing(false);
      setCountdown(REFRESH_INTERVAL);
    }, 800);
  }, []);

  // Countdown + auto-refresh
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          doRefresh(true);
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [doRefresh]);

  const filteredUpdates = updates
    .filter((u) => filter === 'all' || u.waterLevel === filter)
    .filter((u) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return u.location.toLowerCase().includes(q) || u.district.toLowerCase().includes(q);
    });

  const formatLastUpdated = (date: Date) =>
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

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
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Wifi className="h-3 w-3 text-chart-1" />
              Auto-refresh in {countdown}s
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => doRefresh(false)}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const headers = ['Time', 'Location', 'District', 'Water Level', 'Action', 'Details'];
              const rows = filteredUpdates.map((u) => [
                u.time,
                u.location,
                u.district,
                u.waterLevel,
                u.action,
                `"${(u.details || '').replace(/"/g, "'")}"`,
              ]);
              const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `flood-updates-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="gap-2"
            title="Download updates as CSV"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="update-search"
          placeholder="Search by location or district..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Stats Bar + New Update Pill */}
      <div className="flex flex-wrap items-center gap-2">
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
        {newUpdateLabel && (
          <Badge className="bg-primary text-primary-foreground animate-pulse ml-auto">
            🔔 {newUpdateLabel}
          </Badge>
        )}
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
              {searchQuery
                ? `No updates found for "${searchQuery}".`
                : 'No updates matching the selected filter.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
