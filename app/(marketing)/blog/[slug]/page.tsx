"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Share2, Bookmark, ChevronLeft, MessageCircle, Send, Link as LinkIcon } from "lucide-react";

export default function BlogPost() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative animate-in fade-in duration-500 pb-24">
      
      {/* READING PROGRESS */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-muted">
        <div className="h-full bg-blue-500 transition-all duration-150 ease-out" style={{ width: `${scrollProgress * 100}%` }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        {/* HERO */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 text-xs font-bold uppercase tracking-wider">
            <span className="text-blue-500">Study Techniques</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">October 24, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 leading-tight">How Active Recall Can Double Your Memory Retention</h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-y border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center font-bold">JD</div>
              <div className="text-left">
                <div className="font-bold text-sm">John Doe</div>
                <div className="text-xs font-medium text-muted-foreground">Learning Scientist</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"><MessageCircle className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"><LinkIcon className="w-4 h-4" /></button>
              <div className="w-[1px] h-6 bg-border mx-2" />
              <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"><Bookmark className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="w-full aspect-[2/1] bg-muted rounded-3xl mb-16 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* CONTENT LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_minmax(auto,700px)_1fr] gap-12">
        
        {/* LEFT MARGIN (Share) */}
        <div className="hidden lg:block relative">
          <div className="sticky top-32 flex flex-col items-end gap-3 pr-8 border-r border-border">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Share</div>
            <button className="p-3 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-card border border-border transition-colors"><MessageCircle className="w-5 h-5" /></button>
            <button className="p-3 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-card border border-border transition-colors"><LinkIcon className="w-5 h-5" /></button>
            <button className="p-3 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-card border border-border transition-colors"><Send className="w-5 h-5" /></button>
            <button className="p-3 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-card border border-border transition-colors"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>

        {/* MAIN ARTICLE */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-extrabold prose-p:font-medium prose-p:leading-relaxed">
          <p>
            If you've ever spent hours reading a textbook only to forget everything the next day, you're not alone. Passive reading creates an illusion of competence—you feel like you know the material because it's right in front of you. But the moment you close the book, the knowledge vanishes.
          </p>
          <p>
            The solution to this widespread problem is <strong>active recall</strong>. In this comprehensive guide, we'll explore what active recall is, the science behind why it works, and how you can implement it in your daily study routine.
          </p>

          <h2>The Illusion of Competence</h2>
          <p>
            When we re-read our notes or highlight textbooks, our brains process the information fluently. This fluency tricks us into believing we have securely stored the information. However, <em>recognition</em> is very different from <em>recall</em>.
          </p>
          <blockquote className="border-l-4 border-blue-500 bg-blue-500/5 p-6 rounded-r-2xl text-blue-900 dark:text-blue-100 italic font-bold">
            "Testing yourself is not just a way to assess what you know—it is a way to change what you know."
          </blockquote>

          <h2>How Active Recall Works</h2>
          <p>
            Active recall involves retrieving information from memory without looking at the source material. Every time you struggle to remember a fact, you are strengthening the neural pathways associated with that memory.
          </p>
          <ul>
            <li><strong>Step 1:</strong> Read a section of your material.</li>
            <li><strong>Step 2:</strong> Close the book.</li>
            <li><strong>Step 3:</strong> Try to explain the concept out loud or write it down.</li>
            <li><strong>Step 4:</strong> Check your accuracy and review only what you missed.</li>
          </ul>

          <div className="bg-card border border-border rounded-2xl p-6 my-8 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">💡</div>
            <div>
              <h4 className="font-bold m-0 mb-1">Pro Tip</h4>
              <p className="text-sm m-0 text-muted-foreground">Combine Active Recall with Spaced Repetition (using flashcards) for the absolute best results. Avenpath's built-in flashcard system handles the spacing algorithms for you.</p>
            </div>
          </div>

          <h2>Conclusion</h2>
          <p>
            Stop wasting time passively reading. By forcing your brain to retrieve information, you build stronger, longer-lasting memories. Start small—try testing yourself at the end of your next study session.
          </p>
        </article>

        {/* RIGHT MARGIN (TOC) */}
        <div className="hidden lg:block relative">
          <div className="sticky top-32 pl-8 border-l border-border">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">On this page</div>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-bold text-foreground hover:text-blue-500 transition-colors">The Illusion of Competence</a></li>
              <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-500 transition-colors">How Active Recall Works</a></li>
              <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-500 transition-colors">Conclusion</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* AUTHOR & RELATED */}
      <div className="max-w-3xl mx-auto px-6 mt-16 pt-16 border-t border-border">
        
        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left mb-16">
          <div className="w-24 h-24 rounded-full bg-muted border-4 border-background shrink-0 flex items-center justify-center text-xl font-bold">JD</div>
          <div>
            <h3 className="text-xl font-extrabold mb-2">John Doe</h3>
            <p className="font-medium text-muted-foreground mb-4">John is a learning scientist and curriculum designer at Avenpath. He specializes in cognitive psychology and evidence-based study techniques.</p>
            <button className="text-sm font-bold text-blue-500 hover:underline">View all articles by John</button>
          </div>
        </div>

        <h3 className="text-2xl font-extrabold tracking-tight mb-8">Related Articles</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { title: "Spaced Repetition Guide", cat: "Study Tips" },
            { title: "How to Build Better Notes", cat: "Productivity" },
          ].map((art, i) => (
            <Link href="#" key={i} className="group bg-card border border-border rounded-2xl p-6 hover:border-foreground/30 transition-colors">
              <span className="text-xs font-bold text-blue-500 mb-2 block">{art.cat}</span>
              <h4 className="font-bold text-lg group-hover:text-blue-500 transition-colors">{art.title}</h4>
            </Link>
          ))}
        </div>

      </div>

    </div>
  );
}
