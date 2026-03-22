'use client';

import { useState } from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { AlertNotification } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  alerts: AlertNotification[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const activeAlerts = alerts.filter(
    (alert) => alert.isActive && !dismissedAlerts.includes(alert.id)
  );

  if (activeAlerts.length === 0) return null;

  const primaryAlert = activeAlerts[0];
  const isEmergency = primaryAlert.type === 'emergency';

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isEmergency
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-accent text-accent-foreground'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                isEmergency ? 'bg-destructive-foreground/20' : 'bg-accent-foreground/10'
              )}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {primaryAlert.title}
              </p>
              <p className="text-xs opacity-90 truncate hidden sm:block">
                {primaryAlert.message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {activeAlerts.length > 1 && (
              <span className="text-xs font-medium opacity-80 hidden sm:inline">
                +{activeAlerts.length - 1} more
              </span>
            )}
            <button
              className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
              aria-label="View all alerts"
            >
              <span className="hidden sm:inline">View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDismissedAlerts([...dismissedAlerts, primaryAlert.id])}
              className="ml-2 p-1 hover:opacity-80 transition-opacity"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated pulse for emergency */}
      {isEmergency && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-pulse bg-destructive-foreground/5" />
        </div>
      )}
    </div>
  );
}
