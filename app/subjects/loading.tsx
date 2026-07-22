import { ArrowRight } from "lucide-react";

export default function LoadingSubjectsDirectory() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="sticky top-0 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-40 bg-background border-b border-border">
        <div className="w-24 h-8 bg-muted rounded-md animate-pulse"></div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center pt-12 pb-24 px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center w-full">
          <div className="h-14 w-3/4 bg-muted rounded-xl animate-pulse mb-6"></div>
          <div className="h-6 w-full bg-muted rounded-md animate-pulse mb-2"></div>
          <div className="h-6 w-5/6 bg-muted rounded-md animate-pulse"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-10 h-full flex flex-col relative overflow-hidden">
              <div className="w-12 h-12 bg-muted rounded-xl animate-pulse mb-6"></div>
              <div className="h-8 w-1/2 bg-muted rounded-lg animate-pulse mb-4"></div>
              <div className="space-y-3 flex-grow">
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="mt-10 flex items-center gap-2 font-bold text-muted-foreground/50">
                Explore <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
