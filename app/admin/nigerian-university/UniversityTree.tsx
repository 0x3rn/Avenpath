"use client";

import { useState, useMemo } from "react";
import { Folder, FolderOpen, Search, BookOpen, Layers } from "lucide-react";
import { AddDepartmentButton, AddCourseButton } from "./ClientActions";
import Link from "next/link";

interface UniversityTreeProps {
  faculties: any[];
}

type TreeNode = {
  name: string;
  isCourse: boolean;
  course?: any;
  facultyId?: number;
  departmentId?: number;
  children: Record<string, TreeNode>;
};

export default function UniversityTree({ faculties }: UniversityTreeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    const next = new Set(openFolders);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setOpenFolders(next);
  };

  const getStats = (course: any) => {
    let topicsCount = 0;
    let lessonsCount = 0;
    for (const term of course.terms || []) {
      for (const topic of term.topics || []) {
        topicsCount++;
        lessonsCount += (topic.subtopics || []).length;
      }
    }
    return { topicsCount, lessonsCount };
  };

  const allCourses = useMemo(() => {
    const courses: any[] = [];
    faculties.forEach((faculty: any) => {
      faculty.categories?.forEach((dept: any) => {
        dept.subjects?.forEach((course: any) => {
          courses.push({ 
            ...course, 
            facultyName: faculty.name,
            facultyId: faculty.id,
            departmentName: dept.name,
            departmentId: dept.id
          });
        });
      });
    });
    return courses;
  }, [faculties]);

  const tree = useMemo(() => {
    const root: Record<string, TreeNode> = {};

    // First, populate all Faculties and Departments even if they have no courses
    faculties.forEach((faculty: any) => {
      if (!root[faculty.name]) {
        root[faculty.name] = { name: faculty.name, isCourse: false, facultyId: faculty.id, children: {} };
      }
      faculty.categories?.forEach((dept: any) => {
        if (!root[faculty.name].children[dept.name]) {
          root[faculty.name].children[dept.name] = { 
            name: dept.name, 
            isCourse: false, 
            facultyId: faculty.id,
            departmentId: dept.id,
            children: {} 
          };
        }
      });
    });

    // Then populate courses
    allCourses.forEach(course => {
      if (searchQuery && !course.name.toLowerCase().includes(searchQuery.toLowerCase())) return;
      
      const level = course.levelName || "General Level";
      const semester = course.className || "General Semester";
      
      const path = [course.facultyName, course.departmentName, level, semester, course.name];

      let currentLevel = root;
      for (let i = 0; i < path.length; i++) {
        const part = path[i];
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            isCourse: i === path.length - 1,
            course: i === path.length - 1 ? course : undefined,
            children: {}
          };
        }
        currentLevel = currentLevel[part].children;
      }
    });
    return root;
  }, [faculties, allCourses, searchQuery]);

  const folderColors = [
    "text-blue-500",    // Faculty
    "text-emerald-500", // Department
    "text-orange-500",  // Level
    "text-purple-500",  // Semester
  ];

  const FolderNode = ({ node, pathKey, depth }: { node: TreeNode, pathKey: string, depth: number }) => {
    const isOpen = openFolders.has(pathKey) || searchQuery.length > 0;
    const childrenKeys = Object.keys(node.children).sort();

    if (node.isCourse && node.course) {
      const course = node.course;
      const { topicsCount, lessonsCount } = getStats(course);
      const hasContent = topicsCount > 0;

      return (
        <div key={course.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 group transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-6 h-6 bg-muted/80 rounded flex items-center justify-center shrink-0">
              <BookOpen className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm block truncate">{course.name}</span>
              <div className="flex gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                <span>{topicsCount} Topics</span>
                <span>{lessonsCount} Lessons</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Link 
              href={`/admin/subjects`} 
              className="text-[10px] font-bold px-3 py-1.5 rounded-md bg-primary text-primary-foreground uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              Manage Course
            </Link>
          </div>
        </div>
      );
    }

    const countCourses = (n: TreeNode): number => {
      let count = 0;
      if (n.isCourse) count++;
      for (const child of Object.values(n.children)) {
        count += countCourses(child);
      }
      return count;
    };

    const count = countCourses(node);
    const color = folderColors[depth % folderColors.length] || "text-muted-foreground";

    return (
      <div key={pathKey}>
        <div className="flex items-center gap-2 p-1 group">
          <div
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex-1"
            onClick={() => toggleFolder(pathKey)}
          >
            {isOpen
              ? <FolderOpen className={`w-5 h-5 ${color} shrink-0`} />
              : <Folder className={`w-5 h-5 ${color} shrink-0`} />
            }
            <span className="font-bold text-sm">{node.name}</span>
            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto shrink-0">
              {count} {count === 1 ? 'Course' : 'Courses'}
            </span>
          </div>
          
          {/* Action Buttons for Faculties and Departments */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 shrink-0 pr-2">
            {depth === 0 && node.facultyId && (
              <AddDepartmentButton facultyId={node.facultyId} facultyName={node.name} />
            )}
            {depth === 1 && node.departmentId && (
              <AddCourseButton departmentId={node.departmentId} departmentName={node.name} />
            )}
          </div>
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
        
        {isOpen && childrenKeys.length === 0 && !node.isCourse && (
           <div className="ml-5 mt-1 border-l border-border pl-4 py-2">
             <div className="text-xs text-muted-foreground italic px-2">Empty</div>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 overflow-hidden shadow-sm space-y-4">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search university courses..."
          className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
        />
      </div>

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
          <div className="text-center py-12 flex flex-col items-center">
            <Layers className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No faculties created yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Add Faculty" to start building your university curriculum.</p>
          </div>
        )}
      </div>
    </div>
  );
}
