"use client";

import { useState } from "react";
import { Filter, Lightbulb, ChevronDown, ChevronUp, Bookmark, Flag, Target, Clock, AlertTriangle, ArrowRight } from "lucide-react";

export default function PracticeCenter() {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const options = [
    { id: 1, text: "x = 2, y = -1" },
    { id: 2, text: "x = -2, y = 1" },
    { id: 3, text: "x = 3, y = 0" },
    { id: 4, text: "x = 1, y = 2" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 flex flex-col md:flex-row gap-8">
      
      {/* MOBILE FILTER TOGGLE (Hidden on Desktop) */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Practice Center</h1>
        <button className="bg-muted p-2 rounded-lg text-foreground flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filters
        </button>
      </div>

      {/* LEFT SIDEBAR: FILTERS */}
      <div className="hidden md:block w-[280px] shrink-0 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Practice</h1>
          <p className="text-muted-foreground font-medium text-sm">Unlimited practice to hone your skills.</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Subject</label>
            <select className="w-full bg-card border border-border px-4 py-2.5 rounded-xl font-bold text-sm focus:outline-none focus:border-foreground">
              <option>Mathematics</option>
              <option>Biology</option>
              <option>Physics</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Topic</label>
            <select className="w-full bg-card border border-border px-4 py-2.5 rounded-xl font-bold text-sm focus:outline-none focus:border-foreground">
              <option>Systems of Equations</option>
              <option>Quadratic Functions</option>
              <option>Geometry</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-card border border-border py-2 rounded-lg text-xs font-bold hover:border-foreground/30">Beg.</button>
              <button className="bg-foreground text-background py-2 rounded-lg text-xs font-bold">Int.</button>
              <button className="bg-card border border-border py-2 rounded-lg text-xs font-bold hover:border-foreground/30">Adv.</button>
            </div>
          </div>
        </div>

        {/* SUMMARY WIDGET */}
        <div className="bg-card border border-border rounded-2xl p-5 mt-8">
          <h3 className="font-extrabold text-sm mb-4">Session Summary</h3>
          <div className="space-y-4 text-sm font-bold">
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Target className="w-4 h-4" /> Accuracy</span>
              <span className="text-green-500">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Filter className="w-4 h-4" /> Answered</span>
              <span>12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Time</span>
              <span>14:20</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Weak Areas</h4>
            <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1.5 rounded-lg inline-block">
              Linear Substitution
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: MAIN CONTENT */}
      <div className="flex-1 space-y-6">
        
        {/* QUESTION CARD */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 relative">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-subject-math" /> Mathematics • Intermediate
            </div>
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-foreground transition-colors p-2" title="Save Question">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="text-muted-foreground hover:text-red-500 transition-colors p-2" title="Report Issue">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold leading-relaxed mb-6">
            Solve the following system of linear equations:
            <br /><br />
            2x + 3y = 1<br />
            4x - y = 9
          </h2>

          <div className="space-y-3 mb-8">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedAnswer(opt.id)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 font-bold text-lg transition-colors flex items-center justify-between group ${
                  selectedAnswer === opt.id 
                    ? "border-foreground bg-foreground/5 text-foreground" 
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <span>{opt.text}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-muted text-foreground hover:bg-border transition-colors flex items-center justify-center gap-2 flex-1"
            >
              <Lightbulb className="w-4 h-4" /> {showHint ? "Hide Hint" : "Need a Hint?"}
            </button>
            <button 
              onClick={() => setShowSolution(!showSolution)}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-muted text-foreground hover:bg-border transition-colors flex items-center justify-center gap-2 flex-1"
            >
              {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />} Reveal Solution
            </button>
            <button 
              className="px-6 py-3 rounded-xl font-extrabold text-sm bg-foreground text-background hover:opacity-90 transition-opacity flex items-center justify-center gap-2 flex-1"
            >
              Check Answer <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* HINT EXPAND */}
          {showHint && (
            <div className="mt-6 p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl animate-in slide-in-from-top-4 fade-in">
              <h4 className="text-orange-700 dark:text-orange-400 font-extrabold flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5" /> Hint
              </h4>
              <p className="font-medium text-sm">
                Try multiplying the second equation by 3 to eliminate the 'y' variable when you add the two equations together.
              </p>
            </div>
          )}

          {/* SOLUTION EXPAND */}
          {showSolution && (
            <div className="mt-6 p-6 sm:p-8 bg-muted/50 border border-border rounded-2xl animate-in slide-in-from-top-4 fade-in">
              <h4 className="font-extrabold text-lg mb-6 flex items-center gap-2">
                Step-by-step Solution
              </h4>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <p className="font-bold mb-2">Multiply the second equation by 3 to eliminate y:</p>
                    <p className="font-mono text-sm bg-card px-4 py-2 rounded-lg border border-border inline-block">3(4x - y) = 3(9)  →  12x - 3y = 27</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <p className="font-bold mb-2">Add the new equation to the first equation:</p>
                    <div className="font-mono text-sm bg-card px-4 py-3 rounded-lg border border-border inline-block space-y-1">
                      <div>&nbsp; 2x + 3y = 1</div>
                      <div className="border-b border-border pb-1">+ 12x - 3y = 27</div>
                      <div className="pt-1">&nbsp; 14x &nbsp;&nbsp;&nbsp;&nbsp; = 28</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <p className="font-bold mb-2">Solve for x, then substitute back to find y:</p>
                    <p className="font-mono text-sm bg-card px-4 py-2 rounded-lg border border-border inline-block mb-2">x = 2</p>
                    <p className="font-mono text-sm bg-card px-4 py-2 rounded-lg border border-border inline-block">4(2) - y = 9  →  8 - y = 9  →  y = -1</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
