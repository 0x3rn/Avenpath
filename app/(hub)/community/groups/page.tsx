"use client";

import { Users, Search, Plus, Bell, MessageCircle, MapPin, Activity, Calendar } from "lucide-react";

export default function StudyGroupsPage() {
  return (
    <div className="relative">
      
      {/* COMING SOON OVERLAY */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md rounded-3xl m-4 md:m-0">
        <div className="bg-card border border-border p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Coming Soon</h2>
          <p className="text-muted-foreground font-medium mb-6">
            Study Groups are currently under development. Join small communities and study together soon!
          </p>
          <button disabled className="bg-muted text-muted-foreground font-bold px-6 py-2.5 rounded-xl cursor-not-allowed">
            Notify Me
          </button>
        </div>
      </div>

      {/* FULL UI (Hidden beneath overlay) */}
      <div className="max-w-7xl mx-auto space-y-12 p-4 md:p-8 animate-in fade-in duration-500 pointer-events-none select-none">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Study Groups</h1>
            <p className="text-muted-foreground font-medium">Join focused communities to study together, share resources, and stay accountable.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Find a study group..."
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl font-bold text-sm"
                readOnly
              />
            </div>
            <button className="bg-foreground text-background px-4 py-3 rounded-xl font-bold flex items-center gap-2 shrink-0">
              <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Create Group</span>
            </button>
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {["Mathematics", "Biology", "Programming", "Engineering", "Medicine", "Business", "Languages", "Exam Prep"].map((cat, i) => (
              <button key={i} className={`px-5 py-3 rounded-2xl font-bold text-sm shrink-0 whitespace-nowrap ${i === 0 ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MY GROUPS (Horizontal Scroll) */}
        <div>
          <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" /> My Groups
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
            
            <div className="w-[300px] shrink-0 bg-card border-2 border-subject-math rounded-3xl p-6 relative">
              <div className="absolute top-0 right-0 p-6">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse block" />
              </div>
              <h3 className="font-extrabold text-xl mb-1 pr-6 line-clamp-1">Computer Science</h3>
              <p className="text-sm font-bold text-muted-foreground mb-6">Algorithms Study Group</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card" />)}
                </div>
                <span className="text-xs font-bold bg-muted px-3 py-1.5 rounded-lg text-foreground">8 New Messages</span>
              </div>
            </div>

            <div className="w-[300px] shrink-0 bg-card border border-border rounded-3xl p-6">
              <h3 className="font-extrabold text-xl mb-1 line-clamp-1">Calculus 101</h3>
              <p className="text-sm font-bold text-muted-foreground mb-6">Exam Prep Group</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2].map(i => <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card" />)}
                </div>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Today, 7 PM
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* FEATURED GROUPS */}
        <div>
          <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-muted-foreground" /> Featured Groups
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-16 h-16 rounded-2xl bg-subject-math/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-subject-math" />
                </div>
              </div>
              
              <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg mb-6 inline-flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" /> Very Active
              </span>
              
              <h3 className="text-2xl font-extrabold mb-4 pr-20">Calculus Beginners</h3>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground mb-8">
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg"><Users className="w-4 h-4" /> 1,248 Members</span>
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg"><MapPin className="w-4 h-4" /> Global</span>
              </div>

              <button className="bg-muted text-foreground px-8 py-3 rounded-xl font-bold hover:bg-foreground hover:text-background transition-colors">
                Join Group
              </button>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              
              <span className="bg-muted text-muted-foreground text-xs font-bold px-3 py-1.5 rounded-lg mb-6 inline-flex items-center gap-1">
                Active
              </span>
              
              <h3 className="text-2xl font-extrabold mb-4 pr-20">Organic Chemistry</h3>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground mb-8">
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg"><Users className="w-4 h-4" /> 842 Members</span>
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg"><MapPin className="w-4 h-4" /> Europe</span>
              </div>

              <button className="bg-muted text-foreground px-8 py-3 rounded-xl font-bold hover:bg-foreground hover:text-background transition-colors">
                Join Group
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
