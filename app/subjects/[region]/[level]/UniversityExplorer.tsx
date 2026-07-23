"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Building2, Layers, BookMarked, ChevronDown, ChevronRight } from "lucide-react";

type Subject = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  levelName: string | null; // e.g. "100 Level"
  className: string | null; // e.g. "First Semester"
};

type Category = {
  id: number;
  name: string;
  slug: string;
  subjects: Subject[];
};

type Faculty = {
  id: number;
  name: string;
  slug: string;
  categories: Category[];
};

interface UniversityExplorerProps {
  region: string;
  level: string; // This is "nigeria-university"
  tree: Faculty[];
  isLoggedIn?: boolean;
}

export default function UniversityExplorer({ region, level, tree, isLoggedIn = false }: UniversityExplorerProps) {
  const [activeFacultyId, setActiveFacultyId] = useState<number | null>(null);
  const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(null);
  const [activeLevelTab, setActiveLevelTab] = useState<string | null>(null);
  const [activeSemesterDropdown, setActiveSemesterDropdown] = useState<string | null>(null);

  const activeFaculty = useMemo(() => tree.find((f) => f.id === activeFacultyId), [tree, activeFacultyId]);
  const activeDepartment = useMemo(() => activeFaculty?.categories.find((c) => c.id === activeDepartmentId), [activeFaculty, activeDepartmentId]);

  // Extract unique levels (100 Level, etc) and semesters from courses in the selected department
  const { availableLevels, availableSemesters, filteredCourses } = useMemo(() => {
    if (!activeDepartment) return { availableLevels: [], availableSemesters: [], filteredCourses: [] };

    const levelSet = new Set<string>();
    const semesterSet = new Set<string>();

    activeDepartment.subjects.forEach(subject => {
      if (subject.levelName) levelSet.add(subject.levelName);
      if (subject.className) semesterSet.add(subject.className);
    });

    const levels = Array.from(levelSet).sort();
    const semesters = Array.from(semesterSet).sort();
    
    // Auto-select first tab/dropdown if not set or invalid
    let currentLevel = activeLevelTab;
    if (!currentLevel || !levels.includes(currentLevel)) {
      currentLevel = levels[0] || null;
    }
    
    let currentSemester = activeSemesterDropdown;
    if (!currentSemester || !semesters.includes(currentSemester)) {
      currentSemester = semesters[0] || null;
    }

    const filtered = activeDepartment.subjects.filter(
      s => s.levelName === currentLevel && s.className === currentSemester
    );

    return { 
      availableLevels: levels, 
      availableSemesters: semesters, 
      filteredCourses: filtered,
      currentLevel,
      currentSemester
    };
  }, [activeDepartment, activeLevelTab, activeSemesterDropdown]);

  // Whenever department changes, reset tabs (the memo auto-selects the first available)
  const handleDepartmentClick = (deptId: number) => {
    setActiveDepartmentId(deptId);
    setActiveLevelTab(null);
    setActiveSemesterDropdown(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar */}
      {!isLoggedIn ? (
        <nav className="sticky top-0 flex items-center justify-between px-8 py-6 w-full z-40 bg-background border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Avenpath Logo" className="h-16 w-auto" />
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Nigerian University</span>
          </div>
        </nav>
      ) : (
        <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground px-8 py-6 w-full">
          <Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Nigerian University</span>
        </div>
      )}

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs / Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-500" />
            Nigerian University
          </h2>
        
        {activeFaculty && (
          <div className="flex flex-wrap items-center gap-2 mt-4 text-sm font-semibold text-muted-foreground">
            <button 
              onClick={() => { setActiveFacultyId(null); setActiveDepartmentId(null); }}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> All Faculties
            </button>
            <span>/</span>
            <button 
              onClick={() => setActiveDepartmentId(null)}
              className={`transition-colors ${!activeDepartmentId ? "text-foreground" : "hover:text-foreground"}`}
            >
              {activeFaculty.name}
            </button>
            {activeDepartment && (
              <>
                <span>/</span>
                <span className="text-foreground">{activeDepartment.name}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* View 1: Faculties Grid */}
      {!activeFacultyId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tree.length === 0 && (
            <p className="text-muted-foreground col-span-full">No faculties available yet.</p>
          )}
          {tree.map(faculty => (
            <div 
              key={faculty.id}
              onClick={() => setActiveFacultyId(faculty.id)}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <Building2 className="w-8 h-8 mb-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              <h3 className="font-bold text-lg mb-2">{faculty.name}</h3>
              <p className="text-xs font-semibold text-muted-foreground bg-muted inline-block px-2 py-1 rounded">
                {faculty.categories.length} Departments
              </p>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Departments Grid */}
      {activeFacultyId && !activeDepartmentId && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold mb-6 text-muted-foreground">Select a Department</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeFaculty?.categories.length === 0 && (
              <p className="text-muted-foreground col-span-full">No departments added yet.</p>
            )}
            {activeFaculty?.categories.map(dept => (
              <div 
                key={dept.id}
                onClick={() => handleDepartmentClick(dept.id)}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  <Layers className="w-8 h-8 mb-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                  <h3 className="font-bold text-lg mb-2">{dept.name}</h3>
                </div>
                <p className="text-xs font-semibold text-muted-foreground mt-4">
                  {dept.subjects.length} Courses available
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Courses with Level Tabs & Semester Dropdown */}
      {activeDepartment && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Level Tabs */}
              <div className="flex-grow">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3">Select Level</h4>
                <div className="flex flex-wrap gap-2">
                  {availableLevels.length === 0 && <span className="text-sm text-muted-foreground">No levels defined.</span>}
                  {availableLevels.map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setActiveLevelTab(lvl)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                        (activeLevelTab || availableLevels[0]) === lvl 
                          ? "bg-foreground text-background" 
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester Dropdown */}
              <div className="min-w-[200px]">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3">Semester</h4>
                <div className="relative">
                  <select
                    value={activeSemesterDropdown || availableSemesters[0] || ""}
                    onChange={(e) => setActiveSemesterDropdown(e.target.value)}
                    className="w-full appearance-none bg-muted border border-border text-foreground font-bold text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer pr-10"
                    disabled={availableSemesters.length === 0}
                  >
                    {availableSemesters.length === 0 && <option value="">No semesters</option>}
                    {availableSemesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* Courses Grid */}
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-emerald-500" />
            Available Courses
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 && (
              <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium">No courses found for the selected level and semester.</p>
              </div>
            )}
            {filteredCourses.map(course => (
              <Link key={course.id} href={`/subjects/${region}/${level}/${course.slug}`}>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white" style={{ backgroundColor: course.color || '#10b981' }}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-emerald-500 transition-colors">{course.name}</h4>
                  {course.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
                  )}
                  <div className="mt-auto pt-6 flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <span>{course.id}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      )}
      </main>
    </div>
  );
}
