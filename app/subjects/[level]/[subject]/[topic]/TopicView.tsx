"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Clock, BookOpen, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import type { Subject, Topic } from "@/lib/curriculum";

export default function TopicView({ level, subject, topic }: { level: string, subject: Subject, topic: Topic }) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  
  const levelHref = queryString ? `/subjects/${level}?${queryString}` : `/subjects/${level}`;
  const subjectHref = queryString ? `/subjects/${level}/${subject.slug}?${queryString}` : `/subjects/${level}/${subject.slug}`;
  
  const [activeTab, setActiveTab] = useState("Lessons");
  
  // Mock data for UI presentation based on the spec
  const progress = 14;
  const learningOutcomes = [
    "Understand the core principles",
    "Apply concepts to real-world scenarios",
    "Analyze case studies",
    "Master the terminology"
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Bar Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-50 border-b border-border">
        <Link href="/" className="text-2xl font-bold tracking-tight">Avenpath.</Link>
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
          
          <div>
            <h2 className="text-xl font-extrabold mb-6">Learning Outcomes</h2>
            <ul className="space-y-4">
              {learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                  <span className="text-[15px] font-medium text-muted-foreground">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SUBTOPIC TIMELINE */}
        <div className="mb-24">
          <h2 className="text-3xl font-extrabold mb-10">Lesson Path</h2>
          
          <div className="relative border-l-2 border-border ml-6 space-y-8 pb-12">
            {topic.subtopics.map((subtopic, idx) => {
              const isCompleted = idx === 0;
              const isCurrent = idx === 1;
              const isLocked = idx > 1;
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

            {/* Mastery Quiz Node */}
            <div className="relative pl-10 flex items-center mt-8">
              <div className="absolute -left-[15px] w-[28px] h-[28px] rounded-full border-4 border-background bg-muted-foreground/20 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-background"></div>
              </div>
              <div className="flex-grow flex items-center justify-between p-6 rounded-2xl border border-dashed border-border bg-transparent">
                <div>
                  <h3 className="text-lg font-bold text-muted-foreground">Mastery Quiz</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Unlock by completing all lessons</p>
                </div>
                <Lock className="w-5 h-5 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
