import { Users, Home, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsSectionProps {
  stats: {
    affectedDistricts: number;
    peopleEvacuated: number;
    reliefCamps: number;
    lastUpdated: Date;
  };
}

export function StatsSection({ stats }: StatsSectionProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statItems = [
    {
      label: 'Affected Districts',
      value: stats.affectedDistricts.toString(),
      icon: MapPin,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'People Evacuated',
      value: formatNumber(stats.peopleEvacuated),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Relief Camps Active',
      value: stats.reliefCamps.toString(),
      icon: Home,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      label: 'Last Updated',
      value: formatDate(stats.lastUpdated),
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      isTime: true,
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Current Situation</h2>
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {stat.label}
                  </p>
                  <p
                    className={`font-bold ${
                      stat.isTime ? 'text-xs leading-tight break-words' : 'text-xl'
                    } text-foreground`}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
