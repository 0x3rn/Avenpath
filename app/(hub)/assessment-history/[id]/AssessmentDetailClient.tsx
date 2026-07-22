"use client";

import Link from "next/link";
import { ArrowLeft, Award, GraduationCap, CheckCircle2, XCircle, Calendar, HelpCircle, FileCheck, RefreshCw, Trophy, BookOpen, Brain } from "lucide-react";

export default function AssessmentDetailClient({ submission }: { submission: any }) {
  const isExam = submission.assessmentType === "exam";
  const isTest = submission.assessmentType === "test";
  const pct = submission.percentage || 0;

  const isPassed = pct >= 60;
  const isHighGrade = pct >= 80;

  const breakdown: any[] = Array.isArray(submission.breakdown) ? submission.breakdown : [];

  return (
    <div className="space-y-8">
      {/* BACK NAVIGATION */}
      <div>
        <Link
          href="/assessment-history"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors bg-card border border-border px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessment History
        </Link>
      </div>

      {/* HERO BANNER */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
              isExam ? "bg-amber-500/10 text-amber-500" : isTest ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
            }`}>
              {submission.assessmentType}
            </span>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(submission.completedAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{submission.title}</h1>

          <p className="text-sm font-semibold text-muted-foreground">
            Complete question-by-question review, student answers, model solutions, and AI evaluation feedback.
          </p>
        </div>

        {/* SCORE BADGE CARD */}
        <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center shrink-0 min-w-[180px] ${
          isHighGrade
            ? "bg-green-500/10 border-green-500/30 text-green-500"
            : isPassed
            ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
            : "bg-orange-500/10 border-orange-500/30 text-orange-500"
        }`}>
          <div className="text-4xl font-black">{pct}%</div>
          <div className="text-xs font-extrabold uppercase tracking-wider mt-1">
            Score: {submission.score} / {submission.totalScore}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-extrabold mt-2 px-2.5 py-0.5 rounded-full bg-card/60">
            {isHighGrade ? <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> : null}
            {isHighGrade ? "Grade A • Excellent" : isPassed ? "Grade B • Passed" : "Needs Review"}
          </div>
        </div>
      </div>

      {/* QUESTIONS BREAKDOWN SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" /> Detailed Question & Answer Breakdown
          </h2>
          <span className="text-xs font-bold text-muted-foreground">
            {breakdown.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {breakdown.map((q: any, idx: number) => {
            const pts = q.points_awarded || 0;
            const maxPts = q.max_points || 5;
            const isFullScore = pts >= maxPts;
            const isPartialScore = pts > 0 && pts < maxPts;

            return (
              <div
                key={q.question_id || idx}
                className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm"
              >
                {/* QUESTION HEADER */}
                <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-muted text-foreground flex items-center justify-center font-black text-xs shrink-0">
                      #{idx + 1}
                    </span>
                    <h3 className="font-extrabold text-base text-foreground">
                      {q.question_text || q.question || `Question ${idx + 1}`}
                    </h3>
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                    isFullScore
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : isPartialScore
                      ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}>
                    {isFullScore ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {pts} / {maxPts} pts
                  </span>
                </div>

                {/* STUDENT ANSWER */}
                <div className="space-y-1">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Your Submitted Answer:</div>
                  <div className={`p-3.5 rounded-xl border text-sm font-semibold ${
                    isFullScore
                      ? "bg-green-500/5 border-green-500/20 text-foreground"
                      : isPartialScore
                      ? "bg-blue-500/5 border-blue-500/20 text-foreground"
                      : "bg-red-500/5 border-red-500/20 text-foreground"
                  }`}>
                    {q.student_answer ? q.student_answer : <span className="italic text-muted-foreground opacity-70">No answer submitted (Left blank)</span>}
                  </div>
                </div>

                {/* CORRECT MODEL ANSWER */}
                {q.correct_answer && (
                  <div className="space-y-1">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-green-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct / Model Answer:
                    </div>
                    <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-sm font-semibold text-foreground">
                      {q.correct_answer}
                    </div>
                  </div>
                )}

                {/* AI FEEDBACK */}
                {q.feedback && (
                  <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs font-medium text-muted-foreground space-y-1">
                    <div className="font-extrabold text-foreground flex items-center gap-1.5 text-xs">
                      <Brain className="w-3.5 h-3.5 text-amber-500" /> AI Evaluator Explanation:
                    </div>
                    <p className="leading-relaxed">{q.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}

          {breakdown.length === 0 && (
            <div className="p-8 text-center bg-card border border-border rounded-2xl text-sm font-medium text-muted-foreground">
              No detailed question-by-question breakdown was recorded for this attempt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
