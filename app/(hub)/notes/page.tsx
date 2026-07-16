"use client";

import { useState } from "react";
import { Folder, Search, Plus, FileText, Highlighter, MoreVertical, Type, Bold, Italic, List, Image as ImageIcon, Code, Calculator, AlignLeft } from "lucide-react";

export default function NotesPage() {
  const [activeNote, setActiveNote] = useState(true);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* LEFT SIDEBAR: FOLDERS & SEARCH */}
      <div className="w-full md:w-[300px] shrink-0 flex flex-col h-full gap-4">
        
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight">My Notes</h1>
          <button className="bg-foreground text-background p-2 rounded-xl hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search notes & highlights..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:border-foreground text-sm font-bold transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pb-24 md:pb-0">
          
          {/* FOLDERS */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Folders</h3>
            <div className="space-y-1">
              {[
                { name: "Biology", count: 12, color: "text-subject-science" },
                { name: "Mathematics", count: 8, color: "text-subject-math" },
                { name: "Computer Science", count: 24, color: "text-blue-500" },
                { name: "Personal", count: 3, color: "text-muted-foreground" },
              ].map((folder, i) => (
                <button key={i} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3 font-bold text-sm">
                    <Folder className={`w-4 h-4 ${folder.color} fill-current/20`} /> {folder.name}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md group-hover:bg-background">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RECENT NOTES & HIGHLIGHTS */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Recent</h3>
            <div className="space-y-2">
              
              {/* Note Item */}
              <button onClick={() => setActiveNote(true)} className={`w-full text-left p-3 rounded-xl border transition-colors ${activeNote ? "bg-card border-foreground/30" : "bg-transparent border-transparent hover:bg-card hover:border-border"}`}>
                <h4 className="font-bold text-sm mb-1 line-clamp-1">Cellular Respiration Summary</h4>
                <p className="text-xs font-medium text-muted-foreground line-clamp-2">The stages include Glycolysis, Krebs Cycle, and the Electron Transport Chain...</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-muted-foreground uppercase">
                  <FileText className="w-3 h-3" /> Note
                </div>
              </button>

              {/* Highlight Item */}
              <button onClick={() => setActiveNote(false)} className={`w-full text-left p-3 rounded-xl border transition-colors ${!activeNote ? "bg-card border-foreground/30" : "bg-transparent border-transparent hover:bg-card hover:border-border"}`}>
                <h4 className="font-bold text-sm mb-1 line-clamp-1 italic">"Mitochondria are double-membraned..."</h4>
                <p className="text-xs font-medium text-muted-foreground line-clamp-2">Found in Eukaryotic Cells lesson.</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-yellow-500 uppercase">
                  <Highlighter className="w-3 h-3" /> Highlight
                </div>
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: EDITOR */}
      <div className="flex-1 bg-card border border-border rounded-3xl overflow-hidden flex flex-col min-h-[500px]">
        
        {activeNote ? (
          <>
            {/* Editor Toolbar */}
            <div className="border-b border-border p-2 sm:p-4 flex flex-wrap items-center gap-2 bg-muted/30">
              <div className="flex items-center bg-card border border-border rounded-lg p-1">
                <button className="p-1.5 rounded hover:bg-muted transition-colors"><Type className="w-4 h-4" /></button>
                <button className="p-1.5 rounded bg-muted transition-colors"><Bold className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-muted transition-colors"><Italic className="w-4 h-4" /></button>
              </div>
              <div className="w-px h-6 bg-border mx-1" />
              <div className="flex items-center bg-card border border-border rounded-lg p-1">
                <button className="p-1.5 rounded hover:bg-muted transition-colors"><AlignLeft className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-muted transition-colors"><List className="w-4 h-4" /></button>
              </div>
              <div className="w-px h-6 bg-border mx-1" />
              <div className="flex items-center bg-card border border-border rounded-lg p-1">
                <button className="p-1.5 rounded hover:bg-muted transition-colors"><ImageIcon className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-muted transition-colors"><Code className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-muted transition-colors"><Calculator className="w-4 h-4" /></button>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground hidden sm:block">Saved just now</span>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Editor Content Area (Simulated) */}
            <div className="flex-1 p-6 sm:p-12 overflow-y-auto">
              <input 
                type="text" 
                defaultValue="Cellular Respiration Summary"
                className="w-full text-4xl font-extrabold mb-6 bg-transparent outline-none placeholder:text-muted"
                placeholder="Note Title"
              />
              <div className="flex gap-2 mb-8">
                <span className="bg-subject-science/10 text-subject-science text-xs font-bold px-2.5 py-1 rounded-md">Biology</span>
                <span className="bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-md">Exam Prep</span>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none font-medium">
                <p>Cellular respiration is the process by which biological fuels are oxidized in the presence of an inorganic electron acceptor, such as oxygen, to produce large amounts of energy, to drive the bulk production of ATP.</p>
                <h3>The Three Main Stages:</h3>
                <ul>
                  <li><strong>Glycolysis</strong>: Occurs in the cytoplasm. Breaks down glucose into two molecules of pyruvate. Yields 2 ATP and 2 NADH.</li>
                  <li><strong>Krebs Cycle (Citric Acid Cycle)</strong>: Occurs in the mitochondrial matrix. Completes the breakdown of glucose.</li>
                  <li><strong>Electron Transport Chain</strong>: Occurs in the inner mitochondrial membrane. Produces the vast majority of ATP.</li>
                </ul>
                <div className="bg-muted/50 p-4 rounded-xl border border-border my-6 font-mono text-sm">
                  C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP + heat)
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Saved Highlight View */
          <div className="flex-1 p-6 sm:p-12 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Highlighter className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">Saved Highlight</h2>
                  <p className="text-sm font-bold text-muted-foreground">From: Eukaryotic Cells</p>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"><MoreVertical className="w-5 h-5" /></button>
            </div>

            <blockquote className="border-l-4 border-yellow-500 pl-6 py-2 mb-8 italic text-xl font-medium text-foreground">
              "Mitochondria are double-membraned organelles found in most eukaryotic organisms. They generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
            </blockquote>

            <div className="bg-muted/30 border border-border rounded-2xl p-6">
              <h3 className="font-bold text-sm mb-3">Your Note:</h3>
              <textarea 
                className="w-full bg-transparent outline-none resize-none h-24 font-medium"
                defaultValue="Make sure to mention the double membrane structure on the midterm essay question!"
                placeholder="Add a comment to this highlight..."
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
