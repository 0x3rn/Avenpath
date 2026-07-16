"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings2, RotateCcw } from "lucide-react";

export default function FlashcardReview() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="max-w-3xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col pb-32 relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/flashcards" className="text-muted-foreground hover:text-foreground font-bold flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Decks
        </Link>
        <div className="text-sm font-bold bg-muted px-4 py-2 rounded-full flex items-center gap-2">
          Card 12 of 42
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* FLASHCARD */}
      <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000 w-full mb-12">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full max-w-2xl aspect-[4/3] sm:aspect-video relative cursor-pointer transition-all duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          
          {/* FRONT */}
          <div 
            className={`absolute inset-0 w-full h-full backface-hidden bg-card border-2 border-border rounded-[2rem] shadow-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-colors hover:border-foreground/30 ${isFlipped ? "invisible opacity-0" : "visible opacity-100"}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute top-8 left-8 text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Front
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-snug">
              What is photosynthesis?
            </h2>
            <div className="absolute bottom-8 flex items-center gap-2 text-muted-foreground font-bold text-sm">
              <RotateCcw className="w-4 h-4" /> Tap to flip
            </div>
          </div>

          {/* BACK */}
          <div 
            className={`absolute inset-0 w-full h-full backface-hidden bg-foreground text-background border-2 border-foreground rounded-[2rem] shadow-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-all ${isFlipped ? "visible opacity-100" : "invisible opacity-0"}`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="absolute top-8 left-8 text-sm font-bold text-background/60 uppercase tracking-wider">
              Back
            </div>
            <p className="text-2xl sm:text-3xl font-bold leading-snug">
              The process plants use to convert sunlight into chemical energy.
            </p>
          </div>

        </div>
      </div>

      {/* BOTTOM ACTIONS (SPACED REPETITION) */}
      <div className={`fixed bottom-0 right-0 left-0 md:left-[280px] p-4 bg-background/95 backdrop-blur border-t border-border z-20 flex justify-center transition-all duration-300 ${
        isFlipped ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}>
        <div className="max-w-3xl w-full grid grid-cols-4 gap-2 sm:gap-4">
          
          <button onClick={() => setIsFlipped(false)} className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold transition-colors bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white">
            <span className="text-xs sm:text-sm uppercase tracking-wider">Again</span>
            <span className="text-[10px] sm:text-xs opacity-70">&lt; 1m</span>
          </button>
          
          <button onClick={() => setIsFlipped(false)} className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold transition-colors bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white">
            <span className="text-xs sm:text-sm uppercase tracking-wider">Hard</span>
            <span className="text-[10px] sm:text-xs opacity-70">6m</span>
          </button>
          
          <button onClick={() => setIsFlipped(false)} className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold transition-colors bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500 hover:text-white">
            <span className="text-xs sm:text-sm uppercase tracking-wider">Good</span>
            <span className="text-[10px] sm:text-xs opacity-70">10m</span>
          </button>
          
          <button onClick={() => setIsFlipped(false)} className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 rounded-xl font-bold transition-colors bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white">
            <span className="text-xs sm:text-sm uppercase tracking-wider">Easy</span>
            <span className="text-[10px] sm:text-xs opacity-70">4d</span>
          </button>

        </div>
      </div>

    </div>
  );
}
