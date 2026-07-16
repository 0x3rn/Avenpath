"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, Bookmark, Share2, Moon, Sun, Clock, BookOpen, 
  AlertTriangle, Lightbulb, Info, CheckCircle2, XCircle, ArrowRight,
  List, Check, Search, Download
} from "lucide-react";
import type { Subject, Topic, Subtopic } from "@/lib/curriculum";

export default function LessonView({ 
  level, 
  subject, 
  topic,
  lesson
}: { 
  level: string, 
  subject: Subject, 
  topic: Topic,
  lesson: Subtopic
}) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  // Mock progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-background text-foreground' : 'bg-white text-slate-900'}`}>
      
      {/* READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 h-1 bg-muted w-full z-[60]">
        <div className="h-full bg-foreground transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* TOP BAR */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground overflow-x-auto hide-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-foreground">Avenpath.</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href={`/subjects/${level}/${subject.slug}`} className="hover:text-foreground">{subject.name}</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href={`/subjects/${level}/${subject.slug}/${topic.slug}`} className="hover:text-foreground">{topic.name}</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-foreground">{lesson.name}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={() => window.dispatchEvent(new Event("open-search"))} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={() => setIsBookmarked(!isBookmarked)} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-foreground text-foreground" : ""}`} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="flex-grow max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row px-4 md:px-8 py-8 gap-12">
        
        {/* LEFT SIDEBAR (Navigation) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Course Progress</h3>
              <div className="flex items-center justify-between text-sm font-bold mb-2">
                <span>14% Complete</span>
                <span>2/14 Lessons</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full w-[14%]" />
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Current Topic</h3>
            <ul className="space-y-2">
              {topic.subtopics.map((sub, idx) => {
                const isActive = sub.slug === lesson.slug;
                const isCompleted = idx === 0;
                return (
                  <li key={sub.slug}>
                    <Link href={`/subjects/${level}/${subject.slug}/${topic.slug}/${sub.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isActive ? "bg-muted text-foreground font-bold" : "text-muted-foreground hover:bg-muted/50 font-medium"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1.5 ${isActive ? "bg-foreground" : "bg-border"}`} />
                      )}
                      <span className="text-sm truncate">{sub.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* CENTER CONTENT (The Lesson) */}
        <main className="flex-grow max-w-3xl min-w-0">
          
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.15]">
              {lesson.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold">
              <div className="flex items-center gap-2 bg-muted text-muted-foreground px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4" /> 15 mins
              </div>
              <div className="flex items-center gap-2 bg-muted text-muted-foreground px-3 py-1.5 rounded-lg">
                <BookOpen className="w-4 h-4" /> Beginner
              </div>
            </div>
          </header>

          {/* Article Content - MOCK DATA */}
          <article className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-[1.8] font-medium text-[17px]">
            <p>
              Welcome to the first core lesson of <strong>{topic.name}</strong>. In this module, we will explore the foundational principles that govern the subject and build intuition for complex scenarios you'll face later on.
            </p>
            
            <h2 className="text-2xl font-extrabold text-foreground mt-12 mb-6">Understanding the Basics</h2>
            <p>
              The most critical aspect of mastering this subject is recognizing patterns. Below is a formalized definition of the core concept.
            </p>

            {/* INFO BLOCKS */}
            <div className="my-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-blue-500 font-bold mb-3">
                <Info className="w-5 h-5" /> DEFINITION
              </div>
              <p className="text-foreground m-0">
                <strong>{lesson.name}</strong> refers to the fundamental structure underlying the observable phenomena within {subject.name}. It provides a predictive model for future interactions.
              </p>
            </div>

            <p>
              With the definition out of the way, let's look at how this applies in the real world. Many students mistakenly assume that theoretical definitions don't map cleanly to practical examples.
            </p>

            <div className="my-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-yellow-500 font-bold mb-3">
                <AlertTriangle className="w-5 h-5" /> COMMON MISTAKE
              </div>
              <p className="text-foreground m-0">
                Do not confuse correlation with causation when analyzing these systems. Just because two variables move together does not mean one causes the other.
              </p>
            </div>

            <h2 className="text-2xl font-extrabold text-foreground mt-12 mb-6">Interactive Example</h2>
            <p>
              Let's walk through a step-by-step example. Try to identify the correct output before continuing.
            </p>

            {/* Mock Interactive Widget */}
            <div className="my-8 border border-border rounded-2xl overflow-hidden">
              <div className="bg-muted px-6 py-4 border-b border-border flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">Example 1.1</span>
                <span className="text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded">Interactive</span>
              </div>
              <div className="p-8 bg-card flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-mono text-foreground font-bold mb-6">
                  f(x) = 2x + 3
                </div>
                <button className="bg-foreground text-background px-6 py-3 rounded-full text-sm font-bold hover:scale-[1.02] transition-transform">
                  Reveal Solution
                </button>
              </div>
            </div>

            <div className="my-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-green-500 font-bold mb-3">
                <Lightbulb className="w-5 h-5" /> REMEMBER
              </div>
              <p className="text-foreground m-0">
                The core principle always holds true in a closed system.
              </p>
            </div>

            {/* KNOWLEDGE CHECK (Mini Quiz) */}
            <div className="my-16 border-2 border-border rounded-3xl p-8">
              <h3 className="text-xl font-extrabold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-foreground" /> Knowledge Check
              </h3>
              <p className="text-sm font-medium mb-8">Test your understanding before moving on.</p>

              <div className="space-y-4">
                <div className="font-bold text-foreground text-lg mb-4">What is the primary function of {lesson.name}?</div>
                
                {[
                  "To predict unpredictable outcomes.",
                  "To provide a structured model for observable phenomena.",
                  "To confuse students.",
                  "None of the above."
                ].map((option, idx) => {
                  const isSelected = quizAnswer === idx;
                  const isCorrect = idx === 1;
                  const showResult = quizAnswer !== null && isSelected;

                  return (
                    <button 
                      key={idx}
                      onClick={() => setQuizAnswer(idx)}
                      disabled={quizAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex items-center justify-between ${
                        showResult && isCorrect ? "border-green-500 bg-green-500/10 text-green-500" :
                        showResult && !isCorrect ? "border-red-500 bg-red-500/10 text-red-500" :
                        isSelected ? "border-foreground" : "border-border hover:border-foreground/30 text-foreground bg-card"
                      }`}
                    >
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                      {showResult && !isCorrect && <XCircle className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUMMARY */}
            <h2 className="text-2xl font-extrabold text-foreground mt-12 mb-6">Summary</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground font-medium">
              <li>{lesson.name} is the foundation of {topic.name}.</li>
              <li>Always check for common mistakes like correlation vs causation.</li>
              <li>The rule applies strictly to closed systems.</li>
            </ul>

          </article>

          {/* BOTTOM NAVIGATION */}
          <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row gap-6 items-center justify-between">
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-border bg-card text-foreground font-bold hover:bg-muted transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" /> Previous Lesson
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-bold hover:scale-[1.02] transition-transform shadow-xl">
              Next Lesson <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </main>

        {/* RIGHT SIDEBAR (TOC & Resources) */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <List className="w-4 h-4" /> Table of Contents
            </h3>
            <ul className="space-y-3 border-l-2 border-border pl-4">
              <li><a href="#" className="text-sm font-bold text-foreground">Understanding the Basics</a></li>
              <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Interactive Example</a></li>
              <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Knowledge Check</a></li>
              <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Summary</a></li>
            </ul>

            <div className="mt-12">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Resources</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-foreground/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground line-clamp-1">Lesson Notes</div>
                    <div className="text-xs font-medium text-muted-foreground">PDF • 1.2 MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
