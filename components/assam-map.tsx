'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Droplets, Clock, MapPin } from 'lucide-react';
import { District, WaterLevelStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AssamMapProps {
  districts: District[];
}

const statusColors: Record<WaterLevelStatus, string> = {
  normal: 'fill-chart-1 hover:fill-chart-1/80',
  rising: 'fill-accent hover:fill-accent/80',
  danger: 'fill-chart-4 hover:fill-chart-4/80',
  critical: 'fill-destructive hover:fill-destructive/80',
};

const statusLabels: Record<WaterLevelStatus, { label: string; className: string }> = {
  normal: { label: 'Safe', className: 'bg-chart-1/10 text-chart-1 border-chart-1/20' },
  rising: { label: 'Warning', className: 'bg-accent/50 text-accent-foreground border-accent' },
  danger: { label: 'Danger', className: 'bg-chart-4/10 text-chart-4 border-chart-4/20' },
  critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

// Simplified district positions for the map visualization
const districtPositions: Record<string, { x: number; y: number; width: number; height: number }> = {
  'kokrajhar': { x: 10, y: 15, width: 50, height: 35 },
  'dhubri': { x: 10, y: 55, width: 45, height: 40 },
  'goalpara': { x: 55, y: 55, width: 40, height: 35 },
  'bongaigaon': { x: 60, y: 20, width: 40, height: 35 },
  'chirang': { x: 65, y: 5, width: 35, height: 30 },
  'baksa': { x: 100, y: 5, width: 45, height: 30 },
  'nalbari': { x: 100, y: 35, width: 35, height: 30 },
  'barpeta': { x: 95, y: 55, width: 45, height: 35 },
  'kamrup': { x: 135, y: 30, width: 45, height: 40 },
  'kamrup-metro': { x: 145, y: 70, width: 35, height: 25 },
  'darrang': { x: 180, y: 15, width: 45, height: 35 },
  'udalguri': { x: 145, y: 5, width: 45, height: 25 },
  'sonitpur': { x: 225, y: 5, width: 55, height: 40 },
  'biswanath': { x: 270, y: 10, width: 45, height: 35 },
  'lakhimpur': { x: 310, y: 5, width: 50, height: 40 },
  'dhemaji': { x: 355, y: 5, width: 45, height: 35 },
  'morigaon': { x: 180, y: 50, width: 40, height: 35 },
  'nagaon': { x: 220, y: 45, width: 55, height: 40 },
  'hojai': { x: 275, y: 55, width: 35, height: 30 },
  'karbi-anglong': { x: 240, y: 85, width: 70, height: 55 },
  'west-karbi': { x: 180, y: 85, width: 55, height: 50 },
  'dima-hasao': { x: 310, y: 100, width: 60, height: 55 },
  'cachar': { x: 370, y: 100, width: 55, height: 45 },
  'hailakandi': { x: 370, y: 145, width: 30, height: 30 },
  'karimganj': { x: 400, y: 130, width: 40, height: 35 },
  'golaghat': { x: 310, y: 45, width: 45, height: 35 },
  'jorhat': { x: 350, y: 40, width: 45, height: 35 },
  'majuli': { x: 355, y: 15, width: 35, height: 25 },
  'sivasagar': { x: 390, y: 35, width: 45, height: 35 },
  'charaideo': { x: 430, y: 25, width: 35, height: 30 },
  'dibrugarh': { x: 425, y: 55, width: 45, height: 35 },
  'tinsukia': { x: 465, y: 35, width: 50, height: 45 },
  'south-salmara': { x: 10, y: 95, width: 40, height: 30 },
};

export function AssamMap({ districts }: AssamMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const getDistrictStatus = (districtId: string): WaterLevelStatus => {
    const district = districts.find((d) => d.id === districtId);
    return district?.status || 'normal';
  };

  const handleDistrictClick = (districtId: string) => {
    const district = districts.find((d) => d.id === districtId);
    if (district) {
      setSelectedDistrict(district);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <section id="map" className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-foreground">District Map</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(statusLabels) as [WaterLevelStatus, { label: string; className: string }][]).map(
            ([status, config]) => (
              <Badge key={status} variant="outline" className={cn('text-xs', config.className)}>
                <span
                  className={cn(
                    'mr-1.5 h-2 w-2 rounded-full',
                    status === 'normal' && 'bg-chart-1',
                    status === 'rising' && 'bg-accent',
                    status === 'danger' && 'bg-chart-4',
                    status === 'critical' && 'bg-destructive'
                  )}
                />
                {config.label}
              </Badge>
            )
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Map Container */}
            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 530 190"
                className="w-full min-w-[500px] h-auto"
                style={{ minHeight: '300px' }}
              >
                {/* Background */}
                <rect x="0" y="0" width="530" height="190" className="fill-muted/30" rx="4" />

                {/* Districts */}
                {Object.entries(districtPositions).map(([id, pos]) => {
                  const status = getDistrictStatus(id);
                  const district = districts.find((d) => d.id === id);
                  return (
                    <g key={id}>
                      <rect
                        x={pos.x}
                        y={pos.y}
                        width={pos.width}
                        height={pos.height}
                        rx="3"
                        className={cn(
                          'cursor-pointer stroke-card stroke-1 transition-all duration-200',
                          statusColors[status],
                          selectedDistrict?.id === id && 'stroke-foreground stroke-2'
                        )}
                        onClick={() => handleDistrictClick(id)}
                      />
                      <text
                        x={pos.x + pos.width / 2}
                        y={pos.y + pos.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none fill-white text-[6px] font-medium"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        {district?.name.split(' ')[0] || id}
                      </text>
                    </g>
                  );
                })}

                {/* Brahmaputra River indication */}
                <path
                  d="M 0 95 Q 100 80 200 85 T 350 75 T 530 65"
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.4)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <text
                  x="265"
                  y="95"
                  textAnchor="middle"
                  className="fill-primary/60 text-[8px] font-medium italic"
                >
                  Brahmaputra River
                </text>
              </svg>
            </div>

            {/* Selected District Info Panel */}
            {selectedDistrict && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72">
                <Card className="shadow-lg">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-semibold">
                          {selectedDistrict.name}
                        </CardTitle>
                      </div>
                      <button
                        onClick={() => setSelectedDistrict(null)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', statusLabels[selectedDistrict.status].className)}
                        >
                          {statusLabels[selectedDistrict.status].label}
                        </Badge>
                      </div>
                      {selectedDistrict.waterLevel && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Droplets className="h-3 w-3" />
                            Water Level
                          </span>
                          <span className="text-sm font-medium">
                            {selectedDistrict.waterLevel.toFixed(1)}m
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last Updated
                        </span>
                        <span className="text-xs">
                          {formatDate(selectedDistrict.lastUpdated)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Click on any district to view detailed status. Data updated every 15 minutes.
      </p>
    </section>
  );
}
