import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      
      {/* Left Side - Branding & Illustration (Hidden on mobile) */}
      <div className="hidden md:flex flex-col w-1/2 bg-muted p-12 lg:p-16 relative overflow-hidden">
        
        {/* Background Decorative Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-subject-math/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-subject-science/20 rounded-full blur-[100px]" />

        <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
             <BookOpen className="w-5 h-5 text-background" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">Avenpath.</span>
        </Link>

        <div className="relative z-10 mt-auto mb-auto max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Build better study habits. Learn anything.
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-12">
            Join thousands of students using structured lessons, quizzes, and personalized learning paths to reach their goals.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-2xl font-extrabold text-foreground mb-1">150+</div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Subjects</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground mb-1">18,000+</div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground mb-1">2.8M+</div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Study Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground mb-1">97%</div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex-1 flex flex-col p-6 sm:p-12 md:p-16 relative">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight">Avenpath.</span>
          </Link>
        </div>

        {/* Dynamic Auth Content */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto">
          {children}
        </div>
        
      </div>

    </div>
  );
}
