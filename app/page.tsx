import { Header } from '@/components/header';
import { AlertBanner } from '@/components/alert-banner';
import { StatsSection } from '@/components/stats-section';
import { LiveUpdatesFeed } from '@/components/live-updates-feed';
import { AssamMap } from '@/components/assam-map';
import { MultiChannel } from '@/components/multi-channel';
import { Footer } from '@/components/footer';
import { mockUpdates, districts, activeAlerts, stats } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Alert Banner */}
      <AlertBanner alerts={activeAlerts} />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <section className="text-center py-4">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl text-balance">
                Assam Flood Information System
              </h1>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto text-pretty">
                Your trusted source for real-time flood updates across all districts of Assam.
                Stay informed, stay safe.
              </p>
            </section>

            {/* Stats Section */}
            <StatsSection stats={stats} />

            {/* Two Column Layout for Desktop */}
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Live Updates Feed - Takes more space */}
              <div className="lg:col-span-3">
                <LiveUpdatesFeed 
                  updates={mockUpdates} 
                  lastUpdated={stats.lastUpdated} 
                />
              </div>

              {/* Map Section - Sidebar */}
              <div className="lg:col-span-2">
                <AssamMap districts={districts} />
              </div>
            </div>

            {/* Multi-Channel Section */}
            <MultiChannel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
