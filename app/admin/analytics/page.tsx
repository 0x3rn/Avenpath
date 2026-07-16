"use client";

import { Users, Activity, BarChart3, TrendingUp, Download, ArrowUpRight, Search, Calendar, FileText } from "lucide-react";

export default function AnalyticsManager() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Understand how students use the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-2 font-bold text-sm px-4">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Daily Active Users", val: "18,240", icon: Activity, color: "text-blue-500", trend: "+5.2%" },
          { label: "Weekly Active Users", val: "84,932", icon: Users, color: "text-green-500", trend: "+8.1%" },
          { label: "Monthly Active Users", val: "214,000", icon: BarChart3, color: "text-purple-500", trend: "+12.4%" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-muted">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5 bg-green-500/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" /> {stat.trend}
              </span>
            </div>
            <div className="text-3xl font-extrabold mb-1">{stat.val}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* GROWTH CHART */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-lg font-extrabold mb-6">User Growth & Retention</h3>
          <div className="h-64 w-full flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2 border-b border-border relative">
            {/* Simulated Line Chart Area */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,80 Q20,60 40,70 T80,40 T100,20 L100,100 L0,100 Z" fill="currentColor" className="text-blue-500/10" />
              <path d="M0,80 Q20,60 40,70 T80,40 T100,20" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
            </svg>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">
            <span>May 1</span>
            <span>May 15</span>
            <span>May 30</span>
          </div>
        </div>

        {/* SEARCH ANALYTICS */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-lg font-extrabold mb-6 flex items-center gap-2"><Search className="w-5 h-5 text-muted-foreground" /> Search Analytics</h3>
          
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Most Searched Terms</div>
              <div className="flex flex-wrap gap-2">
                {["Calculus", "DNA", "Python", "Vectors", "Organic Chem"].map((term, i) => (
                  <span key={i} className="px-3 py-1.5 bg-muted rounded-lg text-sm font-bold">{term}</span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-3">No-Result Searches (Content Gaps)</div>
              <div className="flex flex-wrap gap-2">
                {["Quantum Biology", "Rust Programming", "Advanced Topology"].map((term, i) => (
                  <span key={i} className="px-3 py-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-bold border border-orange-500/20">{term}</span>
                ))}
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-2">Use these terms to plan your next lessons.</p>
            </div>
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* SUBJECT PERFORMANCE */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="text-lg font-extrabold mb-6">Subject Performance</h3>
          <div className="space-y-4">
            {[
              { name: "Mathematics", comp: 91, color: "bg-blue-500" },
              { name: "Biology", comp: 84, color: "bg-green-500" },
              { name: "Computer Science", comp: 76, color: "bg-purple-500" },
            ].map((sub, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{sub.name}</span>
                  <span className="text-muted-foreground">{sub.comp}% Completion</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.comp}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DROP OFF ANALYSIS */}
        <div className="bg-card border border-border rounded-3xl p-6 overflow-hidden">
          <h3 className="text-lg font-extrabold mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-red-500" /> Drop-Off Analysis</h3>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-3 pl-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Lesson</th>
                  <th className="p-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Students Left At</th>
                  <th className="p-3 pr-6 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Drop-Off %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { lesson: "Integration Basics", point: "Video Section", pct: "42%" },
                  { lesson: "Cell Division", point: "Final Quiz", pct: "28%" },
                  { lesson: "React Hooks", point: "Code Example 2", pct: "21%" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 pl-6 font-bold text-sm">{row.lesson}</td>
                    <td className="p-3 text-sm font-medium text-muted-foreground">{row.point}</td>
                    <td className="p-3 pr-6 text-sm font-extrabold text-red-500 text-right">{row.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
