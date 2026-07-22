import { db } from "@/db";
import { getAdminSubjectsTree } from "@/lib/admin-curriculum";
import AssessmentConfigurator from "../quizzes/AssessmentConfigurator";
import { Award, ShieldCheck, GraduationCap, Target, HelpCircle, Search } from "lucide-react";
import { QuizMenu } from "../quizzes/QuizClientActions";

export default async function ExamsManagerPage() {
  // 1. Fetch Real Database Subjects & Curriculum Tree from PostgreSQL
  const subjects = await getAdminSubjectsTree();

  // 2. Fetch Real Database Exams from PostgreSQL (Strictly assessmentType === 'exam')
  const allQuizzesData = await db.query.quizzes.findMany({
    with: {
      subtopic: true,
      topic: true,
      term: true
    }
  });

  const examsData = allQuizzesData.filter(q => q.assessmentType === 'exam');

  const questionIds = await db.query.quizQuestions.findMany({
    columns: { quizId: true }
  });

  const getQuestionCount = (quizId: number) => {
    return questionIds.filter(q => q.quizId === quizId).length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      {/* HEADER */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" /> Official Exam Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Exams & Milestone Assessment Engine</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Connected directly to PostgreSQL DB. Dynamically calculates and pre-generates 50-question exams, term tests, and topic quizzes.
          </p>
        </div>
      </div>

      {/* DYNAMIC EXAM PLACER & GENERATOR */}
      <div className="space-y-3">
        <h2 className="text-xl font-extrabold tracking-tight">1. Place & Pre-generate Official 50-Question Exams</h2>
        <p className="text-xs font-semibold text-muted-foreground">
          Select any course below to place official exams on specific terms/modules or pre-generate milestone/final exams.
        </p>
        <AssessmentConfigurator subjects={subjects} filterMode="exam_only" />
      </div>

      {/* PUBLISHED EXAMS TABLE FROM POSTGRESQL DB */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">2. Stored Database Assessments ({examsData.length})</h2>
            <p className="text-xs font-semibold text-muted-foreground">Real-time assessments stored in your database for 0ms student exam loading.</p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search stored database exams..."
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 z-10 bg-muted border-b border-border">
                <tr>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Assessment Title</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Type / Level</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Questions</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {examsData.map((quiz) => {
                  const qCount = getQuestionCount(quiz.id);
                  const isPublished = qCount > 0;
                  
                  let locationText = "Course Level";
                  if (quiz.term) locationText = `Module: ${quiz.term.name}`;
                  if (quiz.topic) locationText = `Topic: ${quiz.topic.title}`;
                  if (quiz.subtopic) locationText = `Lesson: ${quiz.subtopic.title}`;

                  return (
                    <tr key={quiz.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-sm flex items-center gap-2">
                          {quiz.assessmentType === 'exam' ? <Award className="w-4 h-4 text-amber-500" /> : quiz.assessmentType === 'test' ? <Target className="w-4 h-4 text-orange-500" /> : <HelpCircle className="w-4 h-4 text-blue-500" />}
                          {quiz.title}
                        </div>
                        {quiz.description && <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{quiz.description}</div>}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {quiz.assessmentType.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground">{locationText}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-muted-foreground text-right">{qCount}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${isPublished ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'}`}>
                          {isPublished ? 'Published in DB' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <QuizMenu quizId={quiz.id} />
                      </td>
                    </tr>
                  );
                })}

                {examsData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">
                      No stored database assessments yet. Select a subject above and click "Generate Official Assessment" to publish.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
