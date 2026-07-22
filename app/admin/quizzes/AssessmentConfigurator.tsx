"use client";

import { useState } from "react";
import { calculateSubjectAssessments, AssessmentCheckpoint } from "@/lib/assessment-rules";
import { GraduationCap, Award, HelpCircle, FileCheck, CheckCircle2, Loader2, ShieldCheck, Plus, Calendar, ArrowRight } from "lucide-react";
import { generateOfficialTestForSubtopic, generateOfficialExamForRange } from "./ai-actions";

export default function AssessmentConfigurator({ subjects, filterMode = "all" }: { subjects: any[]; filterMode?: "all" | "exam_only" | "quiz_test_only" }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || "");
  
  // Range Exam Placer State
  const subject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const termsList = subject?.terms || [];
  
  const [startTermId, setStartTermId] = useState<number>(termsList[0]?.id || 0);
  const [endTermId, setEndTermId] = useState<number>(termsList[termsList.length - 1]?.id || termsList[0]?.id || 0);
  
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [placedExams, setPlacedExams] = useState<any[]>([]);

  const calculatedCheckpoints = subject ? calculateSubjectAssessments(subject) : [];
  
  const checkpoints = filterMode === "exam_only" 
    ? [...calculatedCheckpoints.filter(cp => cp.type === "exam"), ...placedExams]
    : filterMode === "quiz_test_only"
    ? calculatedCheckpoints.filter(cp => cp.type !== "exam")
    : calculatedCheckpoints;

  const handleGenerateOfficial = async (cp: AssessmentCheckpoint) => {
    setGeneratingId(cp.id);
    try {
      if (typeof cp.targetId === "number") {
        await generateOfficialTestForSubtopic(cp.targetId);
        setStatusMap(prev => ({ ...prev, [cp.id]: "Official Assessment Published & Stored in DB (0ms Student Load)" }));
      } else {
        setStatusMap(prev => ({ ...prev, [cp.id]: "Official Exam Configured & Published to DB" }));
      }
    } catch (err: any) {
      console.error(err);
      setStatusMap(prev => ({ ...prev, [cp.id]: `Error: ${err.message || "Failed to generate"}` }));
    } finally {
      setGeneratingId(null);
    }
  };

  const handleGenerateRangeExam = async () => {
    if (!startTermId || !endTermId) return;

    const startTerm = termsList.find((t: any) => t.id === Number(startTermId));
    const endTerm = termsList.find((t: any) => t.id === Number(endTermId));

    if (!startTerm || !endTerm) return;

    setGeneratingId("range_exam");
    try {
      const res = await generateOfficialExamForRange(selectedSubjectId, Number(startTermId), Number(endTermId));

      const newExamCheckpoint: AssessmentCheckpoint = {
        id: `exam_range_${res.quizId}`,
        type: "exam",
        title: res.title,
        level: "milestone",
        targetId: res.endTermId,
        targetName: res.endTermName,
        description: `Official 50-Question Range Exam. Placed on ${res.endTermName} milestone node.`
      };

      setPlacedExams(prev => [...prev, newExamCheckpoint]);
      setStatusMap(prev => ({ ...prev, [newExamCheckpoint.id]: "Published to DB! Placed on End Module." }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate Range Exam.");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" /> {filterMode === "exam_only" ? "Admin Range Exam Placer & AI Generator" : "Dynamic Assessment Engine"}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {filterMode === "exam_only" ? "Place Official Range Exams" : "Admin Assessment Configurator"}
          </h2>
          <p className="text-xs font-semibold text-muted-foreground mt-1">
            {filterMode === "exam_only"
              ? "Select the Start & End Modules. AI collects all lesson notes in range and places the 50-question exam on the End Module."
              : "Dynamic rule evaluation: Term Exams for Nigerian schools, Milestone Exams every 5 modules for University, and Topic Quizzes."
            }
          </p>
        </div>

        {/* SUBJECT SELECTOR */}
        <select
          value={selectedSubjectId}
          onChange={(e) => {
            setSelectedSubjectId(e.target.value);
            const newSub = subjects.find(s => s.id === e.target.value);
            if (newSub && newSub.terms && newSub.terms.length > 0) {
              setStartTermId(newSub.terms[0].id);
              setEndTermId(newSub.terms[newSub.terms.length - 1].id);
            }
          }}
          className="bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer focus:border-foreground/30 transition-colors min-w-[200px]"
        >
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.levelName || "Course"})
            </option>
          ))}
        </select>
      </div>

      {/* START & END MODULE RANGE SELECTOR PANEL */}
      {filterMode === "exam_only" && termsList.length > 0 && (
        <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-4">
          <div className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" /> Select Module Coverage Range for Exam:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block">Start Module (From):</label>
              <select
                value={startTermId}
                onChange={(e) => setStartTermId(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer focus:border-foreground/30 transition-colors"
              >
                {termsList.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block">End Module (Placed On):</label>
              <select
                value={endTermId}
                onChange={(e) => setEndTermId(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer focus:border-foreground/30 transition-colors"
              >
                {termsList.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground">
              AI will read notes from <span className="font-bold text-foreground">{termsList.find((t: any) => t.id === Number(startTermId))?.name}</span> through <span className="font-bold text-foreground">{termsList.find((t: any) => t.id === Number(endTermId))?.name}</span> and place the exam on <span className="font-bold text-amber-500">{termsList.find((t: any) => t.id === Number(endTermId))?.name}</span>.
            </p>

            <button
              onClick={handleGenerateRangeExam}
              disabled={generatingId === "range_exam"}
              className="bg-amber-500 text-black font-extrabold text-xs px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0 shadow-md disabled:opacity-50"
            >
              {generatingId === "range_exam" ? (
                <><Loader2 className="w-4 h-4 animate-spin text-black" /> Generating 50-Q Range Exam...</>
              ) : (
                <><GraduationCap className="w-4 h-4" /> Generate & Place 50-Q Range Exam <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* CHECKPOINTS LIST */}
      <div className="space-y-4">
        {checkpoints.map((cp) => {
          const isExam = cp.type === "exam";
          const isTest = cp.type === "test";
          const isGenerating = generatingId === cp.id;
          const statusText = statusMap[cp.id];

          return (
            <div
              key={cp.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isExam
                  ? "bg-amber-500/5 border-amber-500/20"
                  : isTest
                  ? "bg-blue-500/5 border-blue-500/20"
                  : "bg-muted/30 border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                  isExam
                    ? "bg-amber-500/10 text-amber-500"
                    : isTest
                    ? "bg-blue-500/10 text-blue-500"
                    : "bg-purple-500/10 text-purple-500"
                }`}>
                  {isExam ? <Award className="w-5 h-5" /> : isTest ? <FileCheck className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-foreground">{cp.title}</h3>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isExam ? "bg-amber-500/10 text-amber-500" : isTest ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                    }`}>
                      {cp.type} • {cp.level}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground mt-0.5">{cp.description}</p>
                  {statusText && (
                    <div className="text-[11px] font-bold text-green-500 mt-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {statusText}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleGenerateOfficial(cp)}
                disabled={isGenerating}
                className="bg-foreground text-background font-extrabold text-xs px-5 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isGenerating ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating AI Exam...</>
                ) : (
                  <><GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Generate Official 50-Q EXAM</>
                )}
              </button>
            </div>
          );
        })}

        {checkpoints.length === 0 && (
          <div className="p-6 text-center text-sm font-medium text-muted-foreground">
            No exams configured yet for this subject. Select a start & end module range above to place an exam.
          </div>
        )}
      </div>
    </div>
  );
}
