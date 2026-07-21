"use client";

import { useState } from "react";
import { Copy, RotateCcw, ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";

export interface Flashcard {
  front: string;
  back: string;
}

export default function LessonFlashcards({ cards }: { cards: Flashcard[] | null | undefined }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="my-16 p-6 md:p-8 bg-card border-2 border-border rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg flex items-center gap-2 w-fit">
            <Copy className="w-4 h-4" /> Active Recall
          </span>
          <h3 className="text-2xl font-extrabold mt-3">Master Key Concepts</h3>
        </div>
        <span className="text-sm font-bold text-muted-foreground bg-muted px-4 py-2 rounded-xl">
          Card {currentIndex + 1} of {cards.length}
        </span>
      </div>

      {/* The Flippable Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[250px] p-8 sm:p-12 bg-background border-2 border-border hover:border-foreground/30 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 select-none group"
      >
        {!isFlipped ? (
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
              {currentCard.front}
            </p>
            <span className="text-sm font-bold text-muted-foreground mt-8 flex items-center justify-center gap-2 group-hover:text-foreground transition-colors">
              <Lightbulb className="w-4 h-4" /> Click to reveal answer
            </span>
          </div>
        ) : (
          <div>
            <p className="text-xl sm:text-2xl font-bold text-indigo-500 dark:text-indigo-400 leading-snug">
              {currentCard.back}
            </p>
            <span className="text-sm font-bold text-muted-foreground mt-8 flex items-center justify-center gap-2 group-hover:text-foreground transition-colors">
              <RotateCcw className="w-4 h-4" /> Click to see question
            </span>
          </div>
        )}
      </div>

      {/* Card Navigation Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-full sm:w-auto px-6 py-3 font-bold rounded-xl border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="text-sm font-extrabold text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          {isFlipped ? "Show Question" : "Flip Card"}
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="w-full sm:w-auto px-6 py-3 font-bold rounded-xl bg-foreground text-background disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
