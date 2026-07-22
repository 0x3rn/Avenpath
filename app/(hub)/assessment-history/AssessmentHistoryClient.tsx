"use client";

import { useState } from "react";
import { History, Award, Sparkles, HelpCircle, FileCheck, CheckCircle2, XCircle, ChevronRight, Calendar, Search, Filter, ArrowLeft, Trophy, Percent } from "lucide-react";
import Link from "next/link";

export default function AssessmentHistoryClient({ initialHistory }: { initialHistory: any[] }) {
  const [history] = useState<any[]>(initialHistory || []);
  const [filterType, setFilterType] = useState<"all" | "quiz" | "test" | "exam">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);

  // Calculations
  const filteredHistory = history.filter(item => {
    const matchesType = filterType === "all" || item.assessmentType === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalAttempts = history.length;
  const avgPercentage = totalAttempts > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalAttempts)
    : 0;

  const examsPassed = history.filter(h => h.assessmentType === "exam" && h.percentage >= 60).length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-extrabold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" /> Assessment Performance & History
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Past Assessment Attempts</h1>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Review your historical performance, AI feedback, and detailed question breakdowns across all quizzes, tests, and exams.
          </p>
        </div>

        <Link
          href="/take-test"
          className="bg-foreground text-background font-extrabold text-sm px-6 py-3.5 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Take New Assessment
        </Link>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-extrabold shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Completed</div>
            <div className="text-2xl font-black text-foreground mt-0.5">{totalAttempts}</div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center font-extrabold shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average Score</div>
            <div className="text-2xl font-black text-foreground mt-0.5">{avgPercentage}%</div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Exams Passed</div>
            <div className="text-2xl font-black text-foreground mt-0.5">{examsPassed}</div>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past assessments by title..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-foreground/30 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-card border border-border p-1 rounded-xl shrink-0 overflow-x-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              filterType === "all" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilterType("quiz")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              filterType === "quiz" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setFilterType("test")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              filterType === "test" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tests
          </button>
          <button
            onClick={() => setFilterType("exam")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              filterType === "exam" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Exams
          </button>
        </div>
      </div>

      {/* HISTORY CARDS LIST */}
      <div className="space-y-4">
        {filteredHistory.map((item) => {
          const isExam = item.assessmentType === "exam";
          const isTest = item.assessmentType === "test";
          const pct = item.percentage || 0;

          const isHighGrade = pct >= 80;
          const isMedGrade = pct >= 60;

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-foreground/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                  isExam
                    ? "bg-amber-500/10 text-amber-500"
                    : isTest
                    ? "bg-blue-500/10 text-blue-500"
                    : "bg-purple-500/10 text-purple-500"
                }`}>
                  {isExam ? <Award className="w-6 h-6" /> : isTest ? <FileCheck className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-foreground">{item.title}</h3>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isExam ? "bg-amber-500/10 text-amber-500" : isTest ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                    }`}>
                      {item.assessmentType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>•</span>
                    <span>Score: {item.score} / {item.totalScore}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                <div className={`px-4 py-2 rounded-xl text-center font-black text-sm ${
                  isHighGrade
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : isMedGrade
                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                    : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                }`}>
                  {pct}%
                </div>

                <Link
                  href={`/assessment-history/${item.id}`}
                  className="bg-muted hover:bg-muted/80 text-foreground font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                >
                  Review Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}

        {filteredHistory.length === 0 && (
          <div className="p-12 text-center bg-card border border-border rounded-3xl space-y-3">
            <History className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-extrabold text-foreground">No Assessment History Found</h3>
            <p className="text-xs font-semibold text-muted-foreground max-w-sm mx-auto">
              You haven't completed any assessments matching this filter yet. Take a quiz, test, or exam to track your history!
            </p>
            <Link
              href="/take-test"
              className="inline-flex items-center gap-2 bg-foreground text-background font-extrabold text-xs px-5 py-2.5 rounded-xl hover:opacity-90 transition-all mt-2"
            >
              Take First Assessment <Sparkles className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        )}
      </div>

      {/* INTERACTIVE BREAKDOWN REVIEW MODAL */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider">
                  Assessment History Review
                </span>
                <h2 className="text-xl font-black text-foreground mt-0.5">{selectedAttempt.title}</h2>
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  Completed on {new Date(selectedAttempt.completedAt).toLocaleString()} • Score: {selectedAttempt.score}/{selectedAttempt.totalScore} ({selectedAttempt.percentage}%)
                </p>
              </div>

              <button
                onClick={() => setSelectedAttempt(null)}
                className="bg-muted hover:bg-muted/80 text-foreground font-extrabold text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            {/* BREAKDOWN LIST */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Detailed Question Breakdown & AI Feedback</h3>

              {Array.isArray(selectedAttempt.breakdown) && selectedAttempt.breakdown.map((q: any, idx: number) => {
                const isPassed = (q.points_awarded || 0) > 0;

                return (
                  <div key={q.question_id || idx} className="p-5 rounded-2xl bg-muted/30 border border-border space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-sm text-foreground">
                        Question #{idx + 1}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isPassed ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {q.points_awarded || 0} / {q.max_points || 5} pts
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">Your Answer: </span>
                      {q.student_answer ? <span className="font-mono bg-card px-2 py-0.5 rounded text-foreground">{q.student_answer}</span> : <span className="italic opacity-60">Left blank</span>}
                    </div>

                    {q.correct_answer && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">Correct Answer: </span>
                        <span className="font-mono bg-green-500/10 text-green-500 px-2 py-0.5 rounded">{q.correct_answer}</span>
                      </div>
                    )}

                    {q.feedback && (
                      <div className="p-3 rounded-xl bg-card border border-border text-xs font-medium text-muted-foreground mt-2">
                        <span className="font-extrabold text-foreground block mb-0.5">AI Evaluator Feedback:</span>
                        {q.feedback}
                      </div>
                    )}
                  </div>
                );
              })}

              {(!selectedAttempt.breakdown || selectedAttempt.breakdown.length === 0) && (
                <div className="p-6 text-center text-xs font-semibold text-muted-foreground">
                  No question-by-question breakdown saved for this attempt.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
