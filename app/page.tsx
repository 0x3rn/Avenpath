"use client";

import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { ArrowRight, BookOpen, Star, Clock, Bookmark, Play, CheckCircle2, Search, LogIn, Calculator, Atom, FlaskConical, Globe, ScrollText, Code, LineChart, TrendingUp, ChevronRight, Library, Beaker, Map } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getHomepageStats } from "@/app/actions/marketing";
import Image from "next/image";

// --- Custom CountUp Component ---
function Counter({ from, to, duration = 2 }: { from: number, to: number, duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toLocaleString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [inView, from, to, duration]);

  return <span ref={ref}>{from}</span>;
}

// --- Subject Chip Component (Desktop Hero) ---
function SubjectChip({ name, topics, colorCls, bgCls, delay }: { name: string, topics: string[], colorCls: string, bgCls: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [0, -3, 0] }}
      transition={{ 
        opacity: { delay, duration: 0.8 },
        y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay }
      }}
      className="group cursor-pointer relative w-full"
    >
      <div className="bg-card/90 backdrop-blur-sm rounded-3xl border border-border shadow-sm group-hover:shadow-xl transition-all duration-300 px-6 h-20 flex items-center w-full">
        <h3 className={`text-foreground font-bold text-lg transition-colors ${colorCls.replace('text-', 'group-hover:text-')}`}>{name}</h3>
        
        {/* Hover Reveal Topics */}
        <div className="absolute left-1/2 -translate-x-1/2 w-52 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50 top-full pt-3">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-xl">
            <ul className="space-y-3 mb-4">
              {topics.map(topic => (
                <li key={topic} className="text-[15px] font-medium leading-[1.6] text-muted-foreground flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${bgCls}`}></div>
                  {topic}
                </li>
              ))}
            </ul>
            <div className={`text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all ${colorCls}`}>
              Open Subject <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ subjects: 0, topics: 0, lessons: 0, questions: 0, studyHours: 0 });

  useEffect(() => {
    setMounted(true);
    getHomepageStats().then(data => {
      if (data) setStats(data);
    });
  }, []);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-subject-math/20">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Avenpath Logo" className="h-24 w-auto" />
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => window.dispatchEvent(new Event("open-search"))} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-4 h-4" />
            <span className="text-[15px] font-semibold">Search <kbd className="hidden md:inline-block ml-2 text-xs bg-muted px-1.5 py-0.5 rounded border border-border">⌘K</kbd></span>
          </button>
          <Link href="/login" className="flex items-center gap-2 text-foreground hover:text-subject-math transition-colors">
            <LogIn className="w-4 h-4" />
            <span className="text-[15px] font-semibold">Login</span>
          </Link>
        </div>
      </nav>

      <main className="flex-grow">
        {/* SECTION 1: Floating Library Hero (Desktop Grid & Mobile Carousel) */}
        <section className="relative w-full min-h-[100svh] md:h-[100vh] md:min-h-[850px] flex flex-col items-center justify-start pt-32 md:pt-[22vh] border-b border-border overflow-hidden bg-background">
          
          {/* Desktop Layout (CSS Grid Safe Zone, >= 1280px) */}
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="hidden xl:grid grid-cols-[1fr_minmax(auto,640px)_1fr] gap-8 items-center h-full w-full max-w-[1920px] mx-auto px-8 absolute inset-0 z-30 pointer-events-none">
            {/* Left Column */}
            {mounted && (
              <div className="flex flex-col justify-between h-full py-32 w-[340px] justify-self-end pointer-events-auto">
                <div className="w-64 self-start"><SubjectChip name="Mathematics" topics={["Algebra", "Geometry", "Calculus"]} colorCls="text-subject-math" bgCls="bg-subject-math" delay={0.1} /></div>
                <div className="w-64 self-end mt-32"><SubjectChip name="Physics" topics={["Mechanics", "Optics", "Quantum"]} colorCls="text-subject-physics" bgCls="bg-subject-physics" delay={0.4} /></div>
                <div className="w-64 self-start"><SubjectChip name="History" topics={["World War II", "Rome", "Ancient"]} colorCls="text-subject-history" bgCls="bg-subject-history" delay={0.2} /></div>
              </div>
            )}
            
            {/* Center Column Safe Zone */}
            <div className="h-full"></div>

            {/* Right Column */}
            {mounted && (
              <div className="flex flex-col justify-between h-full py-32 w-[340px] justify-self-start pointer-events-auto">
                 <div className="w-64 self-end"><SubjectChip name="Biology" topics={["Cells", "Genetics", "Evolution"]} colorCls="text-subject-biology" bgCls="bg-subject-biology" delay={0.3} /></div>
                 <div className="w-64 self-start mt-32"><SubjectChip name="Chemistry" topics={["Organic", "Physical", "Inorganic"]} colorCls="text-subject-chemistry" bgCls="bg-subject-chemistry" delay={0.6} /></div>
                 <div className="w-64 self-end"><SubjectChip name="Computer Science" topics={["Algorithms", "AI", "Data"]} colorCls="text-subject-cs" bgCls="bg-subject-cs" delay={0.5} /></div>
              </div>
            )}
          </motion.div>

          {/* Narrower Desktop Layout (4 cards, 768px - 1280px) */}
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="hidden md:grid xl:hidden grid-cols-[1fr_minmax(auto,640px)_1fr] gap-4 items-center h-full w-full max-w-[1920px] mx-auto px-4 absolute inset-0 z-30 pointer-events-none">
             {/* Left Column */}
            {mounted && (
              <div className="flex flex-col justify-around h-full py-40 w-[300px] justify-self-end pointer-events-auto">
                <div className="w-64 self-start"><SubjectChip name="Mathematics" topics={["Algebra", "Geometry", "Calculus"]} colorCls="text-subject-math" bgCls="bg-subject-math" delay={0.1} /></div>
                <div className="w-64 self-end"><SubjectChip name="English" topics={["Shakespeare", "Poetry"]} colorCls="text-subject-english" bgCls="bg-subject-english" delay={0.4} /></div>
              </div>
            )}
            
            <div className="h-full"></div>

            {/* Right Column */}
            {mounted && (
              <div className="flex flex-col justify-around h-full py-40 w-[300px] justify-self-start pointer-events-auto">
                 <div className="w-64 self-end"><SubjectChip name="Biology" topics={["Cells", "Genetics", "Evolution"]} colorCls="text-subject-biology" bgCls="bg-subject-biology" delay={0.3} /></div>
                 <div className="w-64 self-start"><SubjectChip name="Chemistry" topics={["Organic", "Physical", "Inorganic"]} colorCls="text-subject-chemistry" bgCls="bg-subject-chemistry" delay={0.6} /></div>
              </div>
            )}
          </motion.div>

          <div className="relative z-20 flex flex-col items-center text-center px-4 w-full md:max-w-4xl mx-auto md:mb-12 pointer-events-none pt-12 md:pt-0">
            <motion.div style={{ opacity: heroOpacity, y: heroY }} className="pointer-events-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="w-full"
              >
                <div className="w-16 h-[2px] bg-subject-math mx-auto mb-10 hidden md:block"></div>
                <h1 className="text-[40px] md:text-[56px] lg:text-[72px] text-foreground font-extrabold leading-[1.05] lg:leading-[0.95] tracking-[-0.03em] lg:tracking-[-0.04em] mb-8">
                  Knowledge,<br />organized <i className="text-muted-foreground">beautifully.</i>
                </h1>
                <p className="text-[17px] md:text-[19px] lg:text-[20px] text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-[1.7] lg:leading-[1.75]">
                  Explore thousands of topics, lessons, and practice questions in a distraction-free, colorful environment.
                </p>
                <Link href="/subjects" className="w-fit bg-foreground text-background px-10 py-5 rounded-full text-[15px] md:text-base font-bold hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto group">
                  Start Learning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Snap Carousel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full mt-16 md:hidden relative z-20 pointer-events-auto"
          >
             <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 pb-8 gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {[
                  { name: "Mathematics", topics: ["Algebra", "Geometry"], colorCls: "text-subject-math", bgCls: "bg-subject-math" },
                  { name: "Biology", topics: ["Cells", "Genetics"], colorCls: "text-subject-biology", bgCls: "bg-subject-biology" },
                  { name: "Chemistry", topics: ["Organic", "Physical"], colorCls: "text-subject-chemistry", bgCls: "bg-subject-chemistry" },
                  { name: "Physics", topics: ["Mechanics", "Optics"], colorCls: "text-subject-physics", bgCls: "bg-subject-physics" }
                ].map((subj) => (
                  <div key={subj.name} className="snap-center shrink-0 w-[280px]">
                    <div className="bg-card/90 backdrop-blur-sm rounded-3xl border border-border shadow-sm px-6 py-5 cursor-pointer hover:shadow-md transition-shadow">
                      <h3 className={`text-foreground font-bold text-lg mb-3 ${subj.colorCls}`}>{subj.name}</h3>
                      <ul className="space-y-2 mb-4">
                        {subj.topics.map(topic => (
                          <li key={topic} className="text-[15px] font-medium leading-[1.6] text-muted-foreground flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${subj.bgCls}`}></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                      <div className={`text-xs font-bold flex items-center gap-1 ${subj.colorCls}`}>
                        Open Subject <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="snap-center shrink-0 w-6"></div>
             </div>
          </motion.div>
        </section>

        {/* SECTION 2: Explore by Subject (Very light gray background) */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-32 pb-24 md:pt-48 md:pb-32 px-4 md:px-8 bg-zinc-50 border-b border-border"
        >  
          <div className="max-w-7xl mx-auto relative z-30">
            <div className="w-12 h-1 bg-subject-math mb-6"></div>
            <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold leading-[1.15] mb-20 text-foreground">Explore by Subject</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "MATHEMATICS", icon: Calculator, count: 217, topics: ["Algebra", "Geometry", "Calculus"], desc: "Master numbers, space, and structure.", color: "text-subject-math", bg: "bg-subject-math", border: "hover:border-subject-math", bgBadge: "bg-subject-math/[0.03]" },
                { name: "BIOLOGY", icon: Atom, count: 184, topics: ["Cells", "Genetics", "Evolution"], desc: "Explore the fascinating science of life.", color: "text-subject-biology", bg: "bg-subject-biology", border: "hover:border-subject-biology", bgBadge: "bg-subject-biology/[0.03]" },
                { name: "CHEMISTRY", icon: FlaskConical, count: 156, topics: ["Organic", "Inorganic", "Physical"], desc: "Understand the matter that makes our universe.", color: "text-subject-chemistry", bg: "bg-subject-chemistry", border: "hover:border-subject-chemistry", bgBadge: "bg-subject-chemistry/[0.03]" },
                { name: "PHYSICS", icon: Atom, count: 198, topics: ["Mechanics", "Thermodynamics", "Quantum"], desc: "Learn the fundamental laws of nature.", color: "text-subject-physics", bg: "bg-subject-physics", border: "hover:border-subject-physics", bgBadge: "bg-subject-physics/[0.03]" },
                { name: "COMPUTER SCIENCE", icon: Code, count: 420, topics: ["Algorithms", "Data Structures", "AI"], desc: "Build the systems that power the future.", color: "text-subject-cs", bg: "bg-subject-cs", border: "hover:border-subject-cs", bgBadge: "bg-subject-cs/[0.03]" },
                { name: "HISTORY", icon: ScrollText, count: 312, topics: ["Ancient", "Medieval", "Modern"], desc: "Discover the stories that shaped humanity.", color: "text-subject-history", bg: "bg-subject-history", border: "hover:border-subject-history", bgBadge: "bg-subject-history/[0.03]" },
                { name: "MEDICINE", icon: Beaker, count: 412, topics: ["Neuroanatomy", "Physiology", "Pathology"], desc: "Understand the human body and health.", color: "text-subject-biology", bg: "bg-subject-biology", border: "hover:border-subject-biology", bgBadge: "bg-subject-biology/[0.03]" },
                { name: "ENGINEERING", icon: Calculator, count: 355, topics: ["Statics", "Circuits", "Fluids"], desc: "Design and build the future.", color: "text-subject-physics", bg: "bg-subject-physics", border: "hover:border-subject-physics", bgBadge: "bg-subject-physics/[0.03]" },
                { name: "LAW", icon: Library, count: 284, topics: ["Contracts", "Criminal Law", "Torts"], desc: "Navigate the justice and legal systems.", color: "text-subject-history", bg: "bg-subject-history", border: "hover:border-subject-history", bgBadge: "bg-subject-history/[0.03]" }
              ].map(subject => (
                <div key={subject.name} className={`bg-card border border-border rounded-3xl p-8 hover:-translate-y-2 shadow-sm hover:shadow-xl transition-all duration-400 group cursor-pointer relative overflow-hidden ${subject.border}`}>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Solid Icon Background */}
                      <div className={`p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${subject.bg}`}>
                        <subject.icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    {/* Tinted Badge - Reduced saturation */}
                    <span className={`text-xs font-bold px-4 py-2 rounded-full tracking-wider ${subject.bgBadge} ${subject.color}`}>
                      {subject.count} TOPICS
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg tracking-widest text-foreground mb-4 relative z-10">{subject.name}</h3>
                  <p className="text-muted-foreground text-[15px] font-medium leading-[1.6] mb-8">{subject.desc}</p>
                  
                  <div className={`h-[1px] w-full bg-border mb-6 transition-colors relative z-10 group-hover:${subject.bgBadge}`}></div>
                  
                  <ul className="space-y-4 mb-10 relative z-10">
                    {subject.topics.map(topic => (
                      <li key={topic} className="text-[15px] font-medium leading-[1.6] text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${subject.bg}`}></div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Explore Link - Neutral until hover */}
                  <div className={`font-bold flex items-center gap-2 transition-all relative z-10 uppercase tracking-widest text-xs text-muted-foreground ${subject.color.replace('text-', 'group-hover:text-')}`}>
                    Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
  
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* SECTION 3: Guided Paths (White background) */}
        <section className="py-32 md:py-48 bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="w-12 h-1 bg-subject-math mb-6 mx-auto"></div>
            <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold leading-[1.15] mb-20 text-center text-foreground">Guided Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              
              {[
                { title: "Learn Web Development", steps: ["HTML", "CSS", "JavaScript", "React", "Next.js"], colorCls: "text-subject-math", groupHoverColorCls: "group-hover:text-subject-math", groupHoverCls: "group-hover/path:bg-subject-math/20", groupHoverBorder: "group-hover:border-subject-math", groupHoverBg: "group-hover:bg-subject-math" },
                { title: "Become a Data Analyst", steps: ["Statistics", "Excel", "SQL", "Python", "Power BI"], colorCls: "text-subject-math", groupHoverColorCls: "group-hover:text-subject-math", groupHoverCls: "group-hover/path:bg-subject-math/20", groupHoverBorder: "group-hover:border-subject-math", groupHoverBg: "group-hover:bg-subject-math" },
                { title: "Master Biology", steps: ["Cells", "Genetics", "Evolution", "Ecology", "Human Anatomy"], colorCls: "text-subject-math", groupHoverColorCls: "group-hover:text-subject-math", groupHoverCls: "group-hover/path:bg-subject-math/20", groupHoverBorder: "group-hover:border-subject-math", groupHoverBg: "group-hover:bg-subject-math" }
              ].map((path, pIdx) => (
                <div key={pIdx} className="flex flex-col group/path">
                  <h3 className="font-bold text-lg mb-12 text-center text-foreground">{path.title}</h3>
                  <div className="relative pl-8">
                    {/* Vertical Timeline Line */}
                    <div className={`absolute left-[15px] top-6 bottom-6 w-[2px] bg-border transition-colors duration-500 ${path.groupHoverCls}`}></div>
                    
                    <div className="flex flex-col gap-8">
                      {path.steps.map((step, i) => (
                        <div key={step} className="relative flex items-center group cursor-pointer">
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[28px] w-6 h-6 rounded-full bg-white border-2 border-border transition-colors z-10 flex items-center justify-center ${path.groupHoverBorder} ${i === 2 ? 'max-md:border-subject-math' : ''}`}>
                            <div className={`w-2 h-2 rounded-full bg-transparent transition-colors ${path.groupHoverBg} ${i === 2 ? 'max-md:bg-subject-math' : ''}`}></div>
                          </div>
                          
                          {/* Content Card */}
                          <div className={`w-full bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform group-hover:translate-x-2 ${path.groupHoverBorder} ${i === 2 ? 'max-md:border-subject-math' : ''}`}>
                            <span className={`text-[15px] font-medium text-foreground transition-colors ${path.groupHoverColorCls} ${i === 2 ? 'max-md:text-subject-math' : ''}`}>{step}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* SECTION 4: Interactive Statistics (Very pale tinted background) */}
        <section className="py-24 md:py-32 bg-slate-50 border-b border-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[14px] font-semibold mb-4 uppercase tracking-widest text-muted-foreground">Subjects</span>
                <span className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold tracking-tight text-foreground"><Counter from={0} to={stats.subjects || 58} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[14px] font-semibold mb-4 uppercase tracking-widest text-muted-foreground">Topics</span>
                <span className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold tracking-tight text-foreground"><Counter from={0} to={stats.topics || 8324} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[14px] font-semibold mb-4 uppercase tracking-widest text-muted-foreground">Lessons</span>
                <span className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold tracking-tight text-foreground"><Counter from={0} to={stats.lessons || 29842} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[14px] font-semibold mb-4 uppercase tracking-widest text-muted-foreground">Questions</span>
                <span className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold tracking-tight text-foreground"><Counter from={0} to={stats.questions || 115000} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[14px] font-semibold mb-4 uppercase tracking-widest text-muted-foreground">Study Hours</span>
                <span className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold tracking-tight text-foreground"><Counter from={0} to={stats.studyHours || 2800000} /></span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4.5: The 3-Step Learning Engine */}
        <section className="py-24 md:py-32 bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <span className="text-[14px] font-bold text-subject-math uppercase tracking-widest mb-4 block">How Avenpath Works</span>
              <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold leading-[1.15] text-foreground">The 3-Step Learning Engine</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-border z-0"></div>
              
              <div className="bg-card border border-border rounded-3xl p-10 flex flex-col items-center text-center relative z-10 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-subject-math transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-subject-math text-white font-black text-2xl flex items-center justify-center mb-8 border-4 border-white shadow-sm">1</div>
                <h3 className="font-bold text-xl mb-4">Read Distilled Notes</h3>
                <p className="text-muted-foreground font-medium leading-[1.6]">Short, comprehensive lesson notes built from official curriculum frameworks—no fluff or filler.</p>
              </div>
              
              <div className="bg-card border border-border rounded-3xl p-10 flex flex-col items-center text-center relative z-10 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-subject-math transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-subject-math text-white font-black text-2xl flex items-center justify-center mb-8 border-4 border-white shadow-sm">2</div>
                <h3 className="font-bold text-xl mb-4">Flip Smart Flashcards</h3>
                <p className="text-muted-foreground font-medium leading-[1.6]">Master key definitions, equations, and historical dates using active recall flashcard decks.</p>
              </div>
              
              <div className="bg-card border border-border rounded-3xl p-10 flex flex-col items-center text-center relative z-10 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-subject-math transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-subject-math text-white font-black text-2xl flex items-center justify-center mb-8 border-4 border-white shadow-sm">3</div>
                <h3 className="font-bold text-xl mb-4">Test Your Mastery</h3>
                <p className="text-muted-foreground font-medium leading-[1.6]">Take instant 5-question quizzes after every lesson with step-by-step answer explanations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Pick Your Goal (Off-white) */}
        <section className="py-32 md:py-48 px-4 md:px-8 max-w-7xl mx-auto bg-background">
          <div className="w-12 h-1 bg-subject-math mb-6 mx-auto"></div>
          <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold leading-[1.15] mb-20 text-center text-foreground">What is your goal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-card border border-border rounded-[2.5rem] p-12 hover:-translate-y-2 hover:shadow-2xl hover:shadow-border/50 hover:border-subject-math transition-all duration-500 cursor-pointer flex flex-col h-full group">
              <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Bookmark className="w-10 h-10 text-muted-foreground group-hover:text-subject-math transition-colors" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg mb-6">Ace Exams</h3>
              <p className="text-muted-foreground text-[15px] font-medium leading-[1.6] flex-grow">
                Prepare for school, university, and professional certifications with highly structured study guides.
              </p>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] p-12 hover:-translate-y-2 hover:shadow-2xl hover:shadow-border/50 hover:border-subject-math transition-all duration-500 cursor-pointer flex flex-col h-full group">
              <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-10 h-10 text-muted-foreground group-hover:text-subject-math transition-colors" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg mb-6">Learn a Skill</h3>
              <div className="flex-grow space-y-4 mt-2">
                {["Programming", "Design", "Finance", "Marketing"].map(skill => (
                  <div key={skill} className="flex items-center gap-4 text-[15px] font-medium leading-[1.6] text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-subject-math transition-colors"></div>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] p-12 hover:-translate-y-2 hover:shadow-2xl hover:shadow-border/50 hover:border-subject-math transition-all duration-500 cursor-pointer flex flex-col h-full group">
              <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Globe className="w-10 h-10 text-muted-foreground group-hover:text-subject-math transition-colors" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg mb-6">Explore Curiosity</h3>
              <div className="flex-grow flex flex-wrap gap-3 mt-2 content-start">
                {["History", "Astronomy", "Psychology", "Philosophy", "Art"].map(topic => (
                  <span key={topic} className="px-5 py-2.5 rounded-full border border-border text-[15px] font-bold text-muted-foreground bg-background group-hover:border-subject-math group-hover:text-subject-math transition-colors">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 6: Daily Learning (Unsplash Replacements) */}
        <section className="py-24 md:py-40 bg-zinc-50 border-y border-border">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between border-b-2 border-foreground pb-8 mb-16">
              <div>
                <div className="w-12 h-1 bg-subject-math mb-4"></div>
                <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground">Daily Practice / Featured Micro-Lessons</h2>
              </div>
              <span className="px-3 py-1 bg-subject-math/10 text-subject-math text-[13px] font-bold rounded-full uppercase tracking-wider mb-2">⚡ 5-MIN LESSON + QUIZ</span>
            </div>
            
            <div className="flex flex-col gap-20">
              {[
                { 
                  title: "Why DNA Replication Matters", meta: "5 MIN • 10 PRACTICE QUESTIONS",
                  desc: "Understanding the fundamental process that allows life to continue and evolve across generations.",
                  imgUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop"
                },
                { 
                  title: "Ancient Rome Explained", meta: "12 MIN • EXAM PREP",
                  desc: "The rise and fall of one of history's greatest empires, distilled into key societal shifts.",
                  imgUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop"
                },
                { 
                  title: "The Basics of SQL", meta: "9 MIN • 8 PRACTICE QUESTIONS",
                  desc: "How relational databases structure information and the queries used to retrieve it.",
                  imgUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
                }
              ].map((pick, i) => (
                <div key={i} className="group cursor-pointer flex flex-col md:flex-row gap-12 items-center border-b border-border/50 pb-20 last:border-0 last:pb-0">
                  <div className="md:w-3/5">
                    <h3 className="text-lg font-bold mb-6 transition-colors group-hover:text-subject-math">{pick.title}</h3>
                    <p className="text-muted-foreground text-[15px] font-medium mb-10">{pick.desc}</p>
                    <div className="flex items-center gap-3 text-[15px] lg:text-base font-bold uppercase tracking-widest text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {pick.meta}
                      <span className="mx-2 text-border">|</span>
                      <span className="group-hover:text-subject-math transition-colors flex items-center">
                        START LESSON <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
                      </span>
                    </div>
                  </div>
                  <div className="w-full md:w-2/5 aspect-[4/3] relative rounded-[2rem] overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500">
                    <Image src={pick.imgUrl} alt={pick.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: Learning Experience (Warm neutral background, Unsplash images) */}
        <section className="py-32 md:py-48 px-4 md:px-8 bg-stone-50 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col gap-32 md:gap-48">
            
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24 group">
              <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl shadow-border/30 bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center">
                <span className="text-muted-foreground font-bold mb-2 uppercase tracking-widest text-sm">Screenshot Placeholder</span>
                <span className="text-foreground font-medium text-lg">Insert a screenshot of the Learning Dashboard here (e.g. showing structured lesson notes).</span>
              </div>
              <div className="w-full md:w-1/2">
                <div className="w-16 h-[4px] bg-subject-math mb-10 rounded-full"></div>
                <h3 className="text-3xl lg:text-5xl font-extrabold mb-10">
                  Structured Learning That Adapts to Your Pace
                </h3>
                <ul className="space-y-6 text-[17px] lg:text-xl text-muted-foreground font-medium">
                  <li className="flex items-start gap-5">
                    <div className="p-1 rounded-full bg-muted border border-border mt-1"><CheckCircle2 className="w-5 h-5 text-muted-foreground" /></div>
                    <span><strong className="text-foreground">Curriculum-Aligned Notes:</strong> Distilled lesson notes built directly around high school and university syllabuses.</span>
                  </li>
                  <li className="flex items-start gap-5">
                    <div className="p-1 rounded-full bg-muted border border-border mt-1"><CheckCircle2 className="w-5 h-5 text-muted-foreground" /></div>
                    <span><strong className="text-foreground">Auto-Generated Flashcards:</strong> Lock in formulas, definitions, and dates with active recall.</span>
                  </li>
                  <li className="flex items-start gap-5">
                    <div className="p-1 rounded-full bg-muted border border-border mt-1"><CheckCircle2 className="w-5 h-5 text-muted-foreground" /></div>
                    <span><strong className="text-foreground">Progress Tracking:</strong> Pick up right where you left off across any device.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16 lg:gap-24 group">
               <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl shadow-border/30 bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center">
                 <span className="text-muted-foreground font-bold mb-2 uppercase tracking-widest text-sm">Screenshot Placeholder</span>
                 <span className="text-foreground font-medium text-lg">Insert a screenshot of the Interactive Quiz interface here.</span>
              </div>
              <div className="w-full md:w-1/2">
                <div className="w-16 h-[4px] bg-subject-math mb-10 rounded-full"></div>
                <h3 className="text-3xl lg:text-5xl font-extrabold mb-10">
                  Practice after every lesson.
                </h3>
                <p className="text-[17px] lg:text-xl text-muted-foreground font-medium mb-10">
                  Reading is just the beginning. Solidify your understanding with targeted, immediate practice questions and flashcards that ensure concepts are deeply rooted in your memory.
                </p>
              </div>
            </div>

             {/* Feature 3 */}
             <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24 group">
               <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl shadow-border/30 bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center">
                <span className="text-muted-foreground font-bold mb-2 uppercase tracking-widest text-sm">Screenshot Placeholder</span>
                <span className="text-foreground font-medium text-lg">Insert a screenshot of the Flashcards interface here.</span>
              </div>
              <div className="w-full md:w-1/2">
                <div className="w-16 h-[4px] bg-subject-math mb-10 rounded-full"></div>
                <h3 className="text-3xl lg:text-5xl font-extrabold mb-10">
                  Master Hard Concepts with Smart Spaced Repetition
                </h3>
                <p className="text-[17px] lg:text-xl text-muted-foreground font-medium mb-10">
                  Avenpath identifies the exact concepts you struggle with and automatically surfaces bite-sized quizzes and flashcards right when your brain needs them most.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 8: High-Yield Exam Prep */}
        <section className="py-24 md:py-32 bg-white border-y border-border">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-extrabold leading-[1.15] text-foreground mb-4">
              High-Yield Exam Topics
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mb-16 leading-[1.7]">
              Master the top concepts featured heavily in upcoming board & university exams.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { title: "Quadratic Equations & Matrices", badges: ["🔥 High Exam Frequency", "JAMB / WAEC"], link: "#" },
                { title: "Cell Division & Genetics", badges: ["🔥 High Exam Frequency", "100-Level Uni"], link: "#" },
                { title: "Organic Chemistry Reaction Mechanisms", badges: ["🔥 High Exam Frequency", "JAMB / WAEC", "100-Level Uni"], link: "#" }
              ].map((card, i) => (
                <div key={i} className="bg-card border border-border rounded-3xl p-8 hover:-translate-y-2 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full hover:border-subject-math">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {card.badges.map((badge, bIdx) => (
                      <span key={bIdx} className={`text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${badge.includes('High') ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-muted text-muted-foreground'}`}>
                        {badge}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-xl mb-8 group-hover:text-subject-math transition-colors leading-[1.4] flex-grow">{card.title}</h3>
                  <div className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-foreground group-hover:text-subject-math transition-all">
                    Start Practice <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: Final CTA Banner */}
        <section className="py-24 md:py-32 px-4 md:px-8 flex flex-col items-center justify-center text-center mx-auto relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-subject-math/5 via-background to-background"></div>
          <h2 className="relative z-10 text-4xl lg:text-6xl font-extrabold text-foreground max-w-4xl mb-8 tracking-tight">
            Ready to master your curriculum?
          </h2>
          <p className="relative z-10 text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mb-12 leading-[1.7]">
            Join thousands of high school and university students preparing for exams and building real-world skills on Avenpath.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/register" className="bg-foreground text-background px-10 py-5 rounded-full text-[15px] md:text-base font-bold hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
              Get Started For Free
            </Link>
            <Link href="/subjects" className="bg-background text-foreground border-2 border-border px-10 py-5 rounded-full text-[15px] md:text-base font-bold hover:bg-muted transition-colors duration-300">
              Explore Subjects
            </Link>
          </div>
        </section>
      </main>

      {/* SECTION 10: Expanded Beautiful Footer */}
      <footer className="bg-card border-t border-border pt-24 md:pt-32 pb-8 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-32">
            
            <div className="col-span-1 md:col-span-4 lg:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <img src="/logo.png" alt="Avenpath Logo" className="h-28 w-auto" />
              </div>
              <p className="text-muted-foreground text-[14px] font-medium leading-[1.6] max-w-sm mb-8">
                Learn with structured lessons, practical quizzes, and curated study paths across a growing library of subjects.
              </p>
              <div className="flex gap-6">
                <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-subject-math hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-subject-math hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-subject-math hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                </a>
              </div>
            </div>
            
            <div className="lg:col-start-3">
              <h4 className="text-[16px] font-bold mb-8 uppercase tracking-widest text-foreground">Subjects</h4>
              <ul className="space-y-5 text-[14px] text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-subject-math transition-colors">Mathematics</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Programming</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Biology</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Physics</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">History</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[16px] font-bold mb-8 uppercase tracking-widest text-foreground">Resources</h4>
              <ul className="space-y-5 text-[14px] text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-subject-math transition-colors">Study Guides</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Flashcards</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Practice Tests</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Community Forum</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[16px] font-bold mb-8 uppercase tracking-widest text-foreground">Company</h4>
              <ul className="space-y-5 text-[14px] text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-subject-math transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[16px] font-bold mb-8 uppercase tracking-widest text-foreground">Legal</h4>
              <ul className="space-y-5 text-[14px] text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-border gap-8">
            <div className="text-[14px] text-muted-foreground font-medium">
              © {new Date().getFullYear()} Avenpath. All rights reserved. Made for lifelong learners.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
