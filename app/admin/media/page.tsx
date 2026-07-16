"use client";

import { Search, Upload, Filter, MoreHorizontal, Image as ImageIcon, FileText, Video, File, Folder } from "lucide-react";

export default function MediaLibrary() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Media Library</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Central asset manager for all educational content.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Media
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search media..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm font-bold transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* LEFT FOLDERS */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground mb-4">Folders</h3>
          <div className="space-y-1">
            {["All Media", "Subjects", "Lessons", "Diagrams", "Illustrations", "Icons", "Certificates"].map((folder, i) => (
              <button key={i} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${i === 0 ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
                <span className="flex items-center gap-2"><Folder className="w-4 h-4" /> {folder}</span>
                {i > 0 && <span className="text-xs bg-muted px-1.5 rounded text-muted-foreground">12</span>}
              </button>
            ))}
          </div>
        </div>

        {/* MEDIA GRID */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            
            {[
              { type: "image", name: "cell-structure.png", size: "1.2 MB", icon: ImageIcon, color: "text-blue-500" },
              { type: "image", name: "calculus-graph.svg", size: "45 KB", icon: ImageIcon, color: "text-blue-500" },
              { type: "pdf", name: "syllabus_2026.pdf", size: "3.4 MB", icon: FileText, color: "text-red-500" },
              { type: "video", name: "intro_biology.mp4", size: "42 MB", icon: Video, color: "text-purple-500" },
              { type: "image", name: "badge_gold.png", size: "120 KB", icon: ImageIcon, color: "text-blue-500" },
              { type: "file", name: "data_set.csv", size: "12 KB", icon: File, color: "text-green-500" },
            ].map((media, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-3 group hover:border-foreground/30 transition-colors cursor-pointer relative">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 bg-card/80 backdrop-blur rounded border border-border text-foreground"><MoreHorizontal className="w-3 h-3" /></button>
                </div>
                <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center mb-3">
                  <media.icon className={`w-8 h-8 ${media.color}`} />
                </div>
                <div className="font-bold text-xs truncate mb-1" title={media.name}>{media.name}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">{media.size}</div>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
}
