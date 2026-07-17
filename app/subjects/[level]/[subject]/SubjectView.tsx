"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Activity, Play, Star, ChevronRight, Download, Users, CheckCircle2, Clock } from "lucide-react";
import type { Subject } from "@/lib/curriculum";

export default function SubjectView({ level, subject, isLoggedIn = false }: { level: string, subject: Subject, isLoggedIn?: boolean }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeTermId, setActiveTermId] = useState<string | null>(subject.terms?.[0]?.id || null);

  const totalLessons = subject.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const totalHours = subject.topics.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

  const tabs = ["Overview", "Topics", "Learning Paths", "Popular Lessons", "Resources"];

  // Mock data for placeholders
  const learningPaths = [
    { title: `${subject.name} Foundations`, hours: 18, difficulty: "Beginner" },
    { title: `Advanced ${subject.name}`, hours: 32, difficulty: "Advanced" }
  ];

  const popularLessons = subject.topics.length > 0 
    ? subject.topics[0].subtopics.slice(0, 4)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar Placeholder - hidden if inside dashboard shell */}
      {!isLoggedIn && (
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-50 border-b border-border">
          <Link href="/" className="text-2xl font-bold tracking-tight">Avenpath.</Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/subjects/${level}`} className="hover:text-foreground transition-colors capitalize">{level}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{subject.name}</span>
          </div>
        </nav>
      )}

      {/* HERO SECTION */}
      <section className="bg-card border-b border-border w-full py-20 relative overflow-hidden">
        {/* Subtle background glow based on subject color */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-10 rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: subject.color }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6" style={{ color: subject.color }}>
              {subject.name}
            </h1>
            <p className="text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
              {subject.description}
            </p>
            
            {/* Statistics */}
            <div className="flex flex-wrap items-center gap-8 mb-12">
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-foreground">{subject.topics.length}</span>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Topics</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-foreground">{totalLessons}</span>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Lessons</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-foreground">2</span>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Learning Paths</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-foreground">~{totalHours}h</span>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Estimated</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <button className="bg-foreground text-background px-8 py-4 rounded-full text-[15px] font-bold hover:scale-[1.02] hover:shadow-xl transition-all flex items-center gap-3">
                Start Learning <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-transparent border-2 border-border text-foreground px-8 py-4 rounded-full text-[15px] font-bold hover:border-foreground/30 transition-all flex items-center gap-3">
                Continue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAVIGATION (Sticky Tabs) */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 text-[15px] font-bold whitespace-nowrap transition-colors relative ${activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
        {/* OVERVIEW / ABOUT */}
        {(activeTab === "Overview" || activeTab === "Topics") && (
          <section className="mb-24">
            {/* Term Switcher */}
            {subject.terms && subject.terms.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-10 pb-4 border-b border-border">
                {subject.terms.map(term => (
                  <button
                    key={term.id}
                    onClick={() => setActiveTermId(term.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTermId === term.id ? "bg-foreground text-background shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    {term.name}
                  </button>
                ))}
              </div>
            )}

            {(() => {
              const activeTerm = subject.terms?.find(t => t.id === activeTermId) || subject.terms?.[0];
              const displayTopics = activeTerm ? activeTerm.topics : subject.topics;
              const displayTheme = activeTerm?.theme || "Topics";

              return (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-3xl font-extrabold mb-8">{displayTheme}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayTopics.map((topic, idx) => (
                      <Link key={topic.slug} href={`/subjects/${level}/${subject.slug}/${topic.slug}`}>
                        <div className="group bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-border group-hover:bg-foreground transition-colors duration-300" />
                          
                          <h3 className="text-xl font-bold mb-3">{topic.name}</h3>
                          <p className="text-muted-foreground text-[15px] font-medium mb-8 flex-grow">
                            {topic.description || "Explore this comprehensive topic."}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col gap-1">
                              <span className="text-[13px] font-bold text-muted-foreground">{topic.subtopics.length} Lessons</span>
                              <span className="text-[13px] font-bold text-foreground px-2 py-0.5 bg-muted rounded-md w-fit">
                                {idx === 0 ? "Beginner" : "Intermediate"}
                              </span>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-background" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* LEARNING PATHS */}
        {(activeTab === "Overview" || activeTab === "Learning Paths") && (
          <section className="mb-24">
            <h2 className="text-3xl font-extrabold mb-8">Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map((path, i) => (
                <div key={i} className="flex items-center bg-card border border-border rounded-3xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mr-6 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-8 h-8 text-foreground" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                    <div className="flex items-center gap-4 text-[14px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {path.hours} Hours</span>
                      <span className="px-2 py-1 bg-muted rounded-md text-foreground">{path.difficulty}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* POPULAR LESSONS */}
        {(activeTab === "Overview" || activeTab === "Popular Lessons") && popularLessons.length > 0 && (
          <section className="mb-24">
            <h2 className="text-3xl font-extrabold mb-8">Popular Lessons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularLessons.map((lesson, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <h4 className="font-bold text-[15px] mb-4 line-clamp-2">{lesson.name}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[13px] font-bold text-muted-foreground">
                      <span>12 min</span>
                      <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3.5 h-3.5 fill-current" /> 4.9</span>
                    </div>
                    <Play className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
