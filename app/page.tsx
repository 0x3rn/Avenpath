"use client";

import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { ArrowRight, BookOpen, Star, Clock, Bookmark, Play, CheckCircle2, Search, LogIn, Calculator, Atom, FlaskConical, Globe, ScrollText, Code, LineChart, TrendingUp, ChevronRight, Library, Beaker, Map } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
        <h3 className={`text-foreground font-medium transition-colors ${colorCls.replace('text-', 'group-hover:text-')}`}>{name}</h3>
        
        {/* Hover Reveal Topics */}
        <div className="absolute left-1/2 -translate-x-1/2 w-52 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50 top-full pt-3">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-xl">
            <ul className="space-y-3 mb-4">
              {topics.map(topic => (
                <li key={topic} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${bgCls}`}></div>
                  {topic}
                </li>
              ))}
            </ul>
            <div className={`text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all ${colorCls}`}>
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
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-subject-math/20">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full absolute top-0 left-0 right-0 z-50">
        <div className="text-2xl font-semibold tracking-tight">Avenpath.</div>
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Search</span>
          </button>
          <button className="flex items-center gap-2 text-foreground font-medium hover:text-subject-math transition-colors">
            <LogIn className="w-4 h-4" />
            <span className="text-sm">Login</span>
          </button>
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
                <h1 className="text-5xl md:text-7xl lg:text-8xl text-foreground font-bold leading-[1.05] mb-8 tracking-tight">
                  Knowledge,<br />organized <i className="text-muted-foreground">beautifully.</i>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                  Explore thousands of topics, lessons, and practice questions in a distraction-free, colorful environment.
                </p>
                <button className="bg-foreground text-background px-10 py-5 rounded-full text-lg font-medium hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto group">
                  Start Learning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
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
                      <h3 className={`text-foreground font-medium mb-3 ${subj.colorCls}`}>{subj.name}</h3>
                      <ul className="space-y-2 mb-4">
                        {subj.topics.map(topic => (
                          <li key={topic} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${subj.bgCls}`}></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                      <div className={`text-xs font-medium flex items-center gap-1 ${subj.colorCls}`}>
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
            <h2 className="text-5xl mb-20 text-foreground font-semibold">Explore by Subject</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "MATHEMATICS", icon: Calculator, count: 217, topics: ["Algebra", "Geometry", "Calculus"], desc: "Master numbers, space, and structure.", color: "text-subject-math", bg: "bg-subject-math", border: "hover:border-subject-math", bgBadge: "bg-subject-math/[0.03]" },
                { name: "BIOLOGY", icon: Atom, count: 184, topics: ["Cells", "Genetics", "Evolution"], desc: "Explore the fascinating science of life.", color: "text-subject-biology", bg: "bg-subject-biology", border: "hover:border-subject-biology", bgBadge: "bg-subject-biology/[0.03]" },
                { name: "CHEMISTRY", icon: FlaskConical, count: 156, topics: ["Organic", "Inorganic", "Physical"], desc: "Understand the matter that makes our universe.", color: "text-subject-chemistry", bg: "bg-subject-chemistry", border: "hover:border-subject-chemistry", bgBadge: "bg-subject-chemistry/[0.03]" },
                { name: "PHYSICS", icon: Atom, count: 198, topics: ["Mechanics", "Thermodynamics", "Quantum"], desc: "Learn the fundamental laws of nature.", color: "text-subject-physics", bg: "bg-subject-physics", border: "hover:border-subject-physics", bgBadge: "bg-subject-physics/[0.03]" },
                { name: "COMPUTER SCIENCE", icon: Code, count: 420, topics: ["Algorithms", "Data Structures", "AI"], desc: "Build the systems that power the future.", color: "text-subject-cs", bg: "bg-subject-cs", border: "hover:border-subject-cs", bgBadge: "bg-subject-cs/[0.03]" },
                { name: "HISTORY", icon: ScrollText, count: 312, topics: ["Ancient", "Medieval", "Modern"], desc: "Discover the stories that shaped humanity.", color: "text-subject-history", bg: "bg-subject-history", border: "hover:border-subject-history", bgBadge: "bg-subject-history/[0.03]" }
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
                  
                  <h3 className="font-medium text-xl tracking-widest text-foreground mb-4 relative z-10">{subject.name}</h3>
                  <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{subject.desc}</p>
                  
                  <div className={`h-[1px] w-full bg-border mb-6 transition-colors relative z-10 group-hover:${subject.bgBadge}`}></div>
                  
                  <ul className="space-y-4 mb-10 relative z-10">
                    {subject.topics.map(topic => (
                      <li key={topic} className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-3 font-medium">
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
            <h2 className="text-5xl mb-20 text-center font-semibold">Guided Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              
              {[
                { title: "Learn Web Development", steps: ["HTML", "CSS", "JavaScript", "React", "Next.js"], colorCls: "text-subject-math", groupHoverColorCls: "group-hover:text-subject-math", groupHoverCls: "group-hover/path:bg-subject-math/20", groupHoverBorder: "group-hover:border-subject-math", groupHoverBg: "group-hover:bg-subject-math" },
                { title: "Become a Data Analyst", steps: ["Statistics", "Excel", "SQL", "Python", "Power BI"], colorCls: "text-subject-math", groupHoverColorCls: "group-hover:text-subject-math", groupHoverCls: "group-hover/path:bg-subject-math/20", groupHoverBorder: "group-hover:border-subject-math", groupHoverBg: "group-hover:bg-subject-math" },
                { title: "Master Biology", steps: ["Cells", "Genetics", "Evolution", "Ecology", "Human Anatomy"], colorCls: "text-subject-math", groupHoverColorCls: "group-hover:text-subject-math", groupHoverCls: "group-hover/path:bg-subject-math/20", groupHoverBorder: "group-hover:border-subject-math", groupHoverBg: "group-hover:bg-subject-math" }
              ].map((path, pIdx) => (
                <div key={pIdx} className="flex flex-col group/path">
                  <h3 className="text-2xl font-medium mb-12 text-center text-foreground">{path.title}</h3>
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
                            <span className={`font-medium text-foreground transition-colors ${path.groupHoverColorCls} ${i === 2 ? 'max-md:text-subject-math' : ''}`}>{step}</span>
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
                <span className="text-muted-foreground font-bold mb-4 uppercase tracking-widest text-xs">Subjects</span>
                <span className="text-5xl lg:text-6xl font-medium tracking-tight text-foreground"><Counter from={0} to={58} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-muted-foreground font-bold mb-4 uppercase tracking-widest text-xs">Topics</span>
                <span className="text-5xl lg:text-6xl font-medium tracking-tight text-foreground"><Counter from={0} to={8324} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-muted-foreground font-bold mb-4 uppercase tracking-widest text-xs">Lessons</span>
                <span className="text-5xl lg:text-6xl font-medium tracking-tight text-foreground"><Counter from={0} to={29842} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-muted-foreground font-bold mb-4 uppercase tracking-widest text-xs">Questions</span>
                <span className="text-5xl lg:text-6xl font-medium tracking-tight text-foreground">115k</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-muted-foreground font-bold mb-4 uppercase tracking-widest text-xs">Study Hours</span>
                <span className="text-5xl lg:text-6xl font-medium tracking-tight text-foreground">2.8M</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Pick Your Goal (Off-white) */}
        <section className="py-32 md:py-48 px-4 md:px-8 max-w-7xl mx-auto bg-background">
          <div className="w-12 h-1 bg-subject-math mb-6 mx-auto"></div>
          <h2 className="text-5xl mb-20 text-center font-semibold">What is your goal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-card border border-border rounded-[2.5rem] p-12 hover:-translate-y-2 hover:shadow-2xl hover:shadow-border/50 hover:border-subject-math transition-all duration-500 cursor-pointer flex flex-col h-full group">
              <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Bookmark className="w-10 h-10 text-muted-foreground group-hover:text-subject-math transition-colors" strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-medium mb-6">Ace Exams</h3>
              <p className="text-muted-foreground text-lg leading-relaxed flex-grow">
                Prepare for school, university, and professional certifications with highly structured study guides.
              </p>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] p-12 hover:-translate-y-2 hover:shadow-2xl hover:shadow-border/50 hover:border-subject-math transition-all duration-500 cursor-pointer flex flex-col h-full group">
              <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-10 h-10 text-muted-foreground group-hover:text-subject-math transition-colors" strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-medium mb-6">Learn a Skill</h3>
              <div className="flex-grow space-y-4 mt-2">
                {["Programming", "Design", "Finance", "Marketing"].map(skill => (
                  <div key={skill} className="flex items-center gap-4 text-muted-foreground text-lg">
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
              <h3 className="text-3xl font-medium mb-6">Explore Curiosity</h3>
              <div className="flex-grow flex flex-wrap gap-3 mt-2 content-start">
                {["History", "Astronomy", "Psychology", "Philosophy", "Art"].map(topic => (
                  <span key={topic} className="px-5 py-2.5 rounded-full border border-border text-sm font-medium text-muted-foreground bg-background group-hover:border-subject-math group-hover:text-subject-math transition-colors">
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
                <h2 className="text-5xl md:text-6xl tracking-tight font-semibold">Today's Picks</h2>
              </div>
              <span className="text-xl italic text-muted-foreground mb-2">Edition No. 142</span>
            </div>
            
            <div className="flex flex-col gap-20">
              {[
                { 
                  title: "Why DNA Replication Matters", time: "5 min",
                  desc: "Understanding the fundamental process that allows life to continue and evolve across generations.",
                  imgUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop"
                },
                { 
                  title: "Ancient Rome Explained", time: "12 min",
                  desc: "The rise and fall of one of history's greatest empires, distilled into key societal shifts.",
                  imgUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop"
                },
                { 
                  title: "The Basics of SQL", time: "9 min",
                  desc: "How relational databases structure information and the queries used to retrieve it.",
                  imgUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
                }
              ].map((pick, i) => (
                <div key={i} className="group cursor-pointer flex flex-col md:flex-row gap-12 items-center border-b border-border/50 pb-20 last:border-0 last:pb-0">
                  <div className="md:w-3/5">
                    <h3 className="text-4xl font-medium mb-6 transition-colors leading-[1.2] group-hover:text-subject-math">{pick.title}</h3>
                    <p className="text-muted-foreground text-xl mb-10 leading-relaxed font-light">{pick.desc}</p>
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {pick.time}
                      <span className="mx-2 text-border">|</span>
                      <span className="group-hover:text-subject-math transition-colors flex items-center">
                        Read Article <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
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
              <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl shadow-border/30">
                <Image src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop" alt="Library" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="w-16 h-[4px] bg-subject-math mb-10 rounded-full"></div>
                <h3 className="text-5xl font-semibold leading-[1.1] mb-10">
                  A library that remembers your place.
                </h3>
                <ul className="space-y-6 text-xl text-muted-foreground font-light">
                  <li className="flex items-center gap-5">
                    <div className="p-1 rounded-full bg-muted border border-border"><CheckCircle2 className="w-5 h-5 text-muted-foreground" /></div>
                    Save lessons for later
                  </li>
                  <li className="flex items-center gap-5">
                    <div className="p-1 rounded-full bg-muted border border-border"><CheckCircle2 className="w-5 h-5 text-muted-foreground" /></div>
                    Bookmark specific topics
                  </li>
                  <li className="flex items-center gap-5">
                    <div className="p-1 rounded-full bg-muted border border-border"><CheckCircle2 className="w-5 h-5 text-muted-foreground" /></div>
                    Track your overall progress
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16 lg:gap-24 group">
               <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl shadow-border/30">
                 <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop" alt="Student studying" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="w-16 h-[4px] bg-subject-math mb-10 rounded-full"></div>
                <h3 className="text-5xl font-semibold leading-[1.1] mb-10">
                  Practice after every lesson.
                </h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-light mb-10">
                  Reading is just the beginning. Solidify your understanding with targeted, immediate practice questions and flashcards that ensure concepts are deeply rooted in your memory.
                </p>
              </div>
            </div>

             {/* Feature 3 */}
             <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24 group">
               <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl shadow-border/30">
                <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" alt="Students reviewing" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="w-16 h-[4px] bg-subject-math mb-10 rounded-full"></div>
                <h3 className="text-5xl font-semibold leading-[1.1] mb-10">
                  Review difficult topics easily.
                </h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-light mb-10">
                  Our system identifies areas where you struggle and gently reintroduces them over time. It’s a personalized path to mastery, without the frustration.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 8: Community Picks */}
        <section className="py-24 md:py-32 bg-white border-y border-border">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <h2 className="font-semibold text-sm mb-12 text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              Trending Now <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </h2>
            <div className="flex flex-wrap justify-center gap-5">
              {["Calculus", "Photosynthesis", "Machine Learning", "Shakespeare", "World War II", "Thermodynamics", "JavaScript"].map((topic, i) => {
                return (
                  <div key={topic} className={`px-8 py-4 rounded-full border border-border bg-background text-foreground font-medium text-xl hover:border-subject-math hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-300 flex items-center gap-3 group/trend`}>
                    <TrendingUp className="w-5 h-5 text-muted-foreground group-hover/trend:text-subject-math transition-colors" /> {topic}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* SECTION 9: Quotes (Soft radial background) */}
        <section className="py-32 md:py-64 px-4 md:px-8 flex items-center justify-center text-center mx-auto relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-subject-math/5 via-background to-background"></div>
          <h2 className="relative z-10 text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-foreground max-w-5xl">
            "The beautiful thing about learning is that nobody can take it away from you."
          </h2>
        </section>
      </main>

      {/* SECTION 10: Expanded Beautiful Footer */}
      <footer className="bg-card border-t border-border pt-24 md:pt-32 pb-8 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-32">
            
            <div className="col-span-1 md:col-span-4 lg:col-span-2">
              <div className="text-3xl font-semibold tracking-tight mb-8">Avenpath.</div>
              <p className="text-muted-foreground text-base max-w-sm leading-relaxed font-light mb-8">
                Learn with structured lessons, practical quizzes, and curated study paths across a growing library of subjects.
              </p>
              <div className="flex gap-6">
                <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-subject-math hover:text-white transition-colors">T</a>
                <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-subject-math hover:text-white transition-colors">I</a>
                <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-subject-math hover:text-white transition-colors">G</a>
              </div>
            </div>
            
            <div className="lg:col-start-3">
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-foreground">Subjects</h4>
              <ul className="space-y-5 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-subject-math transition-colors">Mathematics</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Programming</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Biology</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Physics</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">History</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-foreground">Resources</h4>
              <ul className="space-y-5 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-subject-math transition-colors">Study Guides</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Flashcards</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Practice Tests</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Community Forum</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-foreground">Company</h4>
              <ul className="space-y-5 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-subject-math transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-subject-math transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-foreground">Legal</h4>
              <ul className="space-y-5 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-border gap-8">
            <div className="text-sm text-muted-foreground font-medium">
              © {new Date().getFullYear()} Avenpath. All rights reserved. Made for lifelong learners.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
