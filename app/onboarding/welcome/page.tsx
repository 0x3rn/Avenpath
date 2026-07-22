"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, Clock, Activity, CheckCircle2, FileText, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Read simulated saved data
    const saved = localStorage.getItem("onboardingData");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse onboarding data");
      }
    } else {
      // Fallback
      setData({
        subjects: ["Computer Science", "Mathematics", "Physics", "Statistics"],
        weeklyHours: 5
      });
    }
  }, []);

  if (!data) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-foreground text-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-foreground/20">
          <GraduationCap className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Welcome to Avenpath!
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
          Based on your interests, we've prepared a personalized learning journey to help you stay consistent and make steady progress.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column - Meta */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Your Study Goal</h3>
            <div className="flex items-center gap-3 text-foreground font-extrabold text-2xl">
              <Clock className="w-6 h-6 text-subject-science" />
              {data.weeklyHours} Hours / Week
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Your Subjects</h3>
            <div className="space-y-3">
              {(data.subjects || []).slice(0, 4).map((sub: string) => (
                <div key={sub} className="flex items-center gap-3 font-bold text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> {sub}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="md:col-span-2 space-y-6">
          
          <h3 className="text-xl font-extrabold flex items-center gap-2">
            Your First Lesson
          </h3>

          {/* Start Here Card */}
          <div className="bg-foreground text-background rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="inline-block px-3 py-1 bg-background/20 text-background text-xs font-bold uppercase tracking-wider rounded-full mb-6">
              Start Here
            </div>
            
            <h2 className="text-3xl font-extrabold mb-4 relative z-10">
              Introduction to Algebra
            </h2>
            
            <div className="flex items-center gap-4 text-background/80 font-medium mb-10 relative z-10 text-sm">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 20 Minutes</span>
              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Beginner</span>
            </div>

            <button 
              onClick={() => router.push("/subjects")}
              className="bg-background text-foreground px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-xl"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Recs */}
          <h3 className="text-xl font-extrabold pt-4 flex items-center gap-2">
            Up Next
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Learn Python Basics", 
              "Functions & Graphs", 
              "Vectors Explained", 
              "Study Tips for Beginners"
            ].map(rec => (
              <div key={rec} className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-foreground/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-bold text-sm">{rec}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="mt-16 flex justify-center border-t border-border pt-8">
        <Link 
          href="/dashboard"
          className="text-muted-foreground font-bold hover:text-foreground transition-colors px-6 py-2"
        >
          Go to Dashboard
        </Link>
      </div>

    </div>
  );
}
