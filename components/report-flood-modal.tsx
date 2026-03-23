'use client';

import { useState } from 'react';
import { AlertTriangle, SendHorizonal, X, CheckCircle2, Camera, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type ReportSeverity = 'low' | 'moderate' | 'high' | 'critical';

interface ReportForm {
  name: string;
  phone: string;
  location: string;
  district: string;
  severity: ReportSeverity;
  description: string;
}

const severityConfig: Record<ReportSeverity, { label: string; color: string }> = {
  low: { label: 'Low – Minor flooding', color: 'bg-chart-1/10 text-chart-1' },
  moderate: { label: 'Moderate – Roads affected', color: 'bg-accent/50 text-accent-foreground' },
  high: { label: 'High – Homes flooded', color: 'bg-chart-4/10 text-chart-4' },
  critical: { label: 'Critical – Lives at risk', color: 'bg-destructive/10 text-destructive' },
};

const assamDistricts = [
  'Baksa','Barpeta','Biswanath','Bongaigaon','Cachar','Charaideo','Chirang',
  'Darrang','Dhemaji','Dhubri','Dibrugarh','Dima Hasao','Goalpara','Golaghat',
  'Hailakandi','Hojai','Jorhat','Kamrup','Kamrup Metropolitan','Karbi Anglong',
  'Karimganj','Kokrajhar','Lakhimpur','Majuli','Morigaon','Nagaon','Nalbari',
  'Sivasagar','Sonitpur','South Salmara-Mankachar','Tinsukia','Udalguri',
  'West Karbi Anglong',
];

export function ReportFloodModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ReportForm>({
    name: '',
    phone: '',
    location: '',
    district: '',
    severity: 'moderate',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', phone: '', location: '', district: '', severity: 'moderate', description: '' });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        <Button
          id="report-flood-btn"
          variant="destructive"
          className="gap-2 font-semibold shadow-lg hover:shadow-destructive/30 transition-all"
        >
          <AlertTriangle className="h-4 w-4" />
          Report a Flood
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-lg">Report a Flood Situation</DialogTitle>
                  <DialogDescription className="text-xs">
                    Your report helps authorities respond faster. All reports are reviewed immediately.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {/* Contact Info */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reporter-name">Your Name</Label>
                  <Input
                    id="reporter-name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reporter-phone" className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Contact Number
                  </Label>
                  <Input
                    id="reporter-phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="flood-location" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Specific Location
                  </Label>
                  <Input
                    id="flood-location"
                    placeholder="e.g., Near NH-37 bridge"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="flood-district">District</Label>
                  <Select
                    value={form.district}
                    onValueChange={(v) => setForm({ ...form, district: v })}
                    required
                  >
                    <SelectTrigger id="flood-district">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent className="max-h-52">
                      {assamDistricts.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Severity */}
              <div className="space-y-1.5">
                <Label htmlFor="flood-severity">Severity Level</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(severityConfig) as [ReportSeverity, { label: string; color: string }][]).map(
                    ([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm({ ...form, severity: key })}
                        className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all ${
                          form.severity === key
                            ? 'border-foreground ring-1 ring-foreground'
                            : 'border-border hover:border-muted-foreground'
                        } ${cfg.color}`}
                      >
                        {cfg.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="flood-description">Describe the Situation</Label>
                <Textarea
                  id="flood-description"
                  placeholder="Describe what you see — water depth, people affected, access routes blocked..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              {/* Photo hint */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2">
                <Camera className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Photo upload coming soon. For now, describe the situation in detail.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <SendHorizonal className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chart-1/10">
              <CheckCircle2 className="h-8 w-8 text-chart-1" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Report Submitted!</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                Thank you, <strong>{form.name}</strong>. Authorities have been notified and will respond shortly.
              </p>
            </div>
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
              Reference: RPT-{Date.now().toString().slice(-6)}
            </Badge>
            <Button onClick={handleClose} className="mt-2">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
