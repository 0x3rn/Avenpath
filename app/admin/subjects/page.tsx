import { db } from "@/db";
import { Search, Filter, Download } from "lucide-react";
import { NewSubjectButton, SubjectMenu } from "./SubjectClientActions";

export default async function SubjectsManager() {
  const subjects = await db.query.subjects.findMany({
    orderBy: (subjects, { asc }) => [asc(subjects.name)],
    with: {
      terms: {
        with: {
          topics: {
            with: {
              subtopics: true
            }
          }
        }
      }
    }
  });

  const getStats = (subject: any) => {
    let topicsCount = 0;
    let lessonsCount = 0;
    for (const term of subject.terms || []) {
      for (const topic of term.topics || []) {
        topicsCount++;
        lessonsCount += (topic.subtopics || []).length;
      }
    }
    return { topicsCount, lessonsCount };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Subjects</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage all subjects across the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
          <NewSubjectButton />
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search subjects..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm font-bold transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none transition-colors min-w-[120px]">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
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
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Topics</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Lessons</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Level</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Class</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {subjects.map((subject, i) => {
                const { topicsCount, lessonsCount } = getStats(subject);
                const hasContent = topicsCount > 0;
                
                return (
                  <tr key={subject.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 text-center"><input type="checkbox" className="rounded opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center text-lg">{subject.icon === 'BookOpen' ? '📚' : '📄'}</div>
                        <span className="font-bold text-sm max-w-[300px] truncate block" title={subject.name}>{subject.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-muted-foreground text-right">{topicsCount}</td>
                    <td className="p-4 text-sm font-medium text-muted-foreground text-right">{lessonsCount}</td>
                    <td className="p-4 text-sm font-medium text-muted-foreground text-right">{subject.levelName || 'N/A'}</td>
                    <td className="p-4 text-sm font-medium text-muted-foreground text-right">{subject.className || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${hasContent ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'}`}>
                        {hasContent ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <SubjectMenu subjectId={subject.id} />
                    </td>
                  </tr>
                );
              })}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground font-medium">
                    No subjects found. Run the seed script to populate data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
          <span className="text-xs font-medium text-muted-foreground">Showing 1 to {subjects.length} of {subjects.length} subjects</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted" disabled>Prev</button>
            <button className="px-3 py-1 text-xs font-bold bg-foreground text-background border border-foreground rounded">1</button>
            <button className="px-3 py-1 text-xs font-bold bg-card border border-border rounded hover:bg-muted" disabled>Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}
