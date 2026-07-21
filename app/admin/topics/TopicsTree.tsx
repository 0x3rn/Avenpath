"use client";

import { TopicMenu, SubtopicMenu, NewTopicDialog, NewSubtopicDialog } from "./TopicClientActions";
import { Plus, Search, Filter, Folder, FolderOpen, MoreVertical, FileText, MoveRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type TreeNode = {
  name: string;
  isSubject: boolean;
  subject?: any;
  children: Record<string, TreeNode>;
};

const buildTree = (subjects: any[]) => {
  const root: Record<string, TreeNode> = {};

  subjects.forEach(subject => {
    let path: string[] = [];
    
    if (subject.levelName === "University") {
      path = ["University", subject.name];
    } else if (subject.levelName === "Highschool") {
      if (subject.country === "Nigeria") {
        const isJunior = subject.id.includes("junior-highschool");
        const isSenior = subject.id.includes("senior-highschool");
        const section = isJunior ? "Junior Highschool" : (isSenior ? "Senior Highschool" : "General Highschool");
        path = ["Highschool", "Nigeria", section, subject.className, subject.name];
      } else {
        path = ["Highschool", "International", subject.className, subject.name];
      }
    } else if (subject.levelName === "Primaryschool" || subject.levelName === "Primary School") {
      path = ["Primary School", subject.className, subject.name];
    } else {
      path = [subject.levelName || "Other", subject.className, subject.name];
    }

    path = path.filter(p => p !== "General");

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
};

const FolderNode = ({ node, pathKey, level, openFolders, toggleFolder, renderSubject }: any) => {
  const isOpen = openFolders.has(pathKey);
  const childrenKeys = Object.keys(node.children).sort();
  
  if (node.isSubject) {
    return renderSubject(node.subject);
  }

  const iconColor = level === 0 ? "text-indigo-500" : level === 1 ? "text-blue-500" : level === 2 ? "text-cyan-500" : "text-teal-500";

  return (
    <div className={`mb-${level === 0 ? '4' : '2'}`}>
      <div 
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
        onClick={() => toggleFolder(pathKey)}
      >
        {isOpen ? <FolderOpen className={`w-5 h-5 ${iconColor}`} /> : <Folder className={`w-5 h-5 ${iconColor}`} />}
        <span className={`font-extrabold uppercase tracking-wider ${level === 0 ? 'text-base' : 'text-sm'}`}>{node.name}</span>
      </div>
      {isOpen && (
        <div className="ml-5 mt-2 border-l border-border pl-4 space-y-2">
          {childrenKeys.map(key => (
            <FolderNode 
              key={`${pathKey}-${key}`}
              node={node.children[key]}
              pathKey={`${pathKey}-${key}`}
              level={level + 1}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
              renderSubject={renderSubject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TopicsTree({ subjects, mode = 'default' }: { subjects: any[], mode?: 'default' | 'lessons' }) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [openTerms, setOpenTerms] = useState<Set<number>>(new Set());
  const [openTopics, setOpenTopics] = useState<Set<number>>(new Set());
  const [addingTopicToTerm, setAddingTopicToTerm] = useState<number | null>(null);
  const [addingSubtopicToTopic, setAddingSubtopicToTopic] = useState<number | null>(null);

  const rootTree = buildTree(subjects);
  const rootKeys = Object.keys(rootTree).sort();

  const toggleFolder = (pathKey: string) => {
    const next = new Set(openFolders);
    if (next.has(pathKey)) next.delete(pathKey);
    else next.add(pathKey);
    setOpenFolders(next);
  };

  const toggleTerm = (termId: number) => {
    const next = new Set(openTerms);
    if (next.has(termId)) next.delete(termId);
    else next.add(termId);
    setOpenTerms(next);
  };

  const toggleTopic = (topicId: number) => {
    const next = new Set(openTopics);
    if (next.has(topicId)) next.delete(topicId);
    else next.add(topicId);
    setOpenTopics(next);
  };

  const renderSubject = (subject: any) => (
    <div key={subject.id} className="mb-2">
      <div 
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
        onClick={() => setOpenSubject(openSubject === subject.id ? null : subject.id)}
      >
        {openSubject === subject.id ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-500" />}
        <span className="font-bold text-sm">{subject.name}</span>
        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto">
          {(subject.terms || []).reduce((acc: number, t: any) => acc + (t.topics?.length || 0), 0)} Topics
        </span>
      </div>

      {openSubject === subject.id && (
        <div className="ml-5 mt-1 border-l border-border pl-4 space-y-1">
          {(subject.terms || []).map((term: any) => (
            <div key={term.id} className="mb-2">
              <div className="flex items-center gap-2 p-2 rounded-lg group justify-between hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => toggleTerm(term.id)}>
                <div className="flex items-center gap-2">
                  {openTerms.has(term.id) ? <FolderOpen className="w-4 h-4 text-orange-500" /> : <Folder className="w-4 h-4 text-orange-500" />}
                  <span className="font-medium text-sm text-muted-foreground">{term.name}</span>
                </div>
                {mode !== 'lessons' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setAddingTopicToTerm(term.id); }}
                    className="p-1 hover:bg-card border border-transparent hover:border-border rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add Topic"
                  >
                    <Plus className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              
              {openTerms.has(term.id) && (
                <div className="ml-5 border-l border-border pl-4 space-y-1">
                  {(term.topics || []).map((topic: any) => (
                    <div key={topic.id} className="flex flex-col gap-1 mb-2">
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group" onClick={() => toggleTopic(topic.id)}>
                        <div className="flex items-center gap-2">
                          {openTopics.has(topic.id) ? <FolderOpen className="w-4 h-4 text-purple-500" /> : <Folder className="w-4 h-4 text-purple-500" />}
                          <span className="font-medium text-sm">{topic.title}</span>
                        </div>
                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase">Published</span>
                          {mode !== 'lessons' && (
                            <button 
                              onClick={() => setAddingSubtopicToTopic(topic.id)}
                              className="p-1 hover:bg-card border border-transparent hover:border-border rounded"
                              title="Add Lesson"
                            >
                              <Plus className="w-3 h-3 text-muted-foreground" />
                            </button>
                          )}
                          {mode !== 'lessons' && <TopicMenu topicId={topic.id} />}
                        </div>
                      </div>

                      {/* Subtopics */}
                      {openTopics.has(topic.id) && (
                        <div className="ml-5 border-l border-border pl-4 space-y-1">
                          {(topic.subtopics || []).map((sub: any) => (
                            <div key={sub.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 group">
                              <Link href={`/admin/lessons/${sub.id}/edit`} className="flex flex-1 items-center gap-2 cursor-pointer">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">{sub.title}</span>
                              </Link>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/lessons/${sub.id}/edit`} className="p-1 hover:bg-card border border-transparent hover:border-border rounded"><MoveRight className="w-3 h-3 text-muted-foreground" /></Link>
                                <SubtopicMenu subtopicId={sub.id} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {(!subject.terms || subject.terms.length === 0) && (
            <div className="p-2 text-sm text-muted-foreground">No terms found.</div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      {rootKeys.map((key) => (
        <FolderNode 
          key={key} 
          node={rootTree[key]} 
          pathKey={key}
          level={0}
          openFolders={openFolders}
          toggleFolder={toggleFolder}
          renderSubject={renderSubject}
        />
      ))}
      
      {subjects.length === 0 && (
        <div className="p-4 text-center text-sm font-medium text-muted-foreground">
          No subjects or topics available. Run the seed script to populate.
        </div>
      )}
      {addingTopicToTerm !== null && (
        <NewTopicDialog termId={addingTopicToTerm} onClose={() => setAddingTopicToTerm(null)} />
      )}
      {addingSubtopicToTopic !== null && (
        <NewSubtopicDialog topicId={addingSubtopicToTopic} onClose={() => setAddingSubtopicToTopic(null)} />
      )}
    </div>
  );
}
