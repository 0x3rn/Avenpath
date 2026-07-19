import { ChevronRight } from "lucide-react";

export default function LoadingTopicView() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 flex items-center justify-between px-8 py-6 max-w-4xl mx-auto w-full z-40 bg-background/90 backdrop-blur-md">
        <div className="w-24 h-8 bg-muted rounded-md animate-pulse"></div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
          <ChevronRight className="w-4 h-4 text-muted" />
          <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
          <ChevronRight className="w-4 h-4 text-muted" />
          <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12">
        {/* Header Skeleton */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-muted rounded-2xl animate-pulse"></div>
            <div className="w-32 h-6 bg-muted rounded-full animate-pulse"></div>
          </div>
          <div className="h-14 w-3/4 bg-muted rounded-2xl animate-pulse mb-6"></div>
          <div className="h-6 w-full bg-muted rounded-lg animate-pulse mb-2"></div>
          <div className="h-6 w-5/6 bg-muted rounded-lg animate-pulse mb-8"></div>
          
          <div className="flex gap-4">
            <div className="w-24 h-8 bg-muted rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        {/* Lessons List Skeleton */}
        <div className="space-y-4">
          <div className="w-32 h-8 bg-muted rounded-lg animate-pulse mb-6"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center p-5 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-muted rounded-full animate-pulse mr-5"></div>
              <div className="flex-grow">
                <div className="w-1/2 h-5 bg-muted rounded animate-pulse mb-2"></div>
                <div className="w-1/4 h-3 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
