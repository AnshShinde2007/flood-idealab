'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayData {
  day: string;
  date: string;
  level: number;
}

interface DistrictHistory {
  districtId: string;
  districtName: string;
  dangerLevel: number;
  data: DayData[];
}

const districtHistories: DistrictHistory[] = [
  {
    districtId: 'dibrugarh',
    districtName: 'Dibrugarh',
    dangerLevel: 25,
    data: [
      { day: 'Mon', date: 'Mar 16', level: 18.2 },
      { day: 'Tue', date: 'Mar 17', level: 19.8 },
      { day: 'Wed', date: 'Mar 18', level: 21.4 },
      { day: 'Thu', date: 'Mar 19', level: 24.1 },
      { day: 'Fri', date: 'Mar 20', level: 25.9 },
      { day: 'Sat', date: 'Mar 21', level: 27.2 },
      { day: 'Today', date: 'Mar 22', level: 28.4 },
    ],
  },
  {
    districtId: 'majuli',
    districtName: 'Majuli',
    dangerLevel: 24,
    data: [
      { day: 'Mon', date: 'Mar 16', level: 20.1 },
      { day: 'Tue', date: 'Mar 17', level: 21.5 },
      { day: 'Wed', date: 'Mar 18', level: 22.8 },
      { day: 'Thu', date: 'Mar 19', level: 24.2 },
      { day: 'Fri', date: 'Mar 20', level: 25.3 },
      { day: 'Sat', date: 'Mar 21', level: 25.9 },
      { day: 'Today', date: 'Mar 22', level: 26.8 },
    ],
  },
  {
    districtId: 'jorhat',
    districtName: 'Jorhat',
    dangerLevel: 22,
    data: [
      { day: 'Mon', date: 'Mar 16', level: 19.3 },
      { day: 'Tue', date: 'Mar 17', level: 20.8 },
      { day: 'Wed', date: 'Mar 18', level: 22.1 },
      { day: 'Thu', date: 'Mar 19', level: 23.4 },
      { day: 'Fri', date: 'Mar 20', level: 24.1 },
      { day: 'Sat', date: 'Mar 21', level: 24.5 },
      { day: 'Today', date: 'Mar 22', level: 24.6 },
    ],
  },
  {
    districtId: 'nagaon',
    districtName: 'Nagaon',
    dangerLevel: 21,
    data: [
      { day: 'Mon', date: 'Mar 16', level: 17.8 },
      { day: 'Tue', date: 'Mar 17', level: 18.9 },
      { day: 'Wed', date: 'Mar 18', level: 20.2 },
      { day: 'Thu', date: 'Mar 19', level: 21.6 },
      { day: 'Fri', date: 'Mar 20', level: 22.8 },
      { day: 'Sat', date: 'Mar 21', level: 23.5 },
      { day: 'Today', date: 'Mar 22', level: 24.1 },
    ],
  },
  {
    districtId: 'barpeta',
    districtName: 'Barpeta',
    dangerLevel: 20,
    data: [
      { day: 'Mon', date: 'Mar 16', level: 14.5 },
      { day: 'Tue', date: 'Mar 17', level: 15.2 },
      { day: 'Wed', date: 'Mar 18', level: 16.1 },
      { day: 'Thu', date: 'Mar 19', level: 16.8 },
      { day: 'Fri', date: 'Mar 20', level: 17.5 },
      { day: 'Sat', date: 'Mar 21', level: 17.9 },
      { day: 'Today', date: 'Mar 22', level: 18.2 },
    ],
  },
];

function getLevelColor(level: number, dangerLevel: number) {
  const ratio = level / dangerLevel;
  if (ratio >= 1.1) return 'bg-destructive';
  if (ratio >= 1.0) return 'bg-chart-4';
  if (ratio >= 0.8) return 'bg-accent';
  return 'bg-chart-1';
}

function getBarTextColor(level: number, dangerLevel: number) {
  const ratio = level / dangerLevel;
  if (ratio >= 1.1) return 'text-destructive';
  if (ratio >= 1.0) return 'text-chart-4';
  if (ratio >= 0.8) return 'text-accent-foreground';
  return 'text-chart-1';
}

export function WaterLevelChart() {
  const [selectedId, setSelectedId] = useState('dibrugarh');
  const history = districtHistories.find((d) => d.districtId === selectedId)!;

  const maxLevel = Math.max(...history.data.map((d) => d.level), history.dangerLevel + 2);
  const currentLevel = history.data[history.data.length - 1].level;
  const prevLevel = history.data[history.data.length - 2].level;
  const trend = currentLevel - prevLevel;
  const isAboveDanger = currentLevel >= history.dangerLevel;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Water Level Trends
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">7-day water level history (metres)</p>
        </div>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger id="district-trend-select" className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {districtHistories.map((d) => (
              <SelectItem key={d.districtId} value={d.districtId}>
                {d.districtName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Current Level</p>
                <p className="text-2xl font-bold text-foreground">{currentLevel.toFixed(1)}m</p>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  trend > 0
                    ? 'bg-destructive/10 text-destructive'
                    : trend < 0
                    ? 'bg-chart-1/10 text-chart-1'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {trend > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : trend < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}m from yesterday
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={isAboveDanger
                  ? 'bg-destructive/10 text-destructive border-destructive/20'
                  : 'bg-chart-1/10 text-chart-1 border-chart-1/20'}
              >
                Danger: {history.dangerLevel}m
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          {/* Bar Chart */}
          <div className="mt-2 flex items-end gap-1.5 h-36 relative">
            {/* Danger line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-destructive/50 pointer-events-none"
              style={{ bottom: `${(history.dangerLevel / maxLevel) * 100}%` }}
            >
              <span className="absolute right-0 -top-4 text-[9px] font-medium text-destructive/70 bg-card px-1">
                Danger {history.dangerLevel}m
              </span>
            </div>

            {history.data.map((d, i) => {
              const heightPct = (d.level / maxLevel) * 100;
              const isToday = i === history.data.length - 1;
              return (
                <div key={d.day} className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">
                  <div className="relative w-full flex flex-col items-center justify-end h-full">
                    {/* Value tooltip on hover */}
                    <span className="absolute -top-5 text-[9px] font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {d.level}m
                    </span>
                    <div
                      className={cn(
                        'w-full rounded-t-sm transition-all duration-500',
                        isToday ? 'rounded-t-md' : '',
                        getLevelColor(d.level, history.dangerLevel),
                        isToday ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className={cn('text-[9px] font-semibold leading-none', isToday ? 'text-foreground' : 'text-muted-foreground')}>
                      {d.day}
                    </p>
                    <p className="text-[8px] text-muted-foreground/70 leading-tight hidden sm:block">{d.date.split(' ')[1]}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-3">
            <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-chart-1 inline-block" /> Below 80% danger</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-accent inline-block" /> 80–99% danger</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-chart-4 inline-block" /> At danger level</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-destructive inline-block" /> Above danger</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
