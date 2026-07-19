import { BarChart3, Clock } from "lucide-react";

export default function AnalyticsManager() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Analytics</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">Understand how students use the platform.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-12 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-2xl bg-muted mb-6">
          <BarChart3 className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-extrabold mb-2">Analytics Coming Soon</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Once students start using the platform, this page will show real-time engagement data, learning progress, drop-off analysis, and search trends.
        </p>
        <div className="flex items-center gap-2 mt-6 text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-lg">
          <Clock className="w-4 h-4" /> Requires active user data
        </div>
      </div>

    </div>
  );
}
