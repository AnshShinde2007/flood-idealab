import { MessageSquare, Smartphone, Send, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function MultiChannel() {
  const channels = [
    {
      name: 'SMS Alerts',
      description: 'Receive critical updates via SMS',
      icon: Smartphone,
      action: 'Subscribe',
      subscribers: '2.3L',
      color: 'bg-chart-1',
    },
    {
      name: 'WhatsApp',
      description: 'Join our official WhatsApp channel',
      icon: MessageSquare,
      action: 'Join Channel',
      subscribers: '1.8L',
      color: 'bg-chart-1',
    },
    {
      name: 'Telegram',
      description: 'Get instant updates on Telegram',
      icon: Send,
      action: 'Join Group',
      subscribers: '95K',
      color: 'bg-primary',
    },
    {
      name: 'Push Notifications',
      description: 'Enable browser notifications',
      icon: Bell,
      action: 'Enable',
      subscribers: '45K',
      color: 'bg-accent',
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Stay Informed</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Subscribe to receive flood alerts on your preferred channel
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((channel) => (
          <Card key={channel.name} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2 ${channel.color}`}>
                  <channel.icon className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {channel.subscribers} subscribers
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <CardTitle className="text-base mb-1">{channel.name}</CardTitle>
              <p className="text-xs text-muted-foreground mb-3">
                {channel.description}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                {channel.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-foreground">Emergency Helpline</p>
              <p className="text-sm text-muted-foreground">
                For immediate assistance, call our 24/7 helpline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" className="font-mono text-lg font-bold">
                1800-XXX-XXXX
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
