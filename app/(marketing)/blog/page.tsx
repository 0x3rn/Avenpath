"use client";

import Link from "next/link";
import { Search, ArrowRight, Clock, User, Tag } from "lucide-react";

export default function BlogHomepage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-500">
      
      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Learning Journal</h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium mb-8">
          Discover study techniques, learning science, platform updates, productivity advice, and educational resources to help you become a better learner.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">Latest Articles</button>
          <button className="bg-muted text-foreground px-6 py-3 rounded-xl font-bold hover:bg-muted/80 transition-colors">Browse Categories</button>
        </div>
      </div>

      {/* FEATURED ARTICLE */}
      <div className="mb-16 group cursor-pointer">
        <Link href="/blog/how-active-recall-works">
          <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10" />
            <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop" alt="Study" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Study Techniques</span>
                <span className="flex items-center gap-1.5 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> 12 min read</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 group-hover:text-blue-200 transition-colors">How Active Recall Can Double Your Memory Retention</h2>
              <div className="flex items-center gap-2 font-bold text-sm text-white/80 group-hover:text-white transition-colors">
                Read Article <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* SEARCH & CATEGORIES */}
      <div className="mb-12">
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search articles..."
            className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-2xl font-bold outline-none focus:border-foreground/30 transition-colors text-lg"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {["Study Tips", "Learning Science", "Productivity", "Exam Preparation", "Technology", "Announcements", "Guides", "University"].map((cat, i) => (
            <button key={i} className="px-4 py-2 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        
        {/* LATEST ARTICLES */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-extrabold tracking-tight mb-6">Latest Articles</h3>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { cat: "Study Tips", time: "8 min", title: "How to Study Smarter Instead of Longer", desc: "Learn practical techniques that improve retention without increasing study hours." },
              { cat: "Learning Science", time: "15 min", title: "The Neuroscience of Note-Taking", desc: "Why writing by hand still beats typing when it comes to memory consolidation." },
              { cat: "Productivity", time: "5 min", title: "Beating Procrastination in College", desc: "A psychological approach to overcoming the urge to delay your assignments." },
              { cat: "Announcements", time: "3 min", title: "Avenpath v2.0 is Here", desc: "Explore the new features including personalized recommendations and study planners." },
            ].map((art, i) => (
              <Link href={`/blog/article-${i}`} key={i} className="group flex flex-col">
                <div className="aspect-[4/3] rounded-2xl bg-muted overflow-hidden mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-center gap-3 mb-2 text-xs font-bold text-muted-foreground">
                  <span className="text-blue-500">{art.cat}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {art.time}</span>
                </div>
                <h4 className="text-xl font-extrabold mb-2 group-hover:text-blue-500 transition-colors">{art.title}</h4>
                <p className="text-muted-foreground font-medium text-sm line-clamp-2 flex-1">{art.desc}</p>
                <div className="flex items-center gap-2 text-sm font-bold mt-4">
                  Read More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-12">
          
          {/* Popular */}
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight mb-6">Popular This Week</h3>
            <div className="space-y-6">
              {[
                "Top 5 Memory Techniques",
                "Best Study Apps of 2026",
                "Preparing for University Exams",
                "The Ultimate Pomodoro Guide"
              ].map((title, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex gap-4 items-start">
                    <span className="text-4xl font-extrabold text-muted/50 group-hover:text-blue-500 transition-colors">0{i+1}</span>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-blue-500 transition-colors">{title}</h4>
                      <p className="text-xs font-bold text-muted-foreground mt-1">5 min read</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h4 className="font-extrabold text-xl mb-2">Never Miss an Article</h4>
            <p className="text-sm font-medium text-muted-foreground mb-6">Get weekly study tips and product updates delivered to your inbox.</p>
            <div className="space-y-3">
              <input type="email" placeholder="Email Address" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-foreground/30 transition-colors" />
              <button className="w-full bg-foreground text-background font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">Subscribe</button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2"><Tag className="w-5 h-5" /> Tags</h3>
            <div className="flex flex-wrap gap-2">
              {["Flashcards", "Revision", "Biology", "Calculus", "Motivation", "Memory", "Productivity"].map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-muted rounded-lg text-xs font-bold text-muted-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer">#{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
