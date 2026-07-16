"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, Activity, FileText, ChevronRight } from "lucide-react";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ subjects: [], topics: [], lessons: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle global keyboard shortcuts and custom events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search", handleCustomOpen);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults({ subjects: [], topics: [], lessons: [] });
    }
  }, [isOpen]);

  // Debounced Search Fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults({ subjects: [], topics: [], lessons: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const hasResults = results.subjects.length > 0 || results.topics.length > 0 || results.lessons.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 md:px-0">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Area */}
        <div className="flex items-center px-6 py-4 border-b border-border">
          <Search className="w-6 h-6 text-muted-foreground mr-4 shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search subjects, topics, or lessons..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-grow bg-transparent text-xl font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
          {isLoading && (
            <div className="w-5 h-5 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin shrink-0 mx-2" />
          )}
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 hide-scrollbar">
          {!query.trim() ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Type to start searching...</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm font-bold opacity-50">
                <kbd className="bg-muted px-2 py-1 rounded">↑↓</kbd> to navigate
                <kbd className="bg-muted px-2 py-1 rounded ml-2">Esc</kbd> to close
              </div>
            </div>
          ) : !hasResults && !isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Subjects Group */}
              {results.subjects.length > 0 && (
                <div>
                  <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Subjects</h3>
                  <div className="space-y-1">
                    {results.subjects.map((item: any) => (
                      <div 
                        key={item.url}
                        onClick={() => navigateTo(item.url)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted cursor-pointer group transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-foreground/30 transition-colors">
                           <Activity className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-foreground">{item.name}</h4>
                          <div className="text-xs font-medium text-muted-foreground">{item.breadcrumb}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics Group */}
              {results.topics.length > 0 && (
                <div>
                  <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Topics</h3>
                  <div className="space-y-1">
                    {results.topics.map((item: any) => (
                      <div 
                        key={item.url}
                        onClick={() => navigateTo(item.url)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted cursor-pointer group transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-foreground/30 transition-colors">
                           <BookOpen className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-foreground">{item.name}</h4>
                          <div className="text-xs font-medium text-muted-foreground">{item.breadcrumb}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lessons Group */}
              {results.lessons.length > 0 && (
                <div>
                  <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Lessons</h3>
                  <div className="space-y-1">
                    {results.lessons.map((item: any) => (
                      <div 
                        key={item.url}
                        onClick={() => navigateTo(item.url)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted cursor-pointer group transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-foreground/30 transition-colors">
                           <FileText className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-foreground">{item.name}</h4>
                          <div className="text-xs font-medium text-muted-foreground">{item.breadcrumb}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
