'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Droplets,
  AlertTriangle,
  Home,
  Users,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FloodUpdate, WaterLevelStatus, ActionRequired } from '@/lib/types';
import { mockUpdates, stats, districts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [updates, setUpdates] = useState<FloodUpdate[]>(mockUpdates);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<FloodUpdate | null>(null);

  const handleDeleteUpdate = (id: string) => {
    setUpdates(updates.filter((u) => u.id !== id));
  };

  const handleCreateUpdate = (newUpdate: Omit<FloodUpdate, 'id' | 'timestamp'>) => {
    const update: FloodUpdate = {
      ...newUpdate,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setUpdates([update, ...updates]);
    setIsCreateDialogOpen(false);
  };

  const handleEditUpdate = (updatedData: Omit<FloodUpdate, 'id' | 'timestamp'>) => {
    if (!editingUpdate) return;
    setUpdates(
      updates.map((u) =>
        u.id === editingUpdate.id
          ? { ...u, ...updatedData, timestamp: new Date() }
          : u
      )
    );
    setEditingUpdate(null);
  };

  const statusColors: Record<WaterLevelStatus, string> = {
    normal: 'bg-chart-1/10 text-chart-1',
    rising: 'bg-accent/50 text-accent-foreground',
    danger: 'bg-chart-4/10 text-chart-4',
    critical: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Flood Information System</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">View Site</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <MapPin className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Affected Districts</p>
                    <p className="text-2xl font-bold text-foreground">{stats.affectedDistricts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">People Evacuated</p>
                    <p className="text-2xl font-bold text-foreground">{(stats.peopleEvacuated / 1000).toFixed(1)}K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-chart-1/10 p-2">
                    <Home className="h-5 w-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Relief Camps</p>
                    <p className="text-2xl font-bold text-foreground">{stats.reliefCamps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/50 p-2">
                    <Bell className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold text-foreground">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Updates Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Flood Updates</CardTitle>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Update
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Update</DialogTitle>
                    <DialogDescription>
                      Post a new flood update that will be visible to all users.
                    </DialogDescription>
                  </DialogHeader>
                  <UpdateForm
                    onSubmit={handleCreateUpdate}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    districts={districts}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground truncate">
                          {update.location}
                        </h4>
                        <Badge
                          variant="outline"
                          className={cn('text-xs shrink-0', statusColors[update.waterLevel])}
                        >
                          {update.waterLevel}
                        </Badge>
                      </div>
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
                      {update.details && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {update.details}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Dialog
                        open={editingUpdate?.id === update.id}
                        onOpenChange={(open) => !open && setEditingUpdate(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingUpdate(update)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Update</DialogTitle>
                            <DialogDescription>
                              Modify the flood update details.
                            </DialogDescription>
                          </DialogHeader>
                          <UpdateForm
                            initialData={update}
                            onSubmit={handleEditUpdate}
                            onCancel={() => setEditingUpdate(null)}
                            districts={districts}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteUpdate(update.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Send Emergency Alert</h3>
                <p className="text-xs text-muted-foreground">
                  Broadcast urgent notification to all subscribers
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Update District Status</h3>
                <p className="text-xs text-muted-foreground">
                  Change water level status for districts
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">System Settings</h3>
                <p className="text-xs text-muted-foreground">
                  Configure alerts and notification settings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Update Form Component
interface UpdateFormProps {
  initialData?: FloodUpdate;
  onSubmit: (data: Omit<FloodUpdate, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
  districts: { id: string; name: string }[];
}

function UpdateForm({ initialData, onSubmit, onCancel, districts }: UpdateFormProps) {
  const [formData, setFormData] = useState({
    location: initialData?.location || '',
    district: initialData?.district || '',
    time: initialData?.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    waterLevel: initialData?.waterLevel || 'normal' as WaterLevelStatus,
    action: initialData?.action || 'safe' as ActionRequired,
    details: initialData?.details || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Dibrugarh Town"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Select
            value={formData.district}
            onValueChange={(value) => setFormData({ ...formData, district: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.id} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="waterLevel">Water Level Status</Label>
          <Select
            value={formData.waterLevel}
            onValueChange={(value) => setFormData({ ...formData, waterLevel: value as WaterLevelStatus })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="rising">Rising</SelectItem>
              <SelectItem value="danger">Danger</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="action">Action Required</Label>
          <Select
            value={formData.action}
            onValueChange={(value) => setFormData({ ...formData, action: value as ActionRequired })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="safe">Safe</SelectItem>
              <SelectItem value="stay-alert">Stay Alert</SelectItem>
              <SelectItem value="evacuate">Evacuate Now</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Details</Label>
        <Textarea
          id="details"
          placeholder="Additional information about the situation..."
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Save Changes' : 'Create Update'}
        </Button>
      </div>
    </form>
  );
}
