"use client";

import { Play, ArrowRight, CheckCircle2, History } from "lucide-react";

export default function ContinueLearningPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Cell Division", sub: "Biology", prog: 82, time: "7 mins left", color: "bg-subject-science" },
          { title: "Derivatives", sub: "Mathematics", prog: 45, time: "18 mins left", color: "bg-subject-math" },
          { title: "Thermodynamics", sub: "Physics", prog: 15, time: "30 mins left", color: "bg-subject-physics" },
          { title: "Data Structures", sub: "Computer Science", prog: 60, time: "15 mins left", color: "bg-blue-500" },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between group hover:border-foreground/30 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                <div className={`w-2 h-2 rounded-full ${item.color}`} /> {item.sub}
              </div>
              <h3 className="font-extrabold text-xl mb-4 line-clamp-2">{item.title}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{item.prog}%</span>
                  <span className="text-muted-foreground">{item.time}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.prog}%` }} />
                </div>
              </div>
              
              <button className="w-full bg-foreground text-background py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Resume <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RECENTLY COMPLETED */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" /> Recently Completed
        </h2>
        <div className="bg-card border border-border rounded-3xl overflow-hidden">
          <div className="divide-y divide-border">
            {[
              { title: "Introduction to Cells", sub: "Biology", date: "Today" },
              { title: "Limits and Continuity", sub: "Mathematics", date: "Yesterday" },
              { title: "Newton's Laws", sub: "Physics", date: "Oct 12" },
            ].map((item, i) => (
              <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm font-medium text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <span className="text-muted-foreground">{item.date}</span>
                  <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-border transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
