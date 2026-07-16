"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, PlayCircle, Clock, ThumbsUp, ThumbsDown, Bookmark, Target, Zap, Activity } from "lucide-react";
import { getContinueLearning } from "@/app/actions/dashboard";
import { getMySubjects } from "@/app/actions/subjects";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getContinueLearning().then(setRecommendations),
      getMySubjects().then(setSubjects)
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-12 animate-pulse pb-24">
        <div className="h-64 bg-card rounded-3xl" />
        <div className="h-64 bg-card rounded-3xl" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24 text-center">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">No Recommendations Yet</h1>
          <p className="text-muted-foreground font-medium text-lg mb-8">
            We build your personalized recommendations based on the subjects you are actively studying. Start learning to unlock your personalized feed!
          </p>
          <Link href="/subjects" className="bg-foreground text-background px-8 py-4 rounded-xl font-bold inline-block hover:scale-[1.02] transition-transform">
            Browse the Library
          </Link>
        </div>
      </div>
    );
  }

  const heroItem = recommendations[0];
  const quickWins = recommendations.slice(1);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24">
      
      {/* HEADER */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" /> Recommendations
        </h1>
        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
          Personalized learning suggestions built around your goals, progress, and study habits.
        </p>
      </div>

      {/* CONTINUE LEARNING HERO */}
      {heroItem && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
            <div className={`w-32 h-32 rounded-full blur-3xl ${heroItem.color ? heroItem.color.replace('text-', 'bg-') : 'bg-muted'}`} />
          </div>
          
          <div className="relative z-10">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg mb-6 inline-flex items-center gap-2 ${heroItem.color ? heroItem.color.replace('text-', 'bg-').replace('500', '500/10') + ' ' + heroItem.color : 'bg-muted text-muted-foreground'}`}>
              <PlayCircle className="w-4 h-4" /> Top Recommendation
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 pr-20">{heroItem.title}</h2>
            <div className="text-muted-foreground font-bold mb-8">{heroItem.sub}</div>
            
            <Link href="/dashboard" className="bg-foreground text-background px-8 py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 w-full sm:w-fit hover:scale-[1.02] transition-transform">
              Start Learning <PlayCircle className="w-5 h-5 fill-background text-foreground" />
            </Link>
          </div>
        </div>
      )}

      {/* QUICK WINS */}
      {quickWins.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Up Next
            </h2>
            <div className="space-y-4">
              {quickWins.map((item, i) => (
                <div key={i} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between group hover:border-foreground/30 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-extrabold text-lg">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mt-1">
                      <span>{item.sub}</span> • <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                    </div>
                  </div>
                  <Link href="/dashboard" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                    <PlayCircle className="w-5 h-5 ml-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
