"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, ArrowRight, BookOpen, Clock, BarChart, ChevronDown, Activity, Microscope, Telescope, ChevronRight } from "lucide-react";
import type { Subject } from "@/types/curriculum";
import dynamic from "next/dynamic";

import { SubjectIcon } from "@/components/SubjectIcon";

export default function SubjectExplorer({ 
  region,
  level, 
  initialSubjects, 
  categories,
  isLoggedIn = false
}: { 
  region: string;
  level: string; 
  initialSubjects: Subject[]; 
  categories: string[]; 
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultCategory = categories.includes("all") ? "all" : (categories.length > 0 ? categories[0] : "All");
  
  const [optimisticCategory, setOptimisticCategory] = useState<string | null>(null);
  const activeCategory = optimisticCategory || searchParams.get('category') || defaultCategory;
  
  const setActiveCategory = (cat: string) => {
    setOptimisticCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', cat);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("A-Z");

  // Handle auto-scroll to hash when it exists
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1); // Remove the #
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [searchParams]);

  // Format level
  const formattedLevel = level === 'highschool' ? 'High School' : 
                         level === 'primaryschool' ? 'Primary School' :
                         level === 'university' ? 'University' : 
                         level.charAt(0).toUpperCase() + level.slice(1);

  const formatRegionName = (r: string) => {
    if (r === 'nigerian-education') return 'Nigerian Education';
    if (r === 'international') return 'International Curriculum';
    return r.charAt(0).toUpperCase() + r.slice(1);
  };

  // Filter subjects
  let filteredSubjects = initialSubjects;
  
  if (activeCategory !== "All") {
    filteredSubjects = filteredSubjects.filter(s => s.category === activeCategory);
  }
  
  // Deduplicate by name
  const uniqueSubjectsMap = new Map<string, typeof filteredSubjects[0]>();
  filteredSubjects.forEach(s => {
    if (!uniqueSubjectsMap.has(s.name)) {
      uniqueSubjectsMap.set(s.name, s);
    }
  });
  filteredSubjects = Array.from(uniqueSubjectsMap.values());

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
      const aLessons = a.topics.reduce((acc, t) => acc + (t.subtopics.length > 0 ? t.subtopics.length : 1), 0);
      const bLessons = b.topics.reduce((acc, t) => acc + (t.subtopics.length > 0 ? t.subtopics.length : 1), 0);
      return bLessons - aLessons;
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar */}
      {!isLoggedIn ? (
        <nav className="sticky top-0 flex items-center justify-between px-8 py-6 w-full z-40 bg-background border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Avenpath Logo" className="h-16 w-auto" />
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link href="/subjects" className="hover:text-foreground transition-colors">Curriculum</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/subjects/${region}`} className="hover:text-foreground transition-colors">{formatRegionName(region)}</Link>
            <ChevronRight className="w-4 h-4" />
            <span 
              className={activeCategory === 'All' ? "text-foreground" : "hover:text-foreground transition-colors cursor-pointer"} 
              onClick={() => activeCategory !== 'All' && setActiveCategory('All')}
            >
              {formattedLevel}
            </span>
            {activeCategory !== 'All' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground capitalize">{activeCategory.replace('-', ' ')}</span>
              </>
            )}
          </div>
        </nav>
      ) : (
        <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground px-8 py-6 w-full">
          <Link href="/subjects" className="hover:text-foreground transition-colors">Curriculum</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/subjects/${region}`} className="hover:text-foreground transition-colors">{formatRegionName(region)}</Link>
          <ChevronRight className="w-4 h-4" />
          <span 
            className={activeCategory === 'All' ? "text-foreground" : "hover:text-foreground transition-colors cursor-pointer"} 
            onClick={() => activeCategory !== 'All' && setActiveCategory('All')}
          >
            {formattedLevel}
          </span>
          {activeCategory !== 'All' && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground capitalize">{activeCategory.replace('-', ' ')}</span>
            </>
          )}
        </div>
      )}

      <main className="flex-grow w-full  px-6 py-16">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Explore {formattedLevel}
          </h1>
          <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
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
              className="w-full bg-card border-2 border-border focus:border-foreground rounded-full py-5 pl-14 pr-6 text-lg font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-sm focus:shadow-md"
            />
          </div>

          {/* CATEGORY CHIPS - Desktop */}
          {categories.length > 1 && (
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-3">
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
          )}

          {/* CATEGORY DROPDOWN - Mobile */}
          {categories.length > 1 && (
            <div className="sm:hidden w-full max-w-xs mx-auto relative mb-4">
               <select 
                 value={activeCategory} 
                 onChange={(e) => setActiveCategory(e.target.value)}
                 className="w-full bg-card border-2 border-border focus:border-foreground rounded-full py-3 px-5 text-lg font-bold appearance-none relative z-10 outline-none text-foreground"
               >
                 {categories.map(cat => (
                   <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                 ))}
               </select>
               <ChevronDown className="w-5 h-5 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none" />
            </div>
          )}


        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="text-muted-foreground font-semibold text-[15px]">
            Showing {filteredSubjects.length} {filteredSubjects.length <= 1 ? 'subject' : 'subjects'}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium text-sm">Sort by:</span>
            <div className="relative group cursor-pointer">
              {/* Desktop Sort Dropdown */}
              <div className="hidden sm:flex items-center gap-1 font-bold text-[15px]">
                {sortBy} <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="hidden sm:block absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
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
              
              {/* Mobile Sort Dropdown */}
              <div className="sm:hidden flex items-center relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-[15px] appearance-none pr-6 focus:outline-none relative z-10"
                >
                  {["Popular", "A-Z", "Newest", "Most Lessons"].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-0 z-0 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SUBJECT GRID */}
        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map(subject => {
              const totalLessons = subject.topics.reduce((acc, t) => acc + (t.subtopics.length > 0 ? t.subtopics.length : 1), 0);
              
              const baseSlug = subject.slug.replace(/-class\d+/, '');
              const queryString = searchParams.toString();
              const subjectHref = queryString ? `/subjects/${region}/${level}/${baseSlug}?${queryString}` : `/subjects/${region}/${level}/${baseSlug}`;
              
              return (
                <Link key={subject.id} href={subjectHref} id={baseSlug} className="scroll-mt-24" prefetch={false}>
                  <div 
                    className="group flex flex-col h-full bg-card border border-border rounded-3xl p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden -translate-y-0 hover:-translate-y-1"
                  >
                    {/* Hover Border Accent */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                      style={{ border: `1px solid ${subject.color}` }}
                    />
                    
                    <div className="flex-grow">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: `${subject.color}15`, color: subject.color }}>
                        <SubjectIcon name={subject.icon} className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-foreground transition-colors">
                          {subject.name}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-[14px] font-medium leading-relaxed mb-4 line-clamp-3">
                        {subject.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border mt-auto">
                      <div className="flex items-center gap-4 text-[12px] font-bold text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {subject.topics.length} {subject.topics.length <= 1 ? 'Topic' : 'Topics'}</div>
                        <div className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {totalLessons} {totalLessons <= 1 ? 'Lesson' : 'Lessons'}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">

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
