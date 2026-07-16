"use client";

import { Search, Plus, Filter, MoreHorizontal, HelpCircle } from "lucide-react";

export default function QuizzesManager() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Quizzes</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage assessments and question banks.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Quiz
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search quizzes..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Biology</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-10 text-center"><input type="checkbox" className="rounded" /></th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Quiz</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Questions</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Attempts</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Avg Score</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { title: "Calculus Midterm", sub: "Mathematics", q: 20, att: "1,240", avg: "76%", status: "Published", color: "text-green-500", bg: "bg-green-500/10" },
                { title: "Cell Structure Quiz", sub: "Biology", q: 10, att: "842", avg: "82%", status: "Published", color: "text-green-500", bg: "bg-green-500/10" },
                { title: "Algorithms Final", sub: "Computer Science", q: 50, att: "-", avg: "-", status: "Draft", color: "text-orange-500", bg: "bg-orange-500/10" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 text-center"><input type="checkbox" className="rounded opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                  <td className="p-4 font-bold text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" /> {row.title}
                  </td>
                  <td className="p-4 text-sm font-medium text-muted-foreground">{row.sub}</td>
                  <td className="p-4 text-sm font-bold text-muted-foreground text-right">{row.q}</td>
                  <td className="p-4 text-sm font-medium text-muted-foreground text-right">{row.att}</td>
                  <td className="p-4 text-sm font-bold text-foreground text-right">{row.avg}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${row.color} ${row.bg}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-muted-foreground hover:bg-card hover:text-foreground rounded-md opacity-0 group-hover:opacity-100 transition-all border border-transparent group-hover:border-border"><MoreHorizontal className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
