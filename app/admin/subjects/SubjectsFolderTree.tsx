"use client";

import { useState, useMemo } from "react";
import { Folder, FolderOpen, Search, Filter, BookOpen, ChevronRight } from "lucide-react";
import { SubjectMenu } from "./SubjectClientActions";

interface SubjectsFolderTreeProps {
  levels: any[];
}

export default function SubjectsFolderTree({ levels }: SubjectsFolderTreeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    const next = new Set(openFolders);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setOpenFolders(next);
  };

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

  const subjectMatchesFilter = (subject: any) => {
    if (searchQuery && !subject.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    const hasContent = (subject.terms || []).reduce((acc: number, t: any) => acc + (t.topics?.length || 0), 0) > 0;
    if (statusFilter === "Published" && !hasContent) return false;
    if (statusFilter === "Draft" && hasContent) return false;
    return true;
  };

  // For Nigerian highschool subjects, we need to group by sub-level and class
  // to match the file structure: nigeria/senior-highschool/class1/subject
  const buildNigerianSubFolders = (subjects: any[]) => {
    const groups: Record<string, Record<string, any[]>> = {};

    subjects.forEach(subject => {
      const levelName = (subject.levelName || "").toLowerCase();
      let subLevel: string;
      if (levelName.includes("junior")) {
        subLevel = "junior-highschool";
      } else if (levelName.includes("senior")) {
        subLevel = "senior-highschool";
      } else {
        subLevel = "other";
      }

      const cls = subject.className || "general";

      if (!groups[subLevel]) groups[subLevel] = {};
      if (!groups[subLevel][cls]) groups[subLevel][cls] = [];
      groups[subLevel][cls].push(subject);
    });

    return groups;
  };

  const isSearching = searchQuery.length > 0;

  // Count subjects recursively in a category (accounting for filters)
  const countFilteredSubjects = (subjects: any[]) => {
    return subjects.filter(subjectMatchesFilter).length;
  };

  const folderColors = [
    "text-blue-500",
    "text-emerald-500",
    "text-orange-500",
    "text-purple-500",
    "text-pink-500",
  ];

  const renderSubject = (subject: any) => {
    const { topicsCount, lessonsCount } = getStats(subject);
    const hasContent = topicsCount > 0;

    return (
      <div key={subject.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 group transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-6 h-6 bg-muted/80 rounded flex items-center justify-center shrink-0">
            <BookOpen className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm block truncate">{subject.name}</span>
            <div className="flex gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
              <span>{topicsCount} Topics</span>
              <span>{lessonsCount} Lessons</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${hasContent ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'}`}>
            {hasContent ? 'Published' : 'Draft'}
          </span>
          <SubjectMenu subjectId={subject.id} />
        </div>
      </div>
    );
  };

  const renderFolderRow = (name: string, path: string, count: number, depth: number) => {
    const isOpen = openFolders.has(path) || isSearching;
    const color = folderColors[depth % folderColors.length];

    return (
      <div
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
        onClick={() => toggleFolder(path)}
      >
        {isOpen
          ? <FolderOpen className={`w-5 h-5 ${color} shrink-0`} />
          : <Folder className={`w-5 h-5 ${color} shrink-0`} />
        }
        <span className="font-bold text-sm">{name}</span>
        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto shrink-0">
          {count}
        </span>
      </div>
    );
  };

  const renderNested = (children: React.ReactNode) => (
    <div className="ml-5 mt-1 border-l border-border pl-4 space-y-1">
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer transition-colors min-w-[120px]"
        >
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
      </div>

      {/* FOLDER TREE */}
      <div className="bg-card border border-border rounded-2xl p-4 overflow-hidden shadow-sm">
        <div className="space-y-2">
          {levels.map((level) => {
            // Count all filtered subjects across all categories in this level
            const totalInLevel = level.categories.reduce((acc: number, cat: any) =>
              acc + countFilteredSubjects(cat.subjects), 0
            );

            if (totalInLevel === 0) return null;

            const levelPath = level.slug;
            const isLevelOpen = openFolders.has(levelPath) || isSearching;

            return (
              <div key={level.id}>
                {renderFolderRow(level.slug, levelPath, totalInLevel, 0)}

                {isLevelOpen && renderNested(
                  <>
                    {level.categories
                      .sort((a: any, b: any) => a.slug.localeCompare(b.slug))
                      .map((category: any) => {
                        const filteredSubjects = category.subjects
                          .filter(subjectMatchesFilter)
                          .sort((a: any, b: any) => a.name.localeCompare(b.name));

                        if (filteredSubjects.length === 0) return null;

                        const catPath = `${levelPath}/${category.slug}`;
                        const isCatOpen = openFolders.has(catPath) || isSearching;

                        // For Nigerian highschool: needs deeper nesting
                        const isNigerian = category.slug === "nigeria";

                        if (isNigerian) {
                          const subFolders = buildNigerianSubFolders(filteredSubjects);
                          const sortedSubLevels = Object.keys(subFolders).sort();

                          return (
                            <div key={category.id}>
                              {renderFolderRow(category.slug, catPath, filteredSubjects.length, 1)}
                              {isCatOpen && renderNested(
                                <>
                                  {sortedSubLevels.map(subLevel => {
                                    const classGroups = subFolders[subLevel];
                                    const sortedClasses = Object.keys(classGroups).sort();
                                    const subLevelPath = `${catPath}/${subLevel}`;
                                    const isSubLevelOpen = openFolders.has(subLevelPath) || isSearching;
                                    const subLevelCount = sortedClasses.reduce((acc, cls) => acc + classGroups[cls].length, 0);

                                    return (
                                      <div key={subLevel}>
                                        {renderFolderRow(subLevel, subLevelPath, subLevelCount, 2)}
                                        {isSubLevelOpen && renderNested(
                                          <>
                                            {sortedClasses.map(cls => {
                                              const subjects = classGroups[cls].sort((a: any, b: any) => a.name.localeCompare(b.name));
                                              const clsSlug = cls.toLowerCase().replace(/\s+/g, "");
                                              const clsPath = `${subLevelPath}/${clsSlug}`;
                                              const isClsOpen = openFolders.has(clsPath) || isSearching;

                                              return (
                                                <div key={cls}>
                                                  {renderFolderRow(clsSlug, clsPath, subjects.length, 3)}
                                                  {isClsOpen && renderNested(
                                                    subjects.map(renderSubject)
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                            </div>
                          );
                        }

                        // For primaryschool categories (class1, class2...) or
                        // university categories (engineering, science...) or
                        // highschool/general — subjects sit directly inside
                        return (
                          <div key={category.id}>
                            {renderFolderRow(category.slug, catPath, filteredSubjects.length, 1)}
                            {isCatOpen && renderNested(
                              filteredSubjects.map(renderSubject)
                            )}
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {levels.every(l => l.categories.reduce((acc: number, c: any) => acc + countFilteredSubjects(c.subjects), 0) === 0) && (
          <div className="p-8 text-center text-muted-foreground font-medium">
            No subjects found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
