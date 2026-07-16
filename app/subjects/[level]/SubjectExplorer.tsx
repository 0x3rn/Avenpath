"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, Clock, BarChart, ChevronDown, Activity, Microscope, Telescope, ChevronRight } from "lucide-react";
import type { Subject } from "@/lib/curriculum";
import dynamic from "next/dynamic";

// Dynamic Lucide Icon loader helper
const IconMap: Record<string, any> = {
  Activity,
  Microscope,
  Telescope,
  BookOpen
};

function SubjectIcon({ name, className }: { name: string, className?: string }) {
  const Icon = IconMap[name] || BookOpen;
  return <Icon className={className} />;
}

export default function SubjectExplorer({ 
  level, 
  initialSubjects, 
  categories 
}: { 
  level: string; 
  initialSubjects: Subject[]; 
  categories: string[]; 
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Popular");

  // Format level
  const formattedLevel = level === 'highschool' ? 'High School' : 
                         level === 'university' ? 'University' : 
                         level.charAt(0).toUpperCase() + level.slice(1);

  // Filter subjects
  let filteredSubjects = initialSubjects;
  
  if (activeCategory !== "All") {
    filteredSubjects = filteredSubjects.filter(s => s.category === activeCategory);
  }
  
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredSubjects = filteredSubjects.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q)
    );
  }

  // Sort subjects (mock implementation since we don't have popularity metrics yet)
  if (sortBy === "A-Z") {
    filteredSubjects.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "Most Lessons") {
    filteredSubjects.sort((a, b) => {
      const aLessons = a.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
      const bLessons = b.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
      return bLessons - aLessons;
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar placeholder */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-50 border-b border-border">
        <Link href="/" className="text-2xl font-bold tracking-tight">Avenpath.</Link>
        <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
          <Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{formattedLevel}</span>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-16">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
            Explore {formattedLevel}
          </h1>
          <p className="text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
            From science to humanities, discover structured learning paths designed specifically for {formattedLevel.toLowerCase()} students.
          </p>
          
          {/* SEARCH BAR */}
          <div className="relative w-full max-w-2xl mb-8 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-2 border-border focus:border-foreground rounded-full py-5 pl-14 pr-6 text-lg font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-sm focus:shadow-xl"
            />
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => setActiveCategory("All")}
              className={`px-5 py-2.5 rounded-full text-[15px] font-bold transition-all ${activeCategory === "All" ? "bg-foreground text-background shadow-md" : "bg-card border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
            >
              All
            </button>
            {categories.map(cat => {
              const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
              return (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-[15px] font-bold transition-all ${activeCategory === cat ? "bg-foreground text-background shadow-md" : "bg-card border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}
                >
                  {formattedCat}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="text-muted-foreground font-semibold text-[15px]">
            Showing {filteredSubjects.length} subjects
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium text-sm">Sort by:</span>
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1 font-bold text-[15px]">
                {sortBy} <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                {["Popular", "A-Z", "Newest", "Most Lessons"].map(option => (
                  <div 
                    key={option} 
                    onClick={() => setSortBy(option)}
                    className="px-4 py-2 hover:bg-muted text-[15px] font-medium transition-colors"
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUBJECT GRID */}
        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSubjects.map(subject => {
              const totalLessons = subject.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
              
              return (
                <Link key={subject.slug} href={`/subjects/${level}/${subject.slug}`}>
                  <div 
                    className="group flex flex-col h-full bg-card border border-border rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden -translate-y-0 hover:-translate-y-1"
                  >
                    {/* Hover Border Accent */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                      style={{ border: `2px solid ${subject.color}` }}
                    />
                    
                    <div className="flex-grow">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: `${subject.color}15`, color: subject.color }}>
                        <SubjectIcon name={subject.icon} className="w-7 h-7" />
                      </div>
                      
                      <h3 className="text-2xl font-extrabold mb-3 text-foreground group-hover:text-foreground transition-colors">
                        {subject.name}
                      </h3>
                      
                      <p className="text-muted-foreground text-[15px] font-medium leading-relaxed mb-6 line-clamp-3">
                        {subject.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-border mt-auto">
                      <div className="flex items-center gap-4 text-[13px] font-bold text-muted-foreground mb-6">
                        <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {subject.topics.length} Topics</div>
                        <div className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {totalLessons} Lessons</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Difficulty Badge - Hardcoded to 'Intermediate' for now as placeholder */}
                        <div className="px-3 py-1 rounded-full bg-muted text-[13px] font-bold text-muted-foreground">
                          Intermediate
                        </div>
                        
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-border group-hover:border-transparent transition-all duration-300" style={{ backgroundColor: "transparent" }}>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-extrabold mb-3">No subjects found</h3>
            <p className="text-muted-foreground text-lg">Try adjusting your filters or search query.</p>
          </div>
        )}

      </main>
    </div>
  );
}
