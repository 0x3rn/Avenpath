import { Search, Plus, Filter, MoreHorizontal, Download, Edit3, History } from "lucide-react";
import { db } from "@/db";
import Link from "next/link";
import { LessonMenu } from "./LessonClientActions";

export default async function LessonsManager() {
  const lessons = await db.query.subtopics.findMany({
    limit: 200, // For now, just load the first 200
    with: {
      topic: {
        with: {
          term: {
            with: {
              subject: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Lessons</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage all educational content and track versions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
          <button className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Lesson
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search lessons..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Subjects</option>
          </select>
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
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
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Topic</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {lessons.map((lesson) => {
                const subject = lesson.topic?.term?.subject;
                const hasContent = !!lesson.content && lesson.content.length > 50;
                
                return (
                  <tr key={lesson.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 text-center"><input type="checkbox" className="rounded opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                    <td className="p-4">
                      <div className="font-bold text-sm group-hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-2">
                        {lesson.title}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-muted-foreground">{subject?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm font-medium text-muted-foreground truncate max-w-[200px]" title={lesson.topic?.title}>{lesson.topic?.title}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${hasContent ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'}`}>
                        {hasContent ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/lessons/${lesson.id}/edit`} className="p-1.5 text-muted-foreground hover:bg-card hover:text-foreground rounded-md border border-transparent hover:border-border transition-all" title="Edit Lesson">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <LessonMenu lessonId={lesson.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                    No lessons found. Run the seed script to populate.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
          <span className="text-xs font-medium text-muted-foreground">Showing {lessons.length} lessons</span>
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
