import { Plus, Search, Filter } from "lucide-react";
import { db } from "@/db";
import TopicsTree from "./TopicsTree";

export default async function TopicsManager() {
  const subjects = await db.query.subjects.findMany({
    orderBy: (subjects, { asc }) => [asc(subjects.name)],
    with: {
      terms: {
        orderBy: (terms, { asc }) => [asc(terms.id)],
        with: {
          topics: {
            orderBy: (topics, { asc }) => [asc(topics.order)],
            with: {
              subtopics: {
                orderBy: (subtopics, { asc }) => [asc(subtopics.order)]
              }
            }
          }
        }
      }
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Topics</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Organize every subject into topics and subtopics.</p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Topic
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search topics..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none">
            <option>All Subjects</option>
            {subjects.map(s => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TOPICS TREE */}
      <TopicsTree subjects={subjects} />

    </div>
  );
}
