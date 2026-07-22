import { BookOpen } from "lucide-react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Minimal Header */}
      <header className="px-6 py-6 absolute top-0 left-0 w-full z-10 flex justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-background" />
          </div>
          <img src="/logo.png?v=2" alt="Avenpath Logo" className="h-10 md:h-16 w-auto" />
        </div>
      </header>
      
      <main className="flex-1 flex flex-col pt-24 pb-12">
        {children}
      </main>
    </div>
  );
}
