"use client";

import { useState } from "react";
import { GraduationCap, CheckCircle2, AlertCircle, Loader2, BookOpen, Trophy, ArrowRight, RotateCcw, HelpCircle, FileText, Award, FileCheck } from "lucide-react";
import { 
  generateQuizAndRubric, 
  evaluateQuizSubmission, 
  generateTestAndRubric, 
  evaluateTestSubmission, 
  generateExamAndRubric, 
  evaluateExamSubmission, 
  GeneratedTest, 
  GeneratedQuiz,
  EvaluationResult 
} from "@/app/actions/ai-test-actions";
import { saveAssessmentSubmission } from "@/app/actions/assessment-history-actions";

interface LessonOption {
  id: number;
  title: string;
  slug: string;
  content: string;
  topicTitle: string;
  subjectName: string;
  levelName?: string | null;
  className?: string | null;
}

export default function TakeTestClient({ lessons, fixedMode }: { lessons: LessonOption[], fixedMode?: "quiz" | "test" | "exam" }) {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(lessons[0]?.id || 0);
  const [assessmentMode, setAssessmentMode] = useState<"quiz" | "test" | "exam">(fixedMode || "quiz");
  const [generating, setGenerating] = useState<boolean>(false);
  
  const [quizRubric, setQuizRubric] = useState<GeneratedQuiz | null>(null);
  const [testRubric, setTestRubric] = useState<GeneratedTest | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedLesson = lessons.find(l => l.id === Number(selectedLessonId));

  const handleGenerateAssessment = async () => {
    if (!selectedLesson || !selectedLesson.content) {
      setErrorMsg("Please select a lesson with content to generate an assessment.");
      return;
    }

    setGenerating(true);
    setErrorMsg(null);
    setEvaluationResult(null);
    setQuizRubric(null);
    setTestRubric(null);
    setUserAnswers({});

    try {
      const levelInfo = `${selectedLesson.levelName || selectedLesson.subjectName} (${selectedLesson.className || selectedLesson.topicTitle})`;
      if (assessmentMode === "quiz") {
        const rubric = await generateQuizAndRubric(selectedLesson.content, levelInfo);
        setQuizRubric(rubric);
      } else if (assessmentMode === "exam") {
        const rubric = await generateExamAndRubric(selectedLesson.content, levelInfo);
        setTestRubric(rubric);
      } else {
        const rubric = await generateTestAndRubric(selectedLesson.content, levelInfo);
        setTestRubric(rubric);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate assessment. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAssessment = async () => {
    setEvaluating(true);
    setErrorMsg(null);

    try {
      if (assessmentMode === "quiz" && quizRubric) {
        const submissionPayload = quizRubric.objective.map(q => ({
          question_id: q.id,
          answer: userAnswers[q.id] || ""
        }));
        // Instant 0.001s JS Evaluator with 0 API token cost!
        const result = await evaluateQuizSubmission(quizRubric, submissionPayload);
        setEvaluationResult(result);

        // Auto-save to assessment history
        await saveAssessmentSubmission({
          title: `${selectedLesson?.title || "Lesson"} Quiz`,
          assessmentType: "quiz",
          score: result.total_score,
          totalScore: 100,
          percentage: Math.round(result.total_score),
          breakdown: result.grading_breakdown,
        });
      } else if (testRubric) {
        const submissionPayload = [
          ...testRubric.objective.map(q => ({ question_id: q.id, answer: userAnswers[q.id] || "" })),
          ...testRubric.subjective.map(q => ({ question_id: q.id, answer: userAnswers[q.id] || "" })),
          ...testRubric.theory.map(q => ({ question_id: q.id, answer: userAnswers[q.id] || "" })),
        ];

        let result: EvaluationResult;
        if (assessmentMode === "exam") {
          result = await evaluateExamSubmission(testRubric, submissionPayload);
        } else {
          result = await evaluateTestSubmission(testRubric, submissionPayload);
        }
        setEvaluationResult(result);

        // Auto-save to assessment history
        await saveAssessmentSubmission({
          title: `${selectedLesson?.title || "Lesson"} ${assessmentMode === "exam" ? "50-Q Exam" : "Test"}`,
          assessmentType: assessmentMode === "exam" ? "exam" : "test",
          score: result.total_score,
          totalScore: 100,
          percentage: Math.round(result.total_score),
          breakdown: result.grading_breakdown,
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to evaluate assessment. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-extrabold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Self-Study Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Practice {assessmentMode === 'quiz' ? 'Quizzes' : assessmentMode === 'test' ? 'Tests' : 'Exams'}</h1>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Generate unlimited {assessmentMode === 'quiz' ? '20-question MCQ Quizzes' : assessmentMode === 'test' ? '20-question Practice Tests' : '50-question Full Exams'}.
          </p>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ASSESSMENT SELECTION & TYPE TOGGLE */}
      <div className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-sm">
        
        {/* MODE SELECTOR */}
        {!fixedMode && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border w-fit">
          <button
            type="button"
            onClick={() => { setAssessmentMode("quiz"); setQuizRubric(null); setTestRubric(null); setEvaluationResult(null); }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              assessmentMode === "quiz" 
                ? "bg-foreground text-background shadow-md" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> 20-Q MCQ Quiz (Instant)
          </button>
          <button
            type="button"
            onClick={() => { setAssessmentMode("test"); setQuizRubric(null); setTestRubric(null); setEvaluationResult(null); }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              assessmentMode === "test" 
                ? "bg-foreground text-background shadow-md" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" /> 20-Q Practice Test
          </button>
          <button
            type="button"
            onClick={() => { setAssessmentMode("exam"); setQuizRubric(null); setTestRubric(null); setEvaluationResult(null); }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              assessmentMode === "exam" 
                ? "bg-foreground text-background shadow-md" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" /> 50-Q Full Exam
          </button>
        </div>
        )}

        {/* LESSON DROPDOWN & GENERATE BUTTON */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block">
            Select Lesson Material
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(Number(e.target.value))}
              className="flex-1 min-w-0 max-w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none cursor-pointer focus:border-foreground/30 transition-colors"
            >
              {lessons.map(l => (
                <option key={l.id} value={l.id}>
                  {l.subjectName} • {l.topicTitle} • {l.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerateAssessment}
              disabled={generating || !selectedLesson}
              className="bg-foreground text-background font-extrabold px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 whitespace-nowrap text-sm"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating {assessmentMode.toUpperCase()}...</>
              ) : (
                <><GraduationCap className="w-4 h-4 text-amber-400" /> Generate {assessmentMode === "quiz" ? "20-Q MCQ Quiz" : assessmentMode === "exam" ? "50-Q Exam" : "20-Q Practice Test"}</>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* GENERATED QUIZ (MCQ) UI */}
      {quizRubric && !evaluationResult && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 font-extrabold flex items-center justify-center text-sm">1</span>
              <div>
                <h2 className="text-lg font-extrabold">Objective MCQ Quiz (20 Questions • 100%)</h2>
                <p className="text-xs font-semibold text-muted-foreground">Select the single best answer for each question. Graded instantly!</p>
              </div>
            </div>

            <div className="space-y-6">
              {quizRubric.objective.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="font-bold text-sm text-foreground">
                    <span className="text-muted-foreground mr-2">{idx + 1}.</span> {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(Object.keys(q.options) as ("A" | "B" | "C" | "D")[]).map((key) => {
                      const isSelected = userAnswers[q.id] === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleAnswerChange(q.id, key)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left font-medium text-xs transition-all ${
                            isSelected
                              ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                              : "bg-card border-border hover:border-foreground/30 text-foreground"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isSelected ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
                          }`}>{key}</span>
                          <span>{q.options[key]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmitAssessment}
                disabled={evaluating}
                className="bg-foreground text-background font-extrabold px-8 py-4 rounded-2xl hover:scale-[1.02] transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
              >
                Submit Quiz for Instant Grading <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATED TEST / EXAM UI */}
      {testRubric && !evaluationResult && (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* OBJECTIVE SECTION */}
          <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 font-extrabold flex items-center justify-center text-sm">1</span>
              <div>
                <h2 className="text-lg font-extrabold">Section A: Objective Questions ({testRubric.objective.length} {testRubric.objective.length <= 1 ? 'Question' : 'Questions'} • 30%)</h2>
                <p className="text-xs font-semibold text-muted-foreground">Select the single best answer for each question.</p>
              </div>
            </div>

            <div className="space-y-6">
              {testRubric.objective.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="font-bold text-sm text-foreground">
                    <span className="text-muted-foreground mr-2">{idx + 1}.</span> {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(Object.keys(q.options) as ("A" | "B" | "C" | "D")[]).map((key) => {
                      const isSelected = userAnswers[q.id] === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleAnswerChange(q.id, key)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left font-medium text-xs transition-all ${
                            isSelected
                              ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                              : "bg-card border-border hover:border-foreground/30 text-foreground"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isSelected ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
                          }`}>{key}</span>
                          <span>{q.options[key]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBJECTIVE SECTION */}
          <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 font-extrabold flex items-center justify-center text-sm">2</span>
              <div>
                <h2 className="text-lg font-extrabold">Section B: Subjective Fill-in-the-Gap ({testRubric.subjective.length} {testRubric.subjective.length <= 1 ? 'Question' : 'Questions'} • {assessmentMode === "exam" ? "20%" : "30%"})</h2>
                <p className="text-xs font-semibold text-muted-foreground">Type the exact or approximate missing key term, name, or phrase.</p>
              </div>
            </div>

            <div className="space-y-6">
              {testRubric.subjective.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="font-bold text-sm text-foreground">
                    <span className="text-muted-foreground mr-2">{idx + 1}.</span> {q.question}
                  </div>
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={userAnswers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-foreground/30 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* THEORY SECTION */}
          <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 font-extrabold flex items-center justify-center text-sm">3</span>
              <div>
                <h2 className="text-lg font-extrabold">Section C: Theory & Explanation ({testRubric.theory.length} {testRubric.theory.length <= 1 ? 'Question' : 'Questions'} • {assessmentMode === "exam" ? "50%" : "40%"})</h2>
                <p className="text-xs font-semibold text-muted-foreground">Explain the concepts in your own words based on the lesson notes.</p>
              </div>
            </div>

            <div className="space-y-6">
              {testRubric.theory.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="font-bold text-sm text-foreground">
                    <span className="text-muted-foreground mr-2">{idx + 1}.</span> {q.question}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Write your explanation here..."
                    value={userAnswers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full bg-card border border-border rounded-xl p-4 text-sm font-medium outline-none focus:border-foreground/30 transition-colors resize-y"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmitAssessment}
              disabled={evaluating}
              className="bg-foreground text-background font-extrabold px-8 py-4 rounded-2xl hover:scale-[1.02] transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
            >
              {evaluating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Evaluating with AI Examiner...</>
              ) : (
                <>Submit {assessmentMode === "exam" ? "50-Question Exam" : "Test"} for Evaluation <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>

        </div>
      )}

      {/* EVALUATION RESULTS UI */}
      {evaluationResult && (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* SCORE HEADER */}
          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm text-center space-y-4 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-extrabold uppercase tracking-wider">
              <Trophy className="w-4 h-4" /> Assessment Evaluation Complete
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <span className="text-6xl font-black tracking-tight">{evaluationResult.total_score}%</span>
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mt-2">Overall {assessmentMode.toUpperCase()} Score</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                <div className="text-xs font-bold text-muted-foreground uppercase">Objective</div>
                <div className="text-xl font-extrabold mt-1 text-blue-500">{evaluationResult.objective_score} / {assessmentMode === "quiz" ? "100" : "30"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                <div className="text-xs font-bold text-muted-foreground uppercase">Subjective</div>
                <div className="text-xl font-extrabold mt-1 text-purple-500">{evaluationResult.subjective_score} / {assessmentMode === "exam" ? "20" : assessmentMode === "quiz" ? "0" : "30"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                <div className="text-xs font-bold text-muted-foreground uppercase">Theory</div>
                <div className="text-xl font-extrabold mt-1 text-emerald-500">{evaluationResult.theory_score} / {assessmentMode === "exam" ? "50" : assessmentMode === "quiz" ? "0" : "40"}</div>
              </div>
            </div>

            <button
              onClick={() => setEvaluationResult(null)}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake {assessmentMode.toUpperCase()}
            </button>
          </div>

          {/* DETAILED QUESTION BREAKDOWN */}
          <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm overflow-hidden">
            <h2 className="text-xl font-extrabold tracking-tight border-b border-border pb-4">Detailed Question Review & Explanations</h2>

            <div className="space-y-6 overflow-x-auto">
              {evaluationResult.grading_breakdown.map((item, idx) => {
                const isFull = item.points_awarded === item.max_points;
                const isPartial = item.points_awarded > 0 && item.points_awarded < item.max_points;

                return (
                  <div key={item.question_id || idx} className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="font-bold text-sm text-foreground">
                        <span className="text-muted-foreground mr-2">Q{idx + 1}.</span> {
                          quizRubric?.objective.find(q => q.id === item.question_id)?.question ||
                          testRubric?.objective.find(q => q.id === item.question_id)?.question ||
                          testRubric?.subjective.find(q => q.id === item.question_id)?.question ||
                          testRubric?.theory.find(q => q.id === item.question_id)?.question ||
                          item.question_id
                        }
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap ${
                        isFull 
                          ? "bg-green-500/10 text-green-500" 
                          : isPartial 
                          ? "bg-amber-500/10 text-amber-500" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {item.points_awarded} / {item.max_points} Points
                      </span>
                    </div>

                    {/* STUDENT ANSWER */}
                    <div className="text-xs font-semibold text-muted-foreground bg-card border border-border p-3 rounded-xl">
                      <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 text-foreground/70">Your Answer:</span>
                      {item.student_answer || <span className="italic opacity-60">No answer provided</span>}
                    </div>

                    {/* FEEDBACK & EXPLANATION */}
                    <div className="text-xs font-medium text-foreground bg-blue-500/5 border border-blue-500/20 p-3 rounded-xl">
                      <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 text-blue-500">Explanation & Feedback:</span>
                      {item.feedback}
                    </div>

                    {/* IDEAL / CORRECT ANSWER */}
                    {item.correct_answer && (
                      <div className="text-xs font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                        <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 text-emerald-600">Correct Answer:</span>
                        {item.correct_answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
