"use client";

import Link from "next/link";
import { Layers, Plus, Search, Brain, CheckCircle2, CircleDashed, Flame, Play } from "lucide-react";

export default function FlashcardsDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Flashcards</h1>
          <p className="text-muted-foreground font-medium">Master concepts efficiently using spaced repetition.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search your decks..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <button className="bg-foreground text-background px-4 py-3 rounded-xl font-bold flex items-center gap-2 shrink-0 hover:scale-[1.02] transition-transform">
            <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Create Deck</span>
          </button>
        </div>
      </div>

      {/* TODAY'S REVIEW HERO */}
      <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-foreground/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10">
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Today's Review
          </span>
          <h2 className="text-4xl font-extrabold mb-4">42 Cards Waiting</h2>
          
          <div className="flex gap-6 text-sm font-bold mt-6">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Mastered</span>
              <span className="text-2xl">242</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><CircleDashed className="w-4 h-4 text-orange-500" /> Learning</span>
              <span className="text-2xl">38</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><Brain className="w-4 h-4 text-blue-500" /> New</span>
              <span className="text-2xl">14</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          <Link href="/flashcards/review-all" className="w-full md:w-auto bg-foreground text-background px-8 py-5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
            Start Review <Play className="w-5 h-5 fill-background" />
          </Link>
        </div>
      </div>

      {/* DECK GRID */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-muted-foreground" /> Your Decks
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Biology: Cells", cards: 420, level: "Intermediate", due: 12, color: "bg-subject-science" },
            { title: "Calculus Formulas", cards: 260, level: "Advanced", due: 5, color: "bg-subject-math" },
            { title: "Organic Chemistry", cards: 610, level: "Intermediate", due: 25, color: "bg-orange-500" },
            { title: "World Capitals", cards: 195, level: "Beginner", due: 0, color: "bg-subject-history" },
            { title: "Python Basics", cards: 150, level: "Beginner", due: 0, color: "bg-blue-500" },
          ].map((deck, i) => (
            <Link key={i} href={`/flashcards/${i+1}`} className="bg-card border border-border p-6 rounded-2xl group hover:border-foreground/30 transition-colors flex flex-col justify-between h-48">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-extrabold text-xl line-clamp-1">{deck.title}</h3>
                  {deck.due > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shrink-0">
                      {deck.due} due
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <div className={`w-2 h-2 rounded-full ${deck.color}`} /> {deck.level}
                </div>
              </div>
              
              <div className="flex items-end justify-between mt-6">
                <span className="font-bold text-muted-foreground">{deck.cards} Cards</span>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
