'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Home, Users, Phone, Search, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReliefCamp {
  id: string;
  name: string;
  district: string;
  address: string;
  capacity: number;
  occupancy: number;
  contact: string;
  facilities: string[];
  isActive: boolean;
}

const reliefCamps: ReliefCamp[] = [
  {
    id: 'rc-1',
    name: 'Govt. HS School Camp',
    district: 'Dibrugarh',
    address: 'NH-37, Dibrugarh Town',
    capacity: 500,
    occupancy: 487,
    contact: '03732-XXXXXX',
    facilities: ['Food', 'Medical', 'Drinking Water'],
    isActive: true,
  },
  {
    id: 'rc-2',
    name: 'Majuli Community Hall',
    district: 'Majuli',
    address: 'Garamur, Majuli Island',
    capacity: 350,
    occupancy: 312,
    contact: '03775-XXXXXX',
    facilities: ['Food', 'Shelter', 'Drinking Water'],
    isActive: true,
  },
  {
    id: 'rc-3',
    name: 'Jorhat College Ground Camp',
    district: 'Jorhat',
    address: 'AT Road, Jorhat',
    capacity: 800,
    occupancy: 645,
    contact: '0376-XXXXXXX',
    facilities: ['Food', 'Medical', 'Sanitation', 'Drinking Water'],
    isActive: true,
  },
  {
    id: 'rc-4',
    name: 'Nagaon District Relief Center',
    district: 'Nagaon',
    address: 'Nagaon Town, near DC Office',
    capacity: 600,
    occupancy: 421,
    contact: '03672-XXXXXX',
    facilities: ['Food', 'Medical', 'Shelter'],
    isActive: true,
  },
  {
    id: 'rc-5',
    name: 'Lakhimpur Primary School',
    district: 'Lakhimpur',
    address: 'North Lakhimpur Town',
    capacity: 300,
    occupancy: 289,
    contact: '03752-XXXXXX',
    facilities: ['Food', 'Drinking Water'],
    isActive: true,
  },
  {
    id: 'rc-6',
    name: 'Dhemaji Sports Complex',
    district: 'Dhemaji',
    address: 'Dhemaji Town Center',
    capacity: 400,
    occupancy: 367,
    contact: '03752-YYYYYY',
    facilities: ['Food', 'Medical', 'Sanitation'],
    isActive: true,
  },
  {
    id: 'rc-7',
    name: 'Morigaon Community Center',
    district: 'Morigaon',
    address: 'Morigaon Town, near Market',
    capacity: 250,
    occupancy: 198,
    contact: '03678-XXXXXX',
    facilities: ['Food', 'Shelter'],
    isActive: true,
  },
  {
    id: 'rc-8',
    name: 'Tinsukia Stadium Camp',
    district: 'Tinsukia',
    address: 'Tinsukia Main Road',
    capacity: 700,
    occupancy: 511,
    contact: '0374-XXXXXXX',
    facilities: ['Food', 'Medical', 'Sanitation', 'Drinking Water'],
    isActive: true,
  },
];

const DEFAULT_SHOW = 4;

function getOccupancyColor(pct: number) {
  if (pct >= 95) return 'bg-destructive';
  if (pct >= 80) return 'bg-chart-4';
  if (pct >= 60) return 'bg-accent';
  return 'bg-chart-1';
}

function getOccupancyBadge(pct: number) {
  if (pct >= 95) return 'bg-destructive/10 text-destructive border-destructive/20';
  if (pct >= 80) return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
  if (pct >= 60) return 'bg-accent/50 text-accent-foreground border-accent';
  return 'bg-chart-1/10 text-chart-1 border-chart-1/20';
}

function getOccupancyLabel(pct: number) {
  if (pct >= 95) return 'Near Full';
  if (pct >= 80) return 'High';
  if (pct >= 60) return 'Moderate';
  return 'Available';
}

export function ReliefCamps() {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filtered = reliefCamps.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase())
  );

  const displayed = showAll ? filtered : filtered.slice(0, DEFAULT_SHOW);
  const totalOccupancy = reliefCamps.reduce((s, c) => s + c.occupancy, 0);
  const totalCapacity = reliefCamps.reduce((s, c) => s + c.capacity, 0);
  const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(n);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Relief Camps</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {reliefCamps.filter((c) => c.isActive).length} active camps &mdash;&nbsp;
            <span className="font-medium text-foreground">{fmt(totalOccupancy)}</span>/{fmt(totalCapacity)} persons housed
          </p>
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="camp-search"
            placeholder="Search camps or districts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {displayed.length > 0 ? (
          displayed.map((camp) => {
            const pct = Math.round((camp.occupancy / camp.capacity) * 100);
            return (
              <Card key={camp.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="rounded-lg bg-primary/10 p-1.5 shrink-0">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-foreground leading-tight truncate">{camp.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{camp.address}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn('text-xs shrink-0', getOccupancyBadge(pct))}>
                      {getOccupancyLabel(pct)}
                    </Badge>
                  </div>

                  {/* Occupancy Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Occupancy
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {camp.occupancy}/{camp.capacity} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', getOccupancyColor(pct))}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1">
                    {camp.facilities.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs px-1.5 py-0">
                        {f}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {camp.contact}
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary px-2">
                      <Navigation className="h-3 w-3" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-2 rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground text-sm">No camps found for &ldquo;{search}&rdquo;.</p>
          </div>
        )}
      </div>

      {filtered.length > DEFAULT_SHOW && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {showAll ? (
            <><ChevronUp className="h-3.5 w-3.5" /> Show fewer camps</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /> Show all {filtered.length} camps</>
          )}
        </button>
      )}
    </section>
  );
}
