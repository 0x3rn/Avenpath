"use client";

import { Plus, Search, Filter, Folder, FolderOpen, MoreVertical, FileText, MoveRight } from "lucide-react";
import { useState } from "react";

export default function TopicsManager() {
  const [openSubject, setOpenSubject] = useState("Mathematics");

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Topics</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Organize every subject into topics and subtopics.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Topic
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search topics..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Biology</option>
            <option>Computer Science</option>
          </select>
        </div>
      </div>

      {/* TOPICS TREE */}
      <div className="bg-card border border-border rounded-2xl p-4">
        
        {/* Subject Header (Simulated Folder) */}
        <div 
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => setOpenSubject(openSubject === "Mathematics" ? "" : "Mathematics")}
        >
          {openSubject === "Mathematics" ? <FolderOpen className="w-5 h-5 text-blue-500" /> : <Folder className="w-5 h-5 text-blue-500" />}
          <span className="font-bold text-sm">Mathematics</span>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto">132 Topics</span>
        </div>

        {/* Nested Topics */}
        {openSubject === "Mathematics" && (
          <div className="ml-5 mt-1 border-l border-border pl-4 space-y-1">
            
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-sm">Algebra</span>
              </div>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase">Published</span>
                <button className="text-muted-foreground hover:text-foreground"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="ml-5 mt-1 border-l border-border pl-4 space-y-1">
              {["Variables", "Equations", "Functions", "Polynomials"].map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">{sub}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-card border border-transparent hover:border-border rounded"><MoveRight className="w-3 h-3 text-muted-foreground" /></button>
                    <button className="p-1 hover:bg-card border border-transparent hover:border-border rounded"><MoreVertical className="w-3 h-3 text-muted-foreground" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-sm">Geometry</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-green-500" />
                <span className="font-medium text-sm">Calculus</span>
              </div>
            </div>

          </div>
        )}

        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors mt-2">
          <Folder className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-sm">Computer Science</span>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto">94 Topics</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors mt-2">
          <Folder className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-sm">Biology</span>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto">76 Topics</span>
        </div>

      </div>

    </div>
  );
}
