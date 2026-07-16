"use client";

import { Search, Plus, MoreHorizontal, Filter, Download } from "lucide-react";

export default function SubjectsManager() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Subjects</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage all subjects across the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
          <button className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Subject
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search subjects..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm font-bold transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none transition-colors min-w-[120px]">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
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
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Topics</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Lessons</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Students</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Updated</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { icon: "🧮", title: "Mathematics", topics: "132", lessons: "845", students: "42,310", status: "Published", color: "text-green-500", bg: "bg-green-500/10", date: "Oct 24, 2026" },
                { icon: "💻", title: "Computer Science", topics: "94", lessons: "612", students: "38,102", status: "Published", color: "text-green-500", bg: "bg-green-500/10", date: "Oct 22, 2026" },
                { icon: "🧬", title: "Biology", topics: "76", lessons: "410", students: "21,490", status: "Published", color: "text-green-500", bg: "bg-green-500/10", date: "Oct 20, 2026" },
                { icon: "⚙️", title: "Engineering Math", topics: "12", lessons: "45", students: "0", status: "Draft", color: "text-orange-500", bg: "bg-orange-500/10", date: "Today" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 text-center"><input type="checkbox" className="rounded opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-lg">{row.icon}</div>
                      <span className="font-bold text-sm">{row.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-muted-foreground text-right">{row.topics}</td>
                  <td className="p-4 text-sm font-medium text-muted-foreground text-right">{row.lessons}</td>
                  <td className="p-4 text-sm font-medium text-muted-foreground text-right">{row.students}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${row.color} ${row.bg}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-muted-foreground">{row.date}</td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-muted-foreground hover:bg-card hover:text-foreground rounded-md opacity-0 group-hover:opacity-100 transition-all border border-transparent group-hover:border-border"><MoreHorizontal className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
          <span className="text-xs font-medium text-muted-foreground">Showing 1 to 4 of 154 subjects</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted" disabled>Prev</button>
            <button className="px-3 py-1 text-xs font-bold bg-foreground text-background border border-foreground rounded">1</button>
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted">2</button>
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}
