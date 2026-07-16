"use client";

import { Search, Plus, Filter, MoreHorizontal, Download, Edit3, History } from "lucide-react";

export default function LessonsManager() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Lessons</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage all educational content and track versions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
          <button className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Lesson
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search lessons..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Biology</option>
          </select>
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>In Review</option>
            <option>Scheduled</option>
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
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Topic</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Author</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Ver</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Updated</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { title: "Introduction to Calculus", sub: "Mathematics", topic: "Calculus", status: "Published", color: "text-green-500", bg: "bg-green-500/10", author: "Dr. Smith", ver: "1.4", date: "2 hrs ago" },
                { title: "Cell Division Explained", sub: "Biology", topic: "Genetics", status: "Draft", color: "text-orange-500", bg: "bg-orange-500/10", author: "Dr. Jones", ver: "0.9", date: "5 hrs ago" },
                { title: "Python Data Structures", sub: "Computer Science", topic: "Algorithms", status: "In Review", color: "text-blue-500", bg: "bg-blue-500/10", author: "Prof. Lee", ver: "1.1", date: "Yesterday" },
                { title: "Newton's Laws", sub: "Physics", topic: "Mechanics", status: "Scheduled", color: "text-purple-500", bg: "bg-purple-500/10", author: "Admin", ver: "2.0", date: "2 days ago" },
                { title: "Reaction Balancing", sub: "Chemistry", topic: "Reactions", status: "Published", color: "text-green-500", bg: "bg-green-500/10", author: "Admin", ver: "1.0", date: "Last week" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 text-center"><input type="checkbox" className="rounded opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                  <td className="p-4">
                    <div className="font-bold text-sm group-hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-2">
                      {row.title}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-muted-foreground">{row.sub}</td>
                  <td className="p-4 text-sm font-medium text-muted-foreground">{row.topic}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${row.color} ${row.bg}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-foreground flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-muted border border-border" /> {row.author}
                  </td>
                  <td className="p-4 text-sm font-bold text-muted-foreground text-right">{row.ver}</td>
                  <td className="p-4 text-sm font-medium text-muted-foreground text-right">{row.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:bg-card hover:text-blue-500 rounded-md border border-transparent hover:border-border transition-all" title="Version History"><History className="w-4 h-4" /></button>
                      <button className="p-1.5 text-muted-foreground hover:bg-card hover:text-foreground rounded-md border border-transparent hover:border-border transition-all" title="Edit Lesson"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-1.5 text-muted-foreground hover:bg-card hover:text-foreground rounded-md border border-transparent hover:border-border transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
          <span className="text-xs font-medium text-muted-foreground">Showing 1 to 5 of 12,842 lessons</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted" disabled>Prev</button>
            <button className="px-3 py-1 text-xs font-bold bg-foreground text-background border border-foreground rounded">1</button>
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted">2</button>
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted">3</button>
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}
