"use client";

import Link from "next/link";
import { Check, X, RotateCcw, ArrowRight, Target, Clock, BookOpen } from "lucide-react";

export default function QuizResults() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 py-12">
      
      {/* HEADER / CELEBRATION */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-full mb-6">
          <Target className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Excellent Work!</h1>
        <p className="text-lg font-medium text-muted-foreground">You've completed the Organic Chemistry Review.</p>
      </div>

      {/* CORE STATS */}
      <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl shadow-foreground/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
          
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <div className="text-5xl font-extrabold text-foreground mb-2">18 <span className="text-2xl text-muted-foreground">/ 20</span></div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Correct Answers</div>
          </div>
          
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <div className="text-5xl font-extrabold text-green-500 mb-2">90%</div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Final Score</div>
          </div>

          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <div className="flex items-center gap-2 text-3xl font-extrabold text-foreground mb-3">
              <Clock className="w-8 h-8 text-muted-foreground" /> 8m 43s
            </div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Time</div>
          </div>

        </div>
      </div>

      {/* STRENGTHS & WEAKNESSES */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Strengths */}
        <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-8">
          <h3 className="text-xl font-extrabold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2">
            <Check className="w-6 h-6" /> Strengths
          </h3>
          <ul className="space-y-4">
            {["Alkane Naming Conventions", "Functional Groups", "Isomerism"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-bold text-green-900 dark:text-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Needs Improvement */}
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-3xl p-8">
          <h3 className="text-xl font-extrabold text-orange-700 dark:text-orange-400 mb-6 flex items-center gap-2">
            <X className="w-6 h-6" /> Needs Improvement
          </h3>
          <ul className="space-y-4">
            {["Reaction Mechanisms", "Stereochemistry"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-bold text-orange-900 dark:text-orange-100">
                <div className="w-2 h-2 rounded-full bg-orange-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border">
        <Link href="/quizzes/1/review" className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold bg-muted text-foreground hover:bg-border transition-colors flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5" /> Review Answers
        </Link>
        <Link href="/quizzes/1" className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold bg-muted text-foreground hover:bg-border transition-colors flex items-center justify-center gap-2">
          <RotateCcw className="w-5 h-5" /> Retake Quiz
        </Link>
        <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold bg-foreground text-background hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          Continue Learning <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

    </div>
  );
}
