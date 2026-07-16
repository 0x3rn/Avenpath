"use client";

import { useState } from "react";
import { Search, Folder, FileText, Bookmark, MoreVertical, Trash2, Download, ArrowRight, Clock } from "lucide-react";

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState("Lessons");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const selectAll = () => {
    if (selectedItems.length === 3) setSelectedItems([]);
    else setSelectedItems([1, 2, 3]); // Mocking 3 items
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Bookmarks</h1>
          <p className="text-muted-foreground font-medium">Everything you've saved for later.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-[250px]">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search bookmarks..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <select className="bg-card border border-border px-4 py-3 rounded-xl font-bold text-sm focus:outline-none focus:border-foreground transition-colors shrink-0">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Subject</option>
          </select>
        </div>
      </div>

      {/* TABS & BULK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex gap-6">
          {["Lessons", "Topics", "Notes"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-bold text-sm pb-4 -mb-4 border-b-2 transition-colors ${
                activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <span className="text-sm font-bold text-muted-foreground mr-2">{selectedItems.length} selected</span>
            <button className="text-sm font-bold bg-muted px-4 py-2 rounded-lg hover:bg-foreground hover:text-background transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="text-sm font-bold bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Remove
            </button>
          </div>
        )}
      </div>

      {/* CONTENT LIST */}
      <div className="space-y-4">
        
        {/* Select All Row */}
        <div className="flex items-center gap-4 px-4 pb-2">
          <input 
            type="checkbox" 
            checked={selectedItems.length === 3}
            onChange={selectAll}
            className="w-5 h-5 rounded border-border text-foreground focus:ring-foreground accent-foreground"
          />
          <span className="text-sm font-bold text-muted-foreground">Select All</span>
        </div>

        {/* Example Item 1: Lesson */}
        <div className={`bg-card border p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-foreground/30 ${selectedItems.includes(1) ? "border-foreground" : "border-border"}`}>
          <div className="flex items-start sm:items-center gap-4">
            <input 
              type="checkbox" 
              checked={selectedItems.includes(1)}
              onChange={() => toggleSelect(1)}
              className="w-5 h-5 rounded border-border text-foreground focus:ring-foreground accent-foreground mt-1 sm:mt-0"
            />
            <div className="w-12 h-12 rounded-xl bg-subject-math/10 flex items-center justify-center shrink-0">
              <Bookmark className="w-6 h-6 text-subject-math fill-subject-math/20" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Introduction to Calculus</h3>
              <p className="text-sm font-medium text-muted-foreground">Mathematics</p>
            </div>
          </div>
          <div className="flex items-center gap-6 sm:ml-auto pl-9 sm:pl-0">
            <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 hidden sm:flex">
              <Clock className="w-4 h-4" /> 3 days ago
            </span>
            <button className="bg-foreground text-background px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Open
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-2 -mr-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Example Item 2: Topic */}
        <div className={`bg-card border p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-foreground/30 ${selectedItems.includes(2) ? "border-foreground" : "border-border"}`}>
          <div className="flex items-start sm:items-center gap-4">
            <input 
              type="checkbox" 
              checked={selectedItems.includes(2)}
              onChange={() => toggleSelect(2)}
              className="w-5 h-5 rounded border-border text-foreground focus:ring-foreground accent-foreground mt-1 sm:mt-0"
            />
            <div className="w-12 h-12 rounded-xl bg-subject-science/10 flex items-center justify-center shrink-0">
              <Folder className="w-6 h-6 text-subject-science fill-subject-science/20" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Organic Chemistry</h3>
              <p className="text-sm font-medium text-muted-foreground">28 Lessons</p>
            </div>
          </div>
          <div className="flex items-center gap-6 sm:ml-auto pl-9 sm:pl-0">
            <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 hidden sm:flex">
              <Clock className="w-4 h-4" /> 1 week ago
            </span>
            <button className="bg-muted text-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-border transition-colors flex items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-2 -mr-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Example Item 3: Note */}
        <div className={`bg-card border p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors hover:border-foreground/30 ${selectedItems.includes(3) ? "border-foreground" : "border-border"}`}>
          <div className="flex items-start gap-4">
            <input 
              type="checkbox" 
              checked={selectedItems.includes(3)}
              onChange={() => toggleSelect(3)}
              className="w-5 h-5 rounded border-border text-foreground focus:ring-foreground accent-foreground mt-1"
            />
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg mb-1">Linear equations</h3>
              <p className="text-sm font-medium text-muted-foreground line-clamp-2 max-w-lg mb-3">
                Important formula: y = mx + b. Where m is the slope and b is the y-intercept. Don't forget to review the substitution method before the exam.
              </p>
              <div className="flex items-center gap-3">
                <button className="text-xs font-bold text-foreground hover:underline">Edit Note</button>
                <button className="text-xs font-bold text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 pl-9 sm:pl-0">
            <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Yesterday
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
