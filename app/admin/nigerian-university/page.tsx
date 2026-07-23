import { Search, GraduationCap } from "lucide-react";
import { getAdminUniversityTree } from "@/lib/admin-curriculum";
import UniversityTree from "./UniversityTree";
import { AddFacultyButton } from "./ClientActions";

export default async function NigerianUniversityManager() {
  const universityData = await getAdminUniversityTree();

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Nigerian University
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage Faculties, Departments, Levels, and Courses.
          </p>
        </div>
        <AddFacultyButton />
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-3">
         <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary" />
         </div>
         <div>
            <h2 className="font-bold">Hierarchy Overview</h2>
            <p className="text-xs text-muted-foreground">Faculty {"->"} Department {"->"} Level {"->"} Semester {"->"} Course</p>
         </div>
      </div>

      {/* FOLDER TREE */}
      <UniversityTree faculties={universityData} />

    </div>
  );
}
