"use client";

import { useState, useEffect } from "react";
import { Play, ArrowRight, CheckCircle2, History, Target, BookOpen } from "lucide-react";
import { getContinueLearning, getRecentLessons } from "@/app/actions/dashboard";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function ContinueLearningPage() {
  const [continueLearning, setContinueLearning] = useState<any[]>([]);
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getContinueLearning().then(setContinueLearning),
      getRecentLessons().then(setRecentLessons)
    ]).finally(() => setLoading(false));
  }, []);
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Continue Learning</h1>
          <p className="text-muted-foreground font-medium">Pick up right where you left off.</p>
        </div>
        
        <select className="bg-card border border-border px-4 py-3 rounded-xl font-bold text-sm focus:outline-none focus:border-foreground transition-colors max-w-xs">
          <option>Recently Viewed</option>
          <option>Closest to Completion</option>
          <option>Alphabetical</option>
        </select>
      </div>

      {/* ACTIVE LESSONS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-card rounded-3xl animate-pulse" />
          <div className="h-48 bg-card rounded-3xl animate-pulse" />
          <div className="h-48 bg-card rounded-3xl animate-pulse" />
        </div>
      ) : continueLearning.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {continueLearning.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between group hover:border-foreground/30 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                  <div className={`w-2 h-2 rounded-full ${item.color ? item.color.replace('text-', 'bg-') : 'bg-muted'}`} /> {item.sub}
                </div>
                <h3 className="font-extrabold text-xl mb-4 line-clamp-2">{item.title}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.prog}%</span>
                    <span className="text-muted-foreground">{item.time} left</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color ? item.color.replace('text-', 'bg-') : 'bg-foreground'}`} style={{ width: `${item.prog}%` }} />
                  </div>
                </div>
                
                <Link href="/dashboard" className="w-full bg-foreground text-background py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Resume <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-extrabold mb-2">You're all caught up!</h3>
          <p className="text-muted-foreground font-medium mb-6">You don't have any lessons currently in progress.</p>
          <Link href="/subjects" className="bg-foreground text-background px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
            Find something new to learn <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* RECENTLY COMPLETED */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" /> Recently Completed
        </h2>
        
        {loading ? (
          <div className="h-48 bg-card rounded-3xl animate-pulse" />
        ) : recentLessons.length > 0 ? (
          <div className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="divide-y divide-border">
              {recentLessons.map((item, i) => (
                <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-sm font-medium text-muted-foreground">{item.subjectName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold">
                    <span className="text-muted-foreground">{item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : "Recently"}</span>
                    <Link href="/dashboard" className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-border transition-colors">
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-12 text-center text-muted-foreground font-bold">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <p>You haven't completed any lessons yet. Start learning to build your history!</p>
          </div>
        )}
      </div>

    </div>
  );
}
