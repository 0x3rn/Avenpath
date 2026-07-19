import { db } from "@/db";
import { Download } from "lucide-react";
import { NewSubjectButton } from "./SubjectClientActions";
import SubjectsFolderTree from "./SubjectsFolderTree";

export default async function SubjectsManager() {
  // Query the actual hierarchy: levels → categories → subjects
  const levels = await db.query.levels.findMany({
    orderBy: (levels, { asc }) => [asc(levels.name)],
    with: {
      categories: {
        orderBy: (categories, { asc }) => [asc(categories.slug)],
        with: {
          subjects: {
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
          <h1 className="text-2xl font-extrabold tracking-tight">Subjects</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage all subjects across the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
          <NewSubjectButton />
        </div>
      </div>

      <SubjectsFolderTree levels={levels} />
      
    </div>
  );
}
