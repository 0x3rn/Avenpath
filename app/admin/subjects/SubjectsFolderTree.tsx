"use client";

import { useState, useMemo } from "react";
import { Folder, FolderOpen, Search, Filter, BookOpen } from "lucide-react";
import { SubjectMenu } from "./SubjectClientActions";

interface SubjectsFolderTreeProps {
  levels: any[];
}

type TreeNode = {
  name: string;
  isSubject: boolean;
  subject?: any;
  children: Record<string, TreeNode>;
};

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

  const folderColors = [
    "text-blue-500",
    "text-emerald-500",
    "text-orange-500",
    "text-purple-500",
    "text-pink-500",
  ];

  const allSubjects = useMemo(() => {
    const subjects: any[] = [];
    levels.forEach((level: any) => {
      level.categories?.forEach((cat: any) => {
        cat.subjects?.forEach((subj: any) => {
          subjects.push({ ...subj, region: level.region });
        });
      });
    });
    return subjects;
  }, [levels]);

  const tree = useMemo(() => {
    const root: Record<string, TreeNode> = {};
    allSubjects.forEach(subject => {
      if (!subjectMatchesFilter(subject)) return;
      
      const region = subject.region || "international";
      const formattedRegion = region.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      let path: string[] = [];

      if (region === "nigerian-university") {
        const faculty = subject.category?.level?.name || "Unknown Faculty";
        const department = subject.category?.name || "Unknown Department";
        const level = subject.levelName || "General Level";
        const semester = subject.className || "General Semester";
        path = [formattedRegion, faculty, department, level, semester, subject.name];
      } else {
        const level = subject.levelName || "Other";
        const className = subject.className || "General";
        
        let subLevel = null;
        if (subject.id?.includes("junior-highschool") || subject.slug?.includes("junior-highschool")) {
          subLevel = "Junior High School";
        } else if (subject.id?.includes("senior-highschool") || subject.slug?.includes("senior-highschool")) {
          subLevel = "Senior High School";
        }
        
        path = [formattedRegion, level];
        if (subLevel) path.push(subLevel);
        path.push(className, subject.name);
      }
      
      path = path.filter(p => p !== "General" && p !== "General Semester" && p !== "General Level");

      let currentLevel = root;
      for (let i = 0; i < path.length; i++) {
        const part = path[i];
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            isSubject: i === path.length - 1,
            subject: i === path.length - 1 ? subject : undefined,
            children: {}
          };
        }
        currentLevel = currentLevel[part].children;
      }
    });
    return root;
  }, [allSubjects, searchQuery, statusFilter]);

  const FolderNode = ({ node, pathKey, depth }: { node: TreeNode, pathKey: string, depth: number }) => {
    const isOpen = openFolders.has(pathKey) || searchQuery.length > 0;
    const childrenKeys = Object.keys(node.children).sort();

    if (node.isSubject && node.subject) {
      const subject = node.subject;
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
    }

    const countSubjects = (n: TreeNode): number => {
      let count = 0;
      if (n.isSubject) count++;
      for (const child of Object.values(n.children)) {
        count += countSubjects(child);
      }
      return count;
    };

    const count = countSubjects(node);
    const color = folderColors[depth % folderColors.length];

    return (
      <div key={pathKey}>
        <div
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
          onClick={() => toggleFolder(pathKey)}
        >
          {isOpen
            ? <FolderOpen className={`w-5 h-5 ${color} shrink-0`} />
            : <Folder className={`w-5 h-5 ${color} shrink-0`} />
          }
          <span className="font-bold text-sm">{node.name}</span>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto shrink-0">
            {count}
          </span>
        </div>

        {isOpen && childrenKeys.length > 0 && (
          <div className="ml-5 mt-1 border-l border-border pl-4 space-y-1">
            {childrenKeys.map(key => (
              <FolderNode 
                key={key} 
                node={node.children[key]} 
                pathKey={`${pathKey}/${key}`} 
                depth={depth + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

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
          {Object.keys(tree).sort().map(key => (
            <FolderNode 
              key={key} 
              node={tree[key]} 
              pathKey={key} 
              depth={0} 
            />
          ))}
          {Object.keys(tree).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No subjects found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
