import { ChevronRight } from "lucide-react";

export default function LoadingLessonView() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 flex items-center justify-between px-8 py-4 w-full z-50 bg-background border-b border-border">
        <div className="w-24 h-8 bg-muted rounded-md animate-pulse"></div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-12 h-4 bg-muted rounded animate-pulse hidden md:block"></div>
          <ChevronRight className="w-4 h-4 text-muted hidden md:block" />
          <div className="w-16 h-4 bg-muted rounded animate-pulse hidden md:block"></div>
          <ChevronRight className="w-4 h-4 text-muted hidden md:block" />
          <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="w-8 h-8 bg-muted rounded animate-pulse md:hidden"></div>
      </nav>

      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        {/* Sidebar Skeleton (Hidden on Mobile) */}
        <aside className="hidden md:flex w-80 flex-col border-r border-border bg-card/30 sticky top-[73px]" style={{ height: "calc(100vh - 73px)" }}>
          <div className="p-6 border-b border-border">
            <div className="w-2/3 h-5 bg-muted rounded animate-pulse mb-3"></div>
            <div className="w-full h-2 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex-1 p-4 space-y-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-full h-12 bg-muted rounded-xl animate-pulse"></div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 w-full  p-6 md:p-12 pb-32">
          {/* Header */}
          <div className="mb-12">
            <div className="w-24 h-8 bg-muted rounded-full animate-pulse mb-6"></div>
            <div className="w-full h-12 bg-muted rounded-xl animate-pulse mb-6"></div>
            <div className="w-3/4 h-12 bg-muted rounded-xl animate-pulse mb-8"></div>
            <div className="flex gap-4 border-b border-border pb-8">
              <div className="w-24 h-5 bg-muted rounded animate-pulse"></div>
              <div className="w-24 h-5 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-6">
            <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-5/6 h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-4/6 h-4 bg-muted rounded animate-pulse mb-8"></div>
            
            <div className="w-full h-48 bg-muted rounded-2xl animate-pulse my-8"></div>
            
            <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-muted rounded animate-pulse"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
