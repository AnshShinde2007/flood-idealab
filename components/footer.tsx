import { Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">Assam Flood Info</p>
                <p className="text-xs text-muted-foreground">
                  Official Government Portal
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Centralized flood information system providing real-time updates
              for the Brahmaputra River basin and all districts of Assam.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Live Updates', href: '/' },
                { label: 'District Map', href: '#map' },
                { label: 'Alert Subscription', href: '#alerts' },
                { label: 'Admin Portal', href: '/admin' },
                { label: 'Emergency Contacts', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Official Resources</h3>
            <ul className="space-y-2">
              {[
                { label: 'ASDMA Official', href: '#' },
                { label: 'IMD Weather', href: '#' },
                { label: 'CWC Water Data', href: '#' },
                { label: 'NDRF Portal', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-chart-1" />
              <span className="text-xs font-medium text-chart-1">
                Verified by Assam State Disaster Management Authority
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Government of Assam. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
