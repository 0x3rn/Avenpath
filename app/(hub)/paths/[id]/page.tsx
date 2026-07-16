"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, Play, Award, Clock } from "lucide-react";

export default function PathRoadmap() {
  
  const journey = [
    { title: "Foundation", desc: "Basic arithmetic and order of operations.", time: "1h 30m", status: "completed" },
    { title: "Numbers", desc: "Fractions, decimals, and percentages.", time: "2h 15m", status: "completed" },
    { title: "Algebra", desc: "Variables, expressions, and linear equations.", time: "3h", status: "completed" },
    { title: "Functions", desc: "Understanding inputs, outputs, and mapping.", time: "2h", status: "completed" },
    { title: "Graphs", desc: "Plotting coordinates and lines on a plane.", time: "1h 45m", status: "active" },
    { title: "Trigonometry", desc: "Sines, cosines, and triangles.", time: "4h", status: "locked" },
    { title: "Limits", desc: "Approaching infinity and zero.", time: "2h 30m", status: "locked" },
    { title: "Calculus", desc: "Derivatives and Integrals basics.", time: "5h", status: "locked" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-32">
      
      {/* HEADER */}
      <div>
        <Link href="/paths" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Paths
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="bg-subject-math/10 text-subject-math text-xs font-bold px-3 py-1.5 rounded-lg mb-4 inline-block">University • Mathematics</span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Introduction to Calculus</h1>
            <p className="text-muted-foreground font-medium text-lg max-w-2xl">
              Master the language of continuous change. This path will take you from basic algebra all the way to fundamental theorems.
            </p>
          </div>
          <div className="shrink-0 bg-card border border-border p-4 rounded-2xl text-center">
            <div className="text-3xl font-extrabold text-foreground mb-1">83%</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed</div>
          </div>
        </div>
      </div>

      {/* VERTICAL ROADMAP */}
      <div className="relative pt-8">
        
        {/* The Vertical Connecting Line */}
        <div className="absolute left-[27px] sm:left-[39px] top-12 bottom-12 w-1.5 bg-muted rounded-full">
          {/* Active Progress Fill */}
          <div className="w-full bg-subject-math rounded-full" style={{ height: "55%" }} />
        </div>

        <div className="space-y-6 sm:space-y-8">
          {journey.map((step, i) => (
            <div key={i} className={`relative flex items-start gap-4 sm:gap-6 group transition-all duration-300 ${step.status === "locked" ? "opacity-50" : ""}`}>
              
              {/* Milestone Node */}
              <div className="relative z-10 shrink-0 mt-2 sm:mt-1">
                {step.status === "completed" ? (
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-subject-math text-white flex items-center justify-center shadow-lg shadow-subject-math/20">
                    <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                ) : step.status === "active" ? (
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-background border-4 border-subject-math flex items-center justify-center shadow-xl shadow-subject-math/20 ring-4 ring-subject-math/10">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-subject-math animate-pulse" />
                  </div>
                ) : (
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-muted border-4 border-background flex items-center justify-center">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content Card */}
              <div className={`flex-1 bg-card border rounded-3xl p-6 sm:p-8 transition-colors ${
                step.status === "active" ? "border-subject-math shadow-lg shadow-subject-math/5" : "border-border hover:border-foreground/30"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Step {i + 1}</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold mb-2">{step.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{step.desc}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg w-fit">
                    <Clock className="w-4 h-4" /> {step.time}
                  </div>
                </div>

                {step.status === "active" && (
                  <div className="mt-6 pt-6 border-t border-border flex justify-end">
                    <button className="w-full sm:w-auto bg-foreground text-background px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                      Continue Learning <Play className="w-4 h-4 fill-background" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* FINAL REWARD NODE */}
          <div className="relative flex items-start gap-4 sm:gap-6 opacity-50">
            <div className="relative z-10 shrink-0 mt-2 sm:mt-1">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-400 text-white flex items-center justify-center">
                <Award className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
            <div className="flex-1 bg-card border border-border rounded-3xl p-6 sm:p-8 flex items-center justify-center text-center">
              <div>
                <h3 className="text-xl font-extrabold mb-2">Final Assessment</h3>
                <p className="text-sm font-medium text-muted-foreground">Complete all steps to unlock your certificate.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
