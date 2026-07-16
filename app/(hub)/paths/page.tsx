"use client";

import Link from "next/link";
import { Map, ArrowRight, GraduationCap, Briefcase, BookOpen, Clock } from "lucide-react";

export default function LearningPathsDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
          <Map className="w-8 h-8 text-muted-foreground" /> Learning Paths
        </h1>
        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
          Follow guided journeys designed to help you master a subject from the fundamentals to advanced concepts.
        </p>
      </div>

      {/* CATEGORIES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "High School", icon: BookOpen },
          { name: "University", icon: GraduationCap },
          { name: "Career", icon: Briefcase },
          { name: "Exam Prep", icon: Map },
        ].map((cat, i) => (
          <button key={i} className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold transition-colors border ${i === 1 ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
            <cat.icon className="w-6 h-6" /> {cat.name}
          </button>
        ))}
      </div>

      {/* PATH CARDS */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">University Paths</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Active Path */}
          <Link href="/paths/calculus" className="bg-card border border-foreground/30 rounded-3xl p-8 group hover:border-foreground transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-16 h-16 rounded-2xl bg-subject-math/10 flex items-center justify-center">
                <Map className="w-8 h-8 text-subject-math" />
              </div>
            </div>
            
            <span className="bg-subject-math/10 text-subject-math text-xs font-bold px-3 py-1.5 rounded-lg mb-6 inline-block">
              In Progress
            </span>
            
            <h3 className="text-2xl font-extrabold mb-4 pr-20">Introduction to Calculus</h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg"><BookOpen className="w-4 h-4" /> 42 Lessons</span>
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4" /> 18 Hours</span>
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg">Beginner</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold">
                <span>83% Complete</span>
                <span className="text-foreground flex items-center gap-1 group-hover:translate-x-1 transition-transform">Continue <ArrowRight className="w-4 h-4" /></span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-subject-math rounded-full" style={{ width: "83%" }} />
              </div>
            </div>
          </Link>

          {/* Locked / Available Path */}
          <Link href="#" className="bg-card border border-border rounded-3xl p-8 group hover:border-foreground/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-16 h-16 rounded-2xl bg-subject-science/10 flex items-center justify-center">
                <Map className="w-8 h-8 text-subject-science opacity-50" />
              </div>
            </div>
            
            <span className="bg-muted text-muted-foreground text-xs font-bold px-3 py-1.5 rounded-lg mb-6 inline-block">
              Not Started
            </span>
            
            <h3 className="text-2xl font-extrabold mb-4 pr-20">Cellular Biology</h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg"><BookOpen className="w-4 h-4" /> 36 Lessons</span>
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4" /> 14 Hours</span>
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg">Intermediate</span>
            </div>

            <div className="flex items-center text-sm font-bold text-foreground group-hover:translate-x-1 transition-transform">
              Start Path <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}
