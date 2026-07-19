import { Search, HelpCircle } from "lucide-react";
import { db } from "@/db";
import { NewQuizButton, QuizMenu } from "./QuizClientActions";

export default async function QuizzesManager() {
  const quizzes = await db.query.quizzes.findMany({
    with: {
      // Need to find out how relations are defined for quizzes. 
      // subtopic doesn't seem to be explicitly exported as a relation in schema.ts.
      // Wait, let's fetch without relations first, or just fetch questions.
    }
  });

  // Actually, let's just fetch quizzes and join manually if needed, or query them plainly.
  const quizzesData = await db.query.quizzes.findMany();
  const allQuestions = await db.query.quizQuestions.findMany();

  const getQuestionCount = (quizId: number) => {
    return allQuestions.filter(q => q.quizId === quizId).length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Quizzes</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage assessments and question banks.</p>
        </div>
        <NewQuizButton />
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search quizzes..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Subjects</option>
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
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Quiz</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Questions</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Attempts</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {quizzesData.map((quiz) => {
                const qCount = getQuestionCount(quiz.id);
                const isPublished = qCount > 0;
                
                return (
                  <tr key={quiz.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 text-center"><input type="checkbox" className="rounded opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                    <td className="p-4 font-bold text-sm flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-muted-foreground" /> {quiz.title}
                    </td>
                    <td className="p-4 text-sm font-bold text-muted-foreground text-right">{qCount}</td>
                    <td className="p-4 text-sm font-medium text-muted-foreground text-right">-</td>
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
                    No quizzes found. Run the seed script to populate.
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
