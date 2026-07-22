import { Search, HelpCircle, BookOpen, Layers, Target } from "lucide-react";
import { db } from "@/db";
import { NewQuizButton, QuizMenu } from "./QuizClientActions";
import { getAdminSubjectsTree } from "@/lib/admin-curriculum";

export default async function QuizzesManager() {
  const subjects = await getAdminSubjectsTree();

  const quizzesData = await db.query.quizzes.findMany({
    with: {
      subtopic: true,
      topic: true,
      term: true
    }
  });
  
  const questionIds = await db.query.quizQuestions.findMany({
    columns: { quizId: true }
  });

  const getQuestionCount = (quizId: number) => {
    return questionIds.filter(q => q.quizId === quizId).length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Quizzes & Tests</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage tests for modules, quizzes for topics, and knowledge checks for lessons.</p>
        </div>
        <NewQuizButton subjects={subjects} />
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search assessments..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Subjects</option>
            {subjects.map(s => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-muted border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-10 text-center"><input type="checkbox" className="rounded" /></th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Assessment</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Type / Location</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Questions</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {quizzesData.map((quiz) => {
                const qCount = getQuestionCount(quiz.id);
                const isPublished = qCount > 0;
                
                let locationText = "Unattached";
                if (quiz.term) locationText = `Module: ${quiz.term.name}`;
                if (quiz.topic) locationText = `Topic: ${quiz.topic.title}`;
                if (quiz.subtopic) locationText = `Lesson: ${quiz.subtopic.title}`;

                return (
                  <tr key={quiz.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 text-center"><input type="checkbox" className="rounded opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                    <td className="p-4">
                      <div className="font-bold text-sm flex items-center gap-2">
                        {quiz.assessmentType === 'test' ? <Target className="w-4 h-4 text-orange-500" /> : <HelpCircle className="w-4 h-4 text-blue-500" />}
                        {quiz.title}
                      </div>
                      {quiz.description && <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{quiz.description}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {quiz.assessmentType === 'test' ? 'Test' : quiz.assessmentType === 'knowledge_check' ? 'Knowledge Check' : 'Quiz'}
                        </span>
                        <span className="text-xs text-muted-foreground">{locationText}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-muted-foreground text-right">{qCount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${isPublished ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'}`}>
                        {isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <QuizMenu quizId={quiz.id} />
                    </td>
                  </tr>
                );
              })}
              {quizzesData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                    No assessments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
