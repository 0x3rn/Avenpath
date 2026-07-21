import { Search } from "lucide-react";
import { db } from "@/db";
import TopicsTree from "../topics/TopicsTree";

export default async function LessonsManager() {
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Lessons</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage all educational content and track versions.</p>
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
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Subjects</option>
            {subjects.map(s => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
      </div>

      {/* LESSONS HIERARCHY */}
      <TopicsTree subjects={subjects} mode="lessons" />

    </div>
  );
}
