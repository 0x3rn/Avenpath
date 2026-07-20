import { Search, ChevronRight } from "lucide-react";

export default function LoadingSubjectExplorer() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="sticky top-0 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-40 bg-background/90 backdrop-blur-md">
        <div className="w-24 h-8 bg-muted rounded-md animate-pulse"></div>
        <div className="flex items-center gap-4 text-sm">
          <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
          <ChevronRight className="w-4 h-4 text-muted" />
          <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-16">
        {/* HERO SKELETON */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="h-16 w-3/4 bg-muted rounded-2xl animate-pulse mb-6"></div>
          <div className="h-6 w-full bg-muted rounded-lg animate-pulse mb-2"></div>
          <div className="h-6 w-5/6 bg-muted rounded-lg animate-pulse mb-10"></div>
          
          {/* SEARCH BAR SKELETON */}
          <div className="w-full max-w-2xl h-16 bg-muted rounded-full animate-pulse mb-8"></div>

          {/* CATEGORY CHIPS SKELETON */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-24 h-10 bg-muted rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* CONTROLS SKELETON */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="w-32 h-5 bg-muted rounded animate-pulse"></div>
          <div className="w-24 h-5 bg-muted rounded animate-pulse"></div>
        </div>

        {/* SUBJECT GRID SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-card border border-border rounded-3xl p-6 h-[320px] flex flex-col relative overflow-hidden">
              <div className="w-14 h-14 bg-muted rounded-2xl animate-pulse mb-6"></div>
              <div className="h-6 w-2/3 bg-muted rounded animate-pulse mb-4"></div>
              <div className="space-y-2 mb-6 flex-grow">
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="pt-6 border-t border-border mt-auto flex justify-between">
                <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
