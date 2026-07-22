"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Clock, BookOpen, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import type { Subject, Topic } from "@/types/curriculum";

export default function TopicView({ level, subject, topic, completedSlugs = [], isLoggedIn = false }: { level: string, subject: Subject, topic: Topic, completedSlugs?: string[], isLoggedIn?: boolean }) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  
  const levelHref = queryString ? `/subjects/${level}?${queryString}` : `/subjects/${level}`;
  const subjectHref = queryString ? `/subjects/${level}/${subject.slug}?${queryString}` : `/subjects/${level}/${subject.slug}`;
  
  const [activeTab, setActiveTab] = useState("Lessons");
  
  const progress = topic.subtopics.length > 0 
    ? Math.round((completedSlugs.length / topic.subtopics.length) * 100) 
    : 0;
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Bar Navigation */}
      {!isLoggedIn ? (
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-50 bg-background border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Avenpath Logo" className="h-16 w-auto" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis hidden md:flex">
            <Link href="/subjects" className="hover:text-foreground transition-colors shrink-0">Subjects</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link href={levelHref} className="hover:text-foreground transition-colors capitalize shrink-0">{level}</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link href={subjectHref} className="hover:text-foreground transition-colors shrink-0 max-w-[120px] truncate">{subject.name}</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-foreground shrink-0 max-w-[150px] truncate">{topic.name}</span>
          </div>
        </nav>
      ) : (
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis px-8 py-4 max-w-7xl mx-auto w-full">
          <Link href="/subjects" className="hover:text-foreground transition-colors shrink-0">Subjects</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href={levelHref} className="hover:text-foreground transition-colors capitalize shrink-0">{level}</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href={subjectHref} className="hover:text-foreground transition-colors shrink-0 max-w-[120px] truncate">{subject.name}</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-foreground shrink-0 max-w-[150px] truncate">{topic.name}</span>
        </div>
      )}

      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full">
        {/* HERO */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
            {topic.name}
          </h1>
          <p className="text-xl text-muted-foreground font-medium mb-8 leading-relaxed max-w-2xl">
            {topic.description || "Dive deep into this topic with our structured lesson path."}
          </p>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-[15px] font-bold text-muted-foreground bg-muted px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-foreground" />
              <span className="text-foreground">{topic.estimatedHours || 4} hours</span>
            </div>
            
            {/* Progress Bar Mock */}
            <div className="flex items-center gap-4 bg-card border border-border px-4 py-2 rounded-lg">
              <div className="w-32 h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="text-[14px] font-bold">{progress}% Completed</span>
            </div>
          </div>
        </div>

        {/* PREREQUISITES & OUTCOMES */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
              Prerequisites
            </h2>
            {topic.prerequisites && topic.prerequisites.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {topic.prerequisites.map((prereq, idx) => (
                  <div key={idx} className="bg-card border border-border px-4 py-2 rounded-lg text-[14px] font-bold text-muted-foreground">
                    {prereq}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground font-medium bg-muted/50 rounded-xl p-6 border border-border/50">
                No strict prerequisites. You're ready to start!
              </div>
            )}
          </div>
          

        </div>

        {/* SUBTOPIC TIMELINE */}
        <div className="mb-24">
          <h2 className="text-3xl font-extrabold mb-10">Lesson Path</h2>
          
          <div className="relative border-l-2 border-border ml-6 space-y-8 pb-12">
            {topic.subtopics.map((subtopic, idx) => {
              const isCompleted = completedSlugs.includes(subtopic.slug);
              // Find first uncompleted lesson as the "current" one. If all completed, last one is current? Or none?
              // Let's just say a lesson is "current" if it's the first one in the array that is not completed.
              const firstUncompletedIdx = topic.subtopics.findIndex(s => !completedSlugs.includes(s.slug));
              const isCurrent = idx === firstUncompletedIdx;
              
              // No actual locking logic required for now, we just visually show what is completed/current
              const isLocked = false;
              const subtopicHref = queryString 
                ? `/subjects/${level}/${subject.slug}/${topic.slug}/${subtopic.slug}?${queryString}`
                : `/subjects/${level}/${subject.slug}/${topic.slug}/${subtopic.slug}`;

              return (
                <Link key={subtopic.slug} href={subtopicHref} className="block group">
                  <div className="relative pl-10 flex items-center">
                    {/* Timeline Node */}
                    <div className={`absolute -left-[11px] w-[20px] h-[20px] rounded-full border-4 border-background transition-colors ${
                      isCompleted ? "bg-foreground" : 
                      isCurrent ? "bg-foreground" : "bg-muted-foreground/30"
                    }`} />
                    
                    {/* Card */}
                    <div className={`flex-grow flex items-center justify-between p-6 rounded-2xl border transition-all ${
                      isCurrent 
                        ? "bg-card border-foreground/30 shadow-lg" 
                        : "bg-background border-border group-hover:border-foreground/20 group-hover:bg-card"
                    }`}>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Lesson {idx + 1}
                        </div>
                        <h3 className={`text-lg font-bold transition-colors ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                          {subtopic.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted transition-colors">
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-foreground" />}
                        {isCurrent && <ArrowRight className="w-5 h-5 text-foreground" />}
                        {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Topic Quiz Node */}
            <div className="relative pl-10 flex items-center mt-8">
              <div className="absolute -left-[15px] w-[28px] h-[28px] rounded-full border-4 border-background bg-blue-500 flex items-center justify-center">
                 <div className="w-2.5 h-2.5 rounded-full bg-background"></div>
              </div>
              <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 shadow-sm">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">End of Topic Assessment</div>
                  <h3 className="text-lg font-extrabold text-foreground">{topic.name} Quiz</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">Test your recall across all lessons in this topic with an instant 20-question MCQ Quiz.</p>
                </div>
                <Link 
                  href={`/take-test?mode=quiz`}
                  className="bg-foreground text-background font-extrabold text-xs px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
                >
                  Take Topic Quiz <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
