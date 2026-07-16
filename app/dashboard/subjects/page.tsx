"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, Clock, Target, Star } from "lucide-react";

export default function MySubjectsPage() {
  const [filter, setFilter] = useState("All");

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-3xl p-8 relative group overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-subject-math/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-subject-math" /> Mathematics
            </h2>
            <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
              <Star className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground mb-8 relative z-10">
            <span>132 Topics</span>
            <span>845 Lessons</span>
          </div>

          <div className="space-y-2 mb-8 relative z-10">
            <div className="flex justify-between text-sm font-bold">
              <span>Overall Progress</span>
              <span>72%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-subject-math rounded-full w-[72%]" />
            </div>
          </div>

          <div className="bg-muted/50 rounded-2xl p-4 mb-8 flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Current Topic</span>
              <span className="font-extrabold">Calculus</span>
            </div>
            <Link href="/subjects/university/mathematics" className="bg-foreground text-background px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
              Continue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 relative z-10">
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Completed</div>
              <div className="font-extrabold text-lg">608</div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Hours</div>
              <div className="font-extrabold text-lg">42</div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Quiz Avg</div>
              <div className="font-extrabold text-lg text-green-600">88%</div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card border border-border rounded-3xl p-8 relative group overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-subject-science/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-subject-science" /> Biology
            </h2>
            <button className="text-muted-foreground hover:text-yellow-500 transition-colors">
              <Star className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground mb-8 relative z-10">
            <span>86 Topics</span>
            <span>420 Lessons</span>
          </div>

          <div className="space-y-2 mb-8 relative z-10">
            <div className="flex justify-between text-sm font-bold">
              <span>Overall Progress</span>
              <span>45%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-subject-science rounded-full w-[45%]" />
            </div>
          </div>

          <div className="bg-muted/50 rounded-2xl p-4 mb-8 flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Current Topic</span>
              <span className="font-extrabold">Cellular Respiration</span>
            </div>
            <Link href="/subjects/university/science" className="bg-foreground text-background px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
              Continue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 relative z-10">
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Completed</div>
              <div className="font-extrabold text-lg">189</div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Hours</div>
              <div className="font-extrabold text-lg">18</div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Quiz Avg</div>
              <div className="font-extrabold text-lg text-green-600">92%</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
