"use client";

import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { ArrowRight, BookOpen, Star, Clock, Bookmark, Play, CheckCircle2, Search, LogIn, Calculator, Atom, FlaskConical, Globe, ScrollText, Code, LineChart, TrendingUp, ChevronRight } from "lucide-react";
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

// --- Section 1: Floating Library Data ---
type FloatingSubject = {
  name: string;
  x: string;
  y: string;
  delay: number;
  size: "sm" | "md" | "lg";
  rotation: number;
  topics: string[];
  tooltipPos?: "top" | "bottom";
};

// Clustered asymmetrically, varied sizes and rotations
const floatingSubjects: FloatingSubject[] = [
  // Top Left Cluster
  { name: "Mathematics", x: "15%", y: "15%", delay: 0.1, size: "lg", rotation: -2, topics: ["Algebra", "Geometry", "Calculus"] },
  { name: "Statistics", x: "28%", y: "22%", delay: 0.3, size: "sm", rotation: 1, topics: ["Probability", "Data"] },
  
  // Center Left Cluster
  { name: "Literature", x: "10%", y: "45%", delay: 0.2, size: "md", rotation: 2, topics: ["Shakespeare", "Poetry"] },
  { name: "Philosophy", x: "22%", y: "55%", delay: 0.5, size: "sm", rotation: -1, topics: ["Ethics", "Logic"] },

  // Bottom Left Cluster
  { name: "Physics", x: "18%", y: "75%", delay: 0.4, size: "lg", rotation: -3, topics: ["Mechanics", "Optics"] },
  
  // Top Right Cluster
  { name: "Biology", x: "75%", y: "18%", delay: 0.3, size: "lg", rotation: 3, topics: ["Cells", "Genetics"] },
  { name: "Chemistry", x: "62%", y: "26%", delay: 0.6, size: "md", rotation: -1, topics: ["Organic", "Physical"] },

  // Center Right Cluster
  { name: "Computer Science", x: "82%", y: "48%", delay: 0.4, size: "md", rotation: -2, topics: ["Algorithms", "AI"] },
  
  // Bottom Right Cluster
  { name: "History", x: "70%", y: "70%", delay: 0.2, size: "lg", rotation: 1, topics: ["World War II", "Rome"] },
  { name: "Economics", x: "85%", y: "82%", delay: 0.5, size: "sm", rotation: 2, topics: ["Micro", "Macro"] },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const gridOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0.1, 0.25], [50, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full absolute top-0 left-0 right-0 z-50">
        <div className="font-serif text-2xl font-semibold tracking-tight">Avenpath.</div>
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Search</span>
          </button>
          <button className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors">
            <LogIn className="w-4 h-4" />
            <span className="text-sm">Login</span>
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {/* SECTION 1: Floating Library Hero */}
        <section className="relative w-full h-[100vh] min-h-[900px] flex flex-col items-center justify-center border-b border-border overflow-hidden">
          
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 z-30 pointer-events-none">
            {mounted && floatingSubjects.map((subject, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -8, 0], // Continuous gentle float
                }}
                transition={{ 
                  opacity: { delay: subject.delay, duration: 0.8, ease: "easeOut" },
                  y: { repeat: Infinity, duration: 4 + i % 3, ease: "easeInOut", delay: subject.delay }
                }}
                className={`absolute group cursor-pointer z-10 hover:z-50 hidden md:block pointer-events-auto`}
                style={{ 
                  left: subject.x, 
                  top: subject.y, 
                  transform: `rotate(${subject.rotation}deg) translate(-50%, -50%)`,
                }}
              >
                <div className={`
                  bg-card/90 backdrop-blur-sm rounded-3xl border border-border shadow-sm group-hover:shadow-xl transition-all duration-300
                  group-hover:-translate-y-2 group-hover:rotate-0
                  ${subject.size === 'lg' ? 'px-8 py-5 text-xl' : subject.size === 'md' ? 'px-6 py-4 text-lg' : 'px-4 py-3 text-base'}
                `}>
                  <h3 className="font-serif text-foreground font-medium group-hover:text-primary transition-colors">{subject.name}</h3>
                  
                  {/* Hover Reveal Topics with transparent padding bridge */}
                  <div className={`absolute left-1/2 -translate-x-1/2 w-52 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50 ${subject.tooltipPos === 'top' ? 'bottom-full pb-3' : 'top-full pt-3'}`}>
                    <div className="bg-card border border-border rounded-2xl p-4 shadow-xl">
                      <ul className="space-y-3 mb-4">
                        {subject.topics.map(topic => (
                          <li key={topic} className="text-sm text-muted flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                      <div className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Open Subject <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="relative z-20 mt-auto mb-40 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ opacity: heroOpacity, y: heroY }}
              className="pointer-events-auto"
            >
              <div className="w-16 h-[2px] bg-foreground mx-auto mb-10 opacity-20"></div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-foreground font-medium leading-[1.1] mb-8 tracking-tight">
                Knowledge,<br />organized beautifully.
              </h1>
              <p className="text-xl md:text-2xl text-muted mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Explore thousands of topics, lessons, and practice questions in a distraction-free environment.
              </p>
              <button className="bg-foreground text-card px-10 py-5 rounded-full text-lg font-medium hover:bg-primary hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center gap-3 mx-auto group">
                Start Learning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Explore by Subject */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-20 pb-16 md:pt-40 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto relative z-30 bg-background"
        >  
          <h2 className="font-serif text-4xl mb-16 text-foreground">Explore by Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "MATHEMATICS", icon: Calculator, count: 217, topics: ["Algebra", "Geometry", "Statistics", "Calculus"] },
              { name: "BIOLOGY", icon: Atom, count: 184, topics: ["Cells", "Genetics", "Evolution", "Ecology"] },
              { name: "CHEMISTRY", icon: FlaskConical, count: 156, topics: ["Organic", "Inorganic", "Physical", "Analytical"] },
              { name: "HISTORY", icon: ScrollText, count: 312, topics: ["Ancient", "Medieval", "Modern", "World"] },
              { name: "PROGRAMMING", icon: Code, count: 420, topics: ["Python", "JavaScript", "C++", "Rust"] },
              { name: "ECONOMICS", icon: TrendingUp, count: 128, topics: ["Micro", "Macro", "Finance", "Behavioral"] }
            ].map(subject => (
              <div key={subject.name} className="bg-card border border-border rounded-3xl p-8 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl shadow-sm transition-all duration-300 group cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background rounded-2xl border border-border group-hover:border-primary/30 transition-colors">
                      <subject.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-muted bg-background px-3 py-1.5 rounded-full border border-border tracking-wider">
                    {subject.count} TOPICS
                  </span>
                </div>
                
                <h3 className="font-sans font-bold text-xl tracking-widest text-foreground mb-6 relative z-10">{subject.name}</h3>
                
                <div className="h-[1px] w-full bg-border mb-6 group-hover:bg-primary/20 transition-colors relative z-10"></div>
                
                <ul className="space-y-4 mb-10 relative z-10">
                  {subject.topics.map(topic => (
                    <li key={topic} className="text-muted group-hover:text-foreground transition-colors flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-border group-hover:bg-primary/50 transition-colors"></div>
                      {topic}
                    </li>
                  ))}
                </ul>
                
                <div className="text-foreground font-medium flex items-center gap-2 group-hover:text-primary transition-all relative z-10 uppercase tracking-widest text-xs">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Subtle background icon */}
                <subject.icon className="absolute -bottom-6 -right-6 w-40 h-40 text-border/20 group-hover:text-primary/[0.03] transition-colors -rotate-12" strokeWidth={0.5} />
              </div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 3: Continue the Journey (Learning Paths) */}
        <section className="py-20 md:py-32 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="font-serif text-4xl mb-20 text-center">Guided Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              
              {[
                { title: "Learn Web Development", steps: ["HTML", "CSS", "JavaScript", "React", "Next.js"] },
                { title: "Become a Data Analyst", steps: ["Statistics", "Excel", "SQL", "Python", "Power BI"] },
                { title: "Master Biology", steps: ["Cells", "Genetics", "Evolution", "Ecology", "Human Anatomy"] }
              ].map((path, pIdx) => (
                <div key={pIdx} className="flex flex-col group/path">
                  <h3 className="font-serif text-2xl font-medium mb-12 text-center text-foreground">{path.title}</h3>
                  <div className="relative pl-8">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-border group-hover/path:bg-primary/20 transition-colors duration-500"></div>
                    
                    <div className="flex flex-col gap-8">
                      {path.steps.map((step, i) => (
                        <div key={step} className="relative flex items-center group cursor-pointer">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[28px] w-6 h-6 rounded-full bg-card border-2 border-border group-hover:border-primary transition-colors z-10 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-colors"></div>
                          </div>
                          
                          {/* Content Card */}
                          <div className="w-full bg-background border border-border rounded-2xl p-5 hover:border-primary hover:shadow-md transition-all duration-300 transform group-hover:translate-x-2">
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">{step}</span>
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

        {/* SECTION 4: Featured Lessons */}
        <section className="py-20 md:py-40 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl mb-16">Featured Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Understanding Linear Equations", subject: "Mathematics", time: "12 min", rating: 4 },
              { title: "The Human Heart: Anatomy & Function", subject: "Biology", time: "18 min", rating: 5 },
              { title: "What is Inflation and Why it Matters", subject: "Economics", time: "15 min", rating: 4 }
            ].map((lesson, i) => (
              <div key={i} className="group cursor-pointer flex flex-col h-full">
                <div className="aspect-[3/4] bg-card border border-border rounded-3xl mb-8 overflow-hidden relative shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-background to-border/40 group-hover:scale-[1.02] transition-transform duration-700 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-muted/20" strokeWidth={1} />
                  </div>
                  {/* Overlay for magazine feel */}
                  <div className="absolute inset-0 border border-black/5 rounded-3xl pointer-events-none"></div>
                </div>
                
                <div className="flex flex-col flex-grow">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">
                    {lesson.subject}
                  </span>
                  <h3 className="font-serif text-3xl font-medium leading-[1.2] mb-6 group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h3>
                  
                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between text-sm text-muted">
                    <span className="font-medium italic">By Avenpath Editorial</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{lesson.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Interactive Statistics */}
        {/* Added top and bottom margins for breathing room on desktop, tighter on mobile */}
        <section className="my-10 md:my-20 py-20 md:py-40 bg-foreground text-card border-y border-foreground overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start pl-0">
                <span className="text-muted font-bold mb-6 uppercase tracking-widest text-xs">Subjects</span>
                <span className="font-serif text-5xl lg:text-6xl font-medium tracking-tight"><Counter from={0} to={58} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start pl-0 md:pl-12">
                <span className="text-muted font-bold mb-6 uppercase tracking-widest text-xs">Topics</span>
                <span className="font-serif text-5xl lg:text-6xl font-medium tracking-tight"><Counter from={0} to={8324} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start pl-0 md:pl-12">
                <span className="text-muted font-bold mb-6 uppercase tracking-widest text-xs">Lessons</span>
                <span className="font-serif text-5xl lg:text-6xl font-medium tracking-tight"><Counter from={0} to={29842} /></span>
              </div>
              <div className="flex flex-col items-center md:items-start pl-0 md:pl-12">
                <span className="text-muted font-bold mb-6 uppercase tracking-widest text-xs">Questions</span>
                <span className="font-serif text-5xl lg:text-6xl font-medium tracking-tight">115k</span>
              </div>
              <div className="flex flex-col items-center md:items-start pl-0 md:pl-12">
                <span className="text-muted font-bold mb-6 uppercase tracking-widest text-xs">Study Hours</span>
                <span className="font-serif text-5xl lg:text-6xl font-medium tracking-tight text-primary">2.8M</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Pick Your Goal */}
        <section className="py-20 md:py-40 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl mb-16 text-center">What is your goal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-card border border-border rounded-[2.5rem] p-12 hover:-translate-y-2 hover:shadow-2xl hover:shadow-border/50 transition-all duration-500 cursor-pointer flex flex-col h-full group">
              <div className="w-20 h-20 rounded-3xl bg-background border border-border flex items-center justify-center mb-10 group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors">
                <Bookmark className="w-10 h-10 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-3xl font-medium mb-6">Ace Exams</h3>
              <p className="text-muted text-lg leading-relaxed flex-grow">
                Prepare for school, university, and professional certifications with highly structured study guides.
              </p>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] p-12 hover:-translate-y-2 hover:shadow-2xl hover:shadow-border/50 transition-all duration-500 cursor-pointer flex flex-col h-full group relative overflow-hidden">
              <div className="w-20 h-20 rounded-3xl bg-background border border-border flex items-center justify-center mb-10 group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors">
                <CheckCircle2 className="w-10 h-10 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-3xl font-medium mb-6">Learn a Skill</h3>
              <div className="flex-grow space-y-4 mt-2">
                {["Programming", "Design", "Finance", "Marketing"].map(skill => (
                  <div key={skill} className="flex items-center gap-4 text-muted text-lg">
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary/60 transition-colors"></div>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] p-12 hover:-translate-y-2 hover:shadow-2xl hover:shadow-border/50 transition-all duration-500 cursor-pointer flex flex-col h-full group">
              <div className="w-20 h-20 rounded-3xl bg-background border border-border flex items-center justify-center mb-10 group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors">
                <Globe className="w-10 h-10 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-3xl font-medium mb-6">Explore Curiosity</h3>
              <div className="flex-grow flex flex-wrap gap-3 mt-2 content-start">
                {["History", "Astronomy", "Psychology", "Philosophy", "Art"].map(topic => (
                  <span key={topic} className="px-5 py-2.5 rounded-full border border-border text-sm font-medium text-muted bg-background group-hover:border-primary/30 transition-colors">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 7: Daily Learning */}
        <section className="py-20 md:py-32 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between border-b-2 border-foreground pb-8 mb-16">
              <h2 className="font-serif text-6xl font-medium tracking-tight">Today's Picks</h2>
              <span className="font-serif text-xl italic text-muted mb-2">Edition No. 142</span>
            </div>
            
            <div className="flex flex-col gap-16">
              {[
                { 
                  title: "Why DNA Replication Matters", time: "5 min", desc: "Understanding the fundamental process that allows life to continue and evolve across generations.",
                  thumbnail: (
                    <div className="w-full h-full bg-background rounded-xl border border-border flex items-center justify-center relative overflow-hidden group-hover:border-primary/50 transition-colors">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                      <Atom className="w-16 h-16 text-foreground/40 group-hover:text-primary/60 transition-colors group-hover:scale-110 duration-500" strokeWidth={1} />
                    </div>
                  )
                },
                { 
                  title: "Ancient Rome Explained", time: "12 min", desc: "The rise and fall of one of history's greatest empires, distilled into key societal shifts.",
                  thumbnail: (
                     <div className="w-full h-full bg-background rounded-xl border border-border flex items-center justify-center relative overflow-hidden group-hover:border-primary/50 transition-colors">
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-border/20"></div>
                      <ScrollText className="w-16 h-16 text-foreground/40 group-hover:text-primary/60 transition-colors group-hover:scale-110 duration-500 relative z-10" strokeWidth={1} />
                    </div>
                  )
                },
                { 
                  title: "The Basics of SQL", time: "9 min", desc: "How relational databases structure information and the queries used to retrieve it.",
                  thumbnail: (
                    <div className="w-full h-full bg-background rounded-xl border border-border flex items-center justify-center p-8 relative overflow-hidden group-hover:border-primary/50 transition-colors">
                      <div className="w-full h-full flex flex-col gap-2">
                         <div className="w-full h-3 bg-border/50 rounded-full group-hover:bg-primary/20 transition-colors"></div>
                         <div className="w-3/4 h-3 bg-border/50 rounded-full group-hover:bg-primary/20 transition-colors delay-75"></div>
                         <div className="w-1/2 h-3 bg-border/50 rounded-full group-hover:bg-primary/20 transition-colors delay-100"></div>
                      </div>
                    </div>
                  )
                }
              ].map((pick, i) => (
                <div key={i} className="group cursor-pointer flex flex-col md:flex-row gap-12 items-start border-b border-border/50 pb-16 last:border-0 last:pb-0">
                  <div className="md:w-2/3">
                    <h3 className="font-serif text-4xl font-medium mb-6 group-hover:text-primary transition-colors leading-[1.2]">{pick.title}</h3>
                    <p className="text-muted text-xl mb-8 leading-relaxed font-light">{pick.desc}</p>
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {pick.time}
                      <span className="mx-2 text-border">|</span>
                      Read Article <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 aspect-video md:aspect-square">
                    {pick.thumbnail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: Learning Experience */}
        <section className="py-20 md:py-40 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col gap-32 md:gap-48">
            
            {/* Feature 1 - Custom UI Mockup (Lesson Page) */}
            <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-32 group">
              <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] bg-card border border-border overflow-hidden shadow-xl shadow-border/30 flex p-8 group-hover:border-primary/30 transition-colors">
                {/* Sidebar mock */}
                <div className="w-1/3 border-r border-border pr-6 flex flex-col gap-4 opacity-50">
                   <div className="w-full h-4 bg-border/50 rounded-md"></div>
                   <div className="w-3/4 h-4 bg-border/50 rounded-md"></div>
                   <div className="w-5/6 h-4 bg-border/50 rounded-md"></div>
                   <div className="w-full h-4 bg-border/50 rounded-md mt-6"></div>
                   <div className="w-2/3 h-4 bg-primary/30 rounded-md"></div>
                </div>
                {/* Content mock */}
                <div className="w-2/3 pl-8 flex flex-col gap-6 relative">
                   <div className="w-1/2 h-8 bg-foreground/10 rounded-lg mb-4"></div>
                   <div className="w-full h-3 bg-border/40 rounded-full"></div>
                   <div className="w-full h-3 bg-border/40 rounded-full"></div>
                   <div className="w-5/6 h-3 bg-border/40 rounded-full"></div>
                   <div className="mt-8 aspect-video w-full bg-background border border-border rounded-xl flex items-center justify-center">
                     <Play className="w-10 h-10 text-primary/40" fill="currentColor" />
                   </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="w-12 h-[3px] bg-primary mb-10"></div>
                <h3 className="font-serif text-5xl font-medium leading-[1.1] mb-10">
                  A library that remembers your place.
                </h3>
                <ul className="space-y-6 text-xl text-muted font-light">
                  <li className="flex items-center gap-5">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Save lessons for later
                  </li>
                  <li className="flex items-center gap-5">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Bookmark specific topics
                  </li>
                  <li className="flex items-center gap-5">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Track your overall progress
                  </li>
                  <li className="flex items-center gap-5">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Resume instantly where you left off
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 - Custom UI Mockup (Flashcards) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16 lg:gap-32 group">
               <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] bg-card border border-border overflow-hidden shadow-xl shadow-border/30 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                 
                 <div className="relative w-64 h-80">
                    <div className="absolute inset-0 bg-background border border-border rounded-3xl transform rotate-6 shadow-md opacity-50"></div>
                    <div className="absolute inset-0 bg-background border border-border rounded-3xl transform -rotate-3 shadow-md opacity-80"></div>
                    <div className="absolute inset-0 bg-background border-2 border-primary/20 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 group-hover:-translate-y-4 group-hover:rotate-2 transition-all duration-500">
                      <BookOpen className="w-12 h-12 text-primary/50 mb-6" />
                      <div className="w-3/4 h-4 bg-foreground/20 rounded-full mb-3"></div>
                      <div className="w-1/2 h-4 bg-foreground/20 rounded-full"></div>
                    </div>
                 </div>

              </div>
              <div className="w-full md:w-1/2">
                <div className="w-12 h-[3px] bg-primary mb-10"></div>
                <h3 className="font-serif text-5xl font-medium leading-[1.1] mb-10">
                  Practice after every lesson.
                </h3>
                <p className="text-xl text-muted leading-relaxed font-light mb-10">
                  Reading is just the beginning. Solidify your understanding with targeted, immediate practice questions and flashcards that ensure concepts are deeply rooted in your memory.
                </p>
              </div>
            </div>

             {/* Feature 3 - Custom UI Mockup (Progress Dashboard) */}
             <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-32 group">
               <div className="w-full md:w-1/2 relative h-[500px] rounded-[3rem] bg-card border border-border overflow-hidden shadow-xl shadow-border/30 p-10 flex flex-col gap-8 group-hover:border-primary/30 transition-colors">
                
                <div className="flex gap-8 items-center border-b border-border pb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center">
                    <span className="font-serif text-2xl font-bold">85%</span>
                  </div>
                  <div className="flex flex-col gap-3 flex-grow">
                     <div className="w-1/2 h-5 bg-foreground/10 rounded-md"></div>
                     <div className="w-full h-3 bg-border/50 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-end gap-4 h-40 mt-auto opacity-70">
                  <div className="w-1/6 h-1/3 bg-border rounded-t-md group-hover:bg-primary/20 transition-colors"></div>
                  <div className="w-1/6 h-1/2 bg-border rounded-t-md group-hover:bg-primary/30 transition-colors"></div>
                  <div className="w-1/6 h-full bg-border rounded-t-md group-hover:bg-primary/40 transition-colors"></div>
                  <div className="w-1/6 h-2/3 bg-border rounded-t-md group-hover:bg-primary/50 transition-colors"></div>
                  <div className="w-1/6 h-5/6 bg-primary/60 rounded-t-md group-hover:bg-primary transition-colors shadow-[0_0_20px_rgba(31,78,216,0.2)]"></div>
                </div>

              </div>
              <div className="w-full md:w-1/2">
                <div className="w-12 h-[3px] bg-primary mb-10"></div>
                <h3 className="font-serif text-5xl font-medium leading-[1.1] mb-10">
                  Review difficult topics easily.
                </h3>
                <p className="text-xl text-muted leading-relaxed font-light mb-10">
                  Our system identifies areas where you struggle and gently reintroduces them over time. It’s a personalized path to mastery, without the frustration.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 9: Community Picks */}
        <section className="py-16 md:py-24 bg-card border-y border-border">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <h2 className="font-sans font-bold text-sm mb-12 text-muted uppercase tracking-[0.2em]">Trending Now</h2>
            <div className="flex flex-wrap justify-center gap-5">
              {["Calculus", "Photosynthesis", "Machine Learning", "Shakespeare", "World War II", "Thermodynamics", "JavaScript"].map(topic => (
                <div key={topic} className="px-8 py-4 rounded-full border border-border bg-background text-foreground font-serif text-xl hover:border-primary hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-300 flex items-center gap-3">
                  <span className="text-xl">🔥</span> {topic}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10: Quotes */}
        <section className="py-24 md:py-48 px-4 md:px-8 flex items-center justify-center text-center max-w-5xl mx-auto">
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] text-foreground">
            "The beautiful thing about learning is that nobody can take it away from you."
          </h2>
        </section>
      </main>

      {/* SECTION 11: Beautiful Footer */}
      <footer className="bg-card border-t border-border pt-16 md:pt-32 pb-8 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-32">
            
            {/* Added short descriptive line as requested */}
            <div className="col-span-1 md:col-span-4 lg:col-span-2">
              <div className="font-serif text-3xl font-semibold tracking-tight mb-8">Avenpath.</div>
              <p className="text-muted text-base max-w-sm leading-relaxed font-light">
                Learn with structured lessons, practical quizzes, and curated study paths across a growing library of subjects.
              </p>
            </div>
            
            <div className="lg:col-start-4">
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-foreground">Subjects</h4>
              <ul className="space-y-5 text-sm text-muted font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Mathematics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Programming</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Biology</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Physics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">History</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-foreground">Company</h4>
              <ul className="space-y-5 text-sm text-muted font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-foreground">Legal</h4>
              <ul className="space-y-5 text-sm text-muted font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-border gap-8">
            <div className="text-sm text-muted font-medium">
              © {new Date().getFullYear()} Avenpath. All rights reserved.
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-muted font-medium hover:text-foreground transition-colors text-sm">Twitter</a>
              <a href="#" className="text-muted font-medium hover:text-foreground transition-colors text-sm">Instagram</a>
              <a href="#" className="text-muted font-medium hover:text-foreground transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
