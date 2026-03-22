'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight text-foreground sm:text-base">
                Assam Flood Info
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Official Government Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Live Updates
            </Link>
            <Link 
              href="#map" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              District Map
            </Link>
            <Link 
              href="#alerts" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Bell className="h-4 w-4" />
              Alerts
              <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">2</Badge>
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Trust Badge */}
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-chart-1/10 px-3 py-1.5">
            <Shield className="h-4 w-4 text-chart-1" />
            <span className="text-xs font-medium text-chart-1">Verified by ASDMA</span>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin className="h-4 w-4" />
                Live Updates
              </Link>
              <Link 
                href="#map" 
                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin className="h-4 w-4" />
                District Map
              </Link>
              <Link 
                href="#alerts" 
                className="flex items-center justify-between px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Alerts
                </span>
                <Badge variant="destructive" className="h-5 px-1.5 text-xs">2</Badge>
              </Link>
              <Link 
                href="/admin" 
                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin Portal
              </Link>
              <div className="mt-2 flex items-center gap-2 rounded-md bg-chart-1/10 px-3 py-2">
                <Shield className="h-4 w-4 text-chart-1" />
                <span className="text-xs font-medium text-chart-1">Verified by ASDMA</span>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
