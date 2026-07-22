"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, Activity, Play, Star, ChevronRight, Download, Users, CheckCircle2, Clock, ChevronDown, Award, FileCheck } from "lucide-react";
import type { Subject } from "@/types/curriculum";
import { SaveSubjectButton } from "./SaveSubjectButton";

export default function SubjectView({ level, subjects, isLoggedIn = false, isSaved = false }: { level: string, subjects: Subject[], isLoggedIn?: boolean, isSaved?: boolean }) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const levelHref = queryString ? `/subjects/${level}?${queryString}` : `/subjects/${level}`;
  
  const availableClasses = subjects.map(s => s.className).filter(Boolean);
  const hasClasses = availableClasses.length > 0;
  
  // Custom sort to ensure Class 1, Class 2, Class 3 order
  if (hasClasses) {
    availableClasses.sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, '')) || 0;
      const bNum = parseInt(b.replace(/\D/g, '')) || 0;
      return aNum - bNum;
    });
  }

  const [activeClass, setActiveClass] = useState<string | null>(hasClasses ? availableClasses[0] : null);
  const subject = activeClass ? subjects.find(s => s.className === activeClass) || subjects[0] : subjects[0];

  const [activeTab, setActiveTab] = useState("Overview");
  const [activeTermId, setActiveTermId] = useState<string | null>(subject.terms?.[0]?.id || null);

  const totalLessons = subject.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const totalHours = subject.topics.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

  const tabs = ["Overview", "Topics"];

  const popularLessons = subject.topics.length > 0 
    ? subject.topics[0].subtopics.slice(0, 4)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar */}
      {!isLoggedIn ? (
        <nav className="sticky top-0 flex items-center justify-between px-8 h-20 max-w-7xl mx-auto w-full z-40 bg-background border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Avenpath Logo" className="h-16 w-auto" />
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/subjects/${level}`} className="hover:text-foreground transition-colors capitalize">{level}</Link>
            <ChevronRight className="w-4 h-4" />
            {subject.category && subject.categoryName && (
              <>
                <Link href={`/subjects/${level}?category=${subject.category}#${subject.slug.replace(/-class\d+/, '')}`} className="hover:text-foreground transition-colors">
                  {subject.categoryName}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-foreground">{subject.name}</span>
          </div>
        </nav>
      ) : (
        <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground px-8 py-4 max-w-7xl mx-auto w-full">
          <Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/subjects/${level}`} className="hover:text-foreground transition-colors capitalize">{level}</Link>
          <ChevronRight className="w-4 h-4" />
          {subject.category && subject.categoryName && (
            <>
              <Link href={`/subjects/${level}?category=${subject.category}#${subject.slug.replace(/-class\d+/, '')}`} className="hover:text-foreground transition-colors">
                {subject.categoryName}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-foreground">{subject.name}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section 
        className="border-b border-border w-full py-20 relative overflow-hidden"
        style={{ backgroundColor: `${subject.color}0A` }}
      >
        
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
                <span className="text-3xl font-extrabold text-foreground">~{totalHours}h</span>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Estimated</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <button className="bg-foreground text-background px-8 py-4 rounded-full text-[15px] font-bold hover:scale-[1.02] hover:shadow-xl transition-all flex items-center gap-3">
                Start Learning <ArrowRight className="w-5 h-5" />
              </button>
              {isLoggedIn && (
                <SaveSubjectButton subjectId={subject.slug} initialSaved={isSaved} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAVIGATION (Sticky Tabs) */}
      <div className={`sticky ${isLoggedIn ? 'top-40' : 'top-20'} z-30 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm`}>
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
            {/* Class Switcher */}
            {hasClasses && availableClasses.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {availableClasses.map(cls => (
                  <button
                    key={cls}
                    onClick={() => {
                      setActiveClass(cls);
                      const newSubject = subjects.find(s => s.className === cls) || subjects[0];
                      setActiveTermId(newSubject.terms?.[0]?.id || null);
                    }}
                    className={`px-6 py-2 rounded-xl text-[15px] font-bold transition-all ${activeClass === cls ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            )}

            {/* Term Switcher */}
            {subject.terms && subject.terms.length > 0 && (
              <div className="mb-10 pb-4 border-b border-border">
                {/* Mobile Dropdown */}
                <div className="sm:hidden w-full relative">
                  <select 
                    value={activeTermId || ""}
                    onChange={(e) => setActiveTermId(e.target.value)}
                    className="w-full bg-card border-2 border-border text-foreground font-bold rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-foreground transition-colors"
                  >
                    {subject.terms.map(term => (
                      <option key={term.id} value={term.id}>{term.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden sm:flex flex-wrap items-center gap-3">
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
                    {displayTopics.map((topic, idx) => {
                      const topicHref = queryString 
                        ? `/subjects/${level}/${subject.slug}/${topic.slug}?${queryString}`
                        : `/subjects/${level}/${subject.slug}/${topic.slug}`;
                      
                      return (
                      <Link key={topic.slug} href={topicHref}>
                        <div 
                          className="group border border-border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden"
                          style={{ backgroundColor: `${subject.color}05` }}
                        >
                          <h3 className="text-xl font-bold mb-3">{topic.name}</h3>
                          <p className="text-muted-foreground text-[15px] font-medium mb-8 flex-grow">
                            {topic.description || "Explore this comprehensive topic."}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col gap-3">
                              <span className="text-[13px] font-bold text-muted-foreground">{topic.subtopics.length} Lessons</span>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-background" />
                            </div>
                          </div>
                        </div>
                      </Link>
                      );
                    })}
                  </div>

                  {/* End of Module Test Card */}
                  <div className="mt-12 p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-extrabold uppercase tracking-wider mb-2">
                        <FileCheck className="w-3.5 h-3.5" /> End of Module Assessment
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground">{activeTerm?.name || "Module"} Test</h3>
                      <p className="text-sm font-semibold text-muted-foreground mt-1">
                        Evaluate your overall mastery across all topics in this module with a 20-question comprehensive test.
                      </p>
                    </div>
                    <Link
                      href="/take-test?mode=test"
                      className="bg-foreground text-background font-extrabold text-sm px-8 py-4 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shrink-0 shadow-lg"
                    >
                      Take Module Test <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* CONDITIONAL EXAM CARDS */}
                  {(() => {
                    const termsList = subject.terms || [];
                    const activeIndex = termsList.findIndex(t => t.id === activeTerm?.id);
                    const isLastModule = activeIndex === termsList.length - 1 && termsList.length > 0;
                    const hasRangeExam = (activeTerm as any)?.hasExam || (activeTerm as any)?.placedExam || false;

                    if (isLastModule) {
                      return (
                        <div className="mt-6 p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-2">
                              <Award className="w-3.5 h-3.5" /> Official Final Course Exam
                            </div>
                            <h3 className="text-2xl font-extrabold text-foreground">{subject.name} Final Exam</h3>
                            <p className="text-sm font-semibold text-muted-foreground mt-1">
                              Official 50-Question Final Examination testing all concepts across the entire subject curriculum.
                            </p>
                          </div>
                          <Link
                            href="/take-exam"
                            className="bg-amber-500 text-black font-extrabold text-sm px-8 py-4 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shrink-0 shadow-lg"
                          >
                            Take Final Course Exam <Award className="w-5 h-5" />
                          </Link>
                        </div>
                      );
                    }

                    if (hasRangeExam) {
                      return (
                        <div className="mt-6 p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-2">
                              <Award className="w-3.5 h-3.5" /> Milestone Range Exam
                            </div>
                            <h3 className="text-2xl font-extrabold text-foreground">Exam for Completed Modules So Far</h3>
                            <p className="text-sm font-semibold text-muted-foreground mt-1">
                              Official 50-Question Range Exam covering all lesson notes from start module through {activeTerm?.name}.
                            </p>
                          </div>
                          <Link
                            href="/take-exam"
                            className="bg-amber-500 text-black font-extrabold text-sm px-8 py-4 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shrink-0 shadow-lg"
                          >
                            Take Range Exam <Award className="w-5 h-5" />
                          </Link>
                        </div>
                      );
                    }

                    return null; // Intermediate modules without placed range exams show NO exam card!
                  })()}
                </div>
              );
            })()}
          </section>
        )}



      </main>
    </div>
  );
}
