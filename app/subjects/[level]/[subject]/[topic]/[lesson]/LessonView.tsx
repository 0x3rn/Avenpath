"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  ChevronRight, Bookmark, Share2, Moon, Sun, Clock, BookOpen, 
  AlertTriangle, Lightbulb, Info, CheckCircle2, XCircle, ArrowRight,
  List, Check, Search, Download
} from "lucide-react";
import type { Subject, Topic, Subtopic } from "@/types/curriculum";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LessonView({ 
  level, 
  subject, 
  topic,
  lesson,
  completedSlugs = []
}: { 
  level: string, 
  subject: Subject, 
  topic: Topic,
  lesson: Subtopic,
  completedSlugs?: string[]
}) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  
  const levelHref = queryString ? `/subjects/${level}?${queryString}` : `/subjects/${level}`;
  const subjectHref = queryString ? `/subjects/${level}/${subject.slug}?${queryString}` : `/subjects/${level}/${subject.slug}`;
  const topicHref = queryString ? `/subjects/${level}/${subject.slug}/${topic.slug}?${queryString}` : `/subjects/${level}/${subject.slug}/${topic.slug}`;

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
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis hidden md:flex">
          <Link href="/subjects" className="hover:text-foreground transition-colors shrink-0">Subjects</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href={levelHref} className="hover:text-foreground transition-colors capitalize shrink-0">{level}</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href={subjectHref} className="hover:text-foreground transition-colors shrink-0 max-w-[120px] truncate">{subject.name}</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href={topicHref} className="hover:text-foreground transition-colors shrink-0 max-w-[120px] truncate">{topic.name}</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-foreground shrink-0 max-w-[150px] truncate">{lesson.name}</span>
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
                <span>{topic.subtopics.length > 0 ? Math.round((completedSlugs.length / topic.subtopics.length) * 100) : 0}% Complete</span>
                <span>{completedSlugs.length}/{topic.subtopics.length} Lessons</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${topic.subtopics.length > 0 ? (completedSlugs.length / topic.subtopics.length) * 100 : 0}%` }} />
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Current Topic</h3>
            <ul className="space-y-2">
              {topic.subtopics.map((sub, idx) => {
                const isActive = sub.slug === lesson.slug;
                const isCompleted = completedSlugs.includes(sub.slug);
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
                <Clock className="w-4 h-4" /> {Math.max(1, Math.ceil((lesson.content?.split(' ').length || 0) / 200))} mins
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-[1.8] font-medium text-[17px]">
            {lesson.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.content}
              </ReactMarkdown>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground mb-0">This lesson is currently being drafted.</p>
              </div>
            )}
            
            {/* KNOWLEDGE CHECK (Mini Quiz) */}
            {(lesson as any).quizzes && (lesson as any).quizzes.length > 0 && (
              <div className="my-16 border-2 border-border rounded-3xl p-8">
                <h3 className="text-xl font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-foreground" /> Knowledge Check
                </h3>
                <p className="text-sm font-medium mb-8">Test your understanding before moving on.</p>

                {((lesson as any).quizzes[0].questions || []).map((q: any, i: number) => (
                  <div key={i} className="mb-8">
                    <div className="font-bold text-foreground text-lg mb-4">{q.questionText}</div>
                    <div className="space-y-4">
                      {q.options.map((option: string, idx: number) => {
                        const isSelected = quizAnswer === idx;
                        const isCorrect = idx === q.correctAnswer;
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
                ))}
              </div>
            )}
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


          </div>
        </aside>

      </div>
    </div>
  );
}
