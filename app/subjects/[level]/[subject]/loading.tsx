import { ChevronRight } from "lucide-react";

export default function LoadingSubjectView() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="sticky top-0 flex items-center justify-between px-8 h-20 max-w-7xl mx-auto w-full z-40 bg-background/90 backdrop-blur-md">
        <div className="w-24 h-8 bg-muted rounded-md animate-pulse"></div>
        <div className="flex items-center gap-4 text-sm">
          <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
          <ChevronRight className="w-4 h-4 text-muted" />
          <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
          <ChevronRight className="w-4 h-4 text-muted" />
          <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
        </div>
      </nav>

      {/* HERO SECTION SKELETON */}
      <section className="border-b border-border w-full py-20 relative overflow-hidden bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="h-16 w-3/4 bg-muted rounded-2xl animate-pulse mb-6"></div>
            <div className="h-6 w-full bg-muted rounded-lg animate-pulse mb-2"></div>
            <div className="h-6 w-5/6 bg-muted rounded-lg animate-pulse mb-10"></div>
            
            {/* Statistics */}
            <div className="flex flex-wrap items-center gap-8 mb-12">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="w-12 h-8 bg-muted rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <div className="w-40 h-14 bg-muted rounded-full animate-pulse"></div>
              <div className="w-32 h-14 bg-muted rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS SKELETON */}
      <div className="border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 py-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-20 h-5 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Class/Term Switchers */}
        <div className="flex gap-3 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-24 h-10 bg-muted rounded-full animate-pulse"></div>
          ))}
        </div>

        {/* TOPICS GRID SKELETON */}
        <div className="w-48 h-8 bg-muted rounded-lg animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="border border-border rounded-3xl p-8 h-[280px] flex flex-col relative overflow-hidden">
              <div className="h-7 w-2/3 bg-muted rounded animate-pulse mb-4"></div>
              <div className="space-y-2 mb-8 flex-grow">
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
