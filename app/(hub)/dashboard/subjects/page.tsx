"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, Clock, Target, Star, Library } from "lucide-react";
import { getMySubjects } from "@/app/actions/subjects";

export default function MySubjectsPage() {
  const [filter, setFilter] = useState("All");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySubjects().then(res => {
      setSubjects(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Subjects</h1>
          <p className="text-muted-foreground font-medium">Manage and track your learning progress.</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search your subjects..."
            className="w-full md:w-[300px] pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {["All", "In Progress", "Completed", "Favorites"].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
              filter === tab ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SUBJECT CARDS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-card rounded-3xl animate-pulse" />
          <div className="h-64 bg-card rounded-3xl animate-pulse" />
        </div>
      ) : subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map(sub => (
            <div key={sub.id} className="bg-card border border-border rounded-3xl p-8 relative group overflow-hidden">
              <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 opacity-20 ${sub.color ? sub.color.replace('text-', 'bg-') : 'bg-muted'}`} />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-2xl font-extrabold flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${sub.color ? sub.color.replace('text-', 'bg-') : 'bg-foreground'}`} /> {sub.name}
                </h2>
                <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
                  <Star className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-bold mb-8 relative z-10">
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full uppercase tracking-wider">
                  {sub.levelPill}
                </span>
                <span className={`px-3 py-1 rounded-full uppercase tracking-wider ${
                  sub.status === "Finished" ? "bg-green-500/20 text-green-600" :
                  sub.status === "Started" ? "bg-blue-500/20 text-blue-600" :
                  "bg-muted/50 text-muted-foreground"
                }`}>
                  {sub.status === "Started" ? `Started (${sub.percentage}%)` : sub.status}
                </span>
              </div>

              <div className="space-y-2 mb-8 relative z-10">
                <div className="flex justify-between text-sm font-bold">
                  <span>Overall Progress</span>
                  <span>{sub.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${sub.color ? sub.color.replace('text-', 'bg-') : 'bg-foreground'}`} style={{ width: `${sub.percentage}%` }} />
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-4 mb-8 flex items-center justify-between relative z-10">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Status</span>
                  <span className="font-extrabold">{sub.status}</span>
                </div>
                <Link href={`/subjects/${sub.regionSlug}/${sub.levelSlug}/${sub.slug}`} className="bg-foreground text-background px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                  {sub.status === "Not Started" ? "Start" : "Continue"} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 relative z-10">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Completed Lessons</div>
                  <div className="font-extrabold text-lg">{sub.completed}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Remaining</div>
                  <div className="font-extrabold text-lg">{sub.total - sub.completed}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-16 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Library className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2">You haven't started any subjects yet!</h2>
          <p className="text-muted-foreground font-medium mb-8 max-w-md">
            Go to the main library to browse the curriculum and pick a subject to start learning. Your progress will automatically appear here.
          </p>
          <Link href="/subjects" className="bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
            Browse Full Library
          </Link>
        </div>
      )}

    </div>
  );
}
