"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, ArrowRight, Target, Clock, Star, Trophy, CheckCircle2, History, Layers } from "lucide-react";
import { getQuizStats, getRecentQuizResults, getAvailableQuizzes, seedSampleQuizzes } from "@/app/actions/quizzes";
import { formatDistanceToNow } from "date-fns";

export default function QuizzesDashboard() {
  const [stats, setStats] = useState<any>({ completed: 0, avgScore: 0, totalQuestions: 0, currentStreak: 0 });
  const [results, setResults] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);

  useEffect(() => {
    getQuizStats().then(s => { if (s) setStats(s); });
    getRecentQuizResults().then(setResults);
    getAvailableQuizzes().then(setAvailable);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Quiz Center</h1>
        <p className="text-muted-foreground font-medium max-w-2xl">
          Test your knowledge, identify weak areas, and track your improvement over time.
        </p>
      </div>

      {/* HERO STATISTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Quizzes Completed", val: stats.completed.toString(), icon: CheckCircle2, color: "text-green-500" },
          { title: "Average Score", val: `${stats.avgScore}%`, icon: Target, color: "text-blue-500" },
          { title: "Questions Answered", val: stats.totalQuestions.toString(), icon: Layers, color: "text-purple-500" },
          { title: "Current Streak", val: `${stats.currentStreak} Correct`, icon: Trophy, color: "text-orange-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-between hover:border-foreground/30 transition-colors">
            <stat.icon className={`w-6 h-6 mb-4 ${stat.color}`} />
            <div>
              <div className="text-3xl font-extrabold mb-1">{stat.val}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Continue & Categories */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AVAILABLE QUIZZES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight">Available Quizzes</h2>
              <button 
                onClick={async () => {
                  await seedSampleQuizzes();
                  window.location.reload();
                }}
                className="text-xs font-bold bg-muted px-3 py-1.5 rounded-full hover:bg-foreground hover:text-background transition-colors"
              >
                Auto-Generate Quiz
              </button>
            </div>
            
            {available.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {available.map(q => (
                  <div key={q.id} className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden group">
                    <div className="relative z-10">
                      <span className={`text-xs font-bold uppercase tracking-wider ${q.color ? q.color.replace('bg-', 'text-') : 'text-muted-foreground'} mb-2 block`}>
                        {q.subjectName}
                      </span>
                      <h3 className="text-xl font-extrabold mb-2">{q.title}</h3>
                      <p className="text-sm font-medium text-muted-foreground mb-6 line-clamp-2">{q.description}</p>
                      
                      <Link href={`/quizzes/${q.id}`} className="inline-flex bg-foreground text-background px-4 py-2 rounded-xl text-sm font-bold items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                        Take Quiz <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border p-8 rounded-3xl text-center">
                <p className="text-muted-foreground font-bold mb-4">No quizzes available yet.</p>
                <p className="text-sm">Click the Auto-Generate button above to create a sample quiz!</p>
              </div>
            )}
          </div>

          {/* QUIZ CATEGORIES */}
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Quiz Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                "By Lesson", "By Topic", "By Subject",
                "Timed Challenges", "Mock Exams", "Weak Areas"
              ].map((cat, i) => (
                <div key={i} className="bg-muted/50 border border-border p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-card hover:border-foreground/30 transition-colors">
                  <span className="font-bold">{cat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Recent Results */}
        <div>
          <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" /> Recent Results
          </h2>
          <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border">
            {results.length > 0 ? results.map((res) => (
              <div key={res.id} className="p-5 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-col">
                    <h4 className="font-extrabold text-sm">{res.quizTitle}</h4>
                    <span className="text-xs text-muted-foreground">{res.subjectName}</span>
                  </div>
                  <span className={`font-extrabold ${res.percentage === 100 ? "text-green-500" : res.percentage >= 90 ? "text-green-600" : res.percentage >= 70 ? "text-blue-500" : "text-orange-500"}`}>
                    {res.percentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs mt-3">
                  <span className="text-muted-foreground font-medium">{formatDistanceToNow(new Date(res.date), { addSuffix: true })}</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`w-3 h-3 ${idx < res.rating ? "fill-yellow-500" : "fill-transparent text-muted-foreground opacity-30"}`} />
                    ))}
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-sm font-bold text-muted-foreground">
                No quizzes taken yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
