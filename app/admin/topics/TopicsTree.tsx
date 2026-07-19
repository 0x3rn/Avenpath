"use client";

import { TopicMenu, SubtopicMenu, NewTopicDialog, NewSubtopicDialog } from "./TopicClientActions";
import { Plus, Search, Filter, Folder, FolderOpen, MoreVertical, FileText, MoveRight } from "lucide-react";
import { useState } from "react";

export default function TopicsTree({ subjects }: { subjects: any[] }) {
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [openTerms, setOpenTerms] = useState<Set<number>>(new Set());
  const [openTopics, setOpenTopics] = useState<Set<number>>(new Set());
  const [addingTopicToTerm, setAddingTopicToTerm] = useState<number | null>(null);
  const [addingSubtopicToTopic, setAddingSubtopicToTopic] = useState<number | null>(null);

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

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      {subjects.map((subject) => (
        <div key={subject.id} className="mb-2">
          {/* Subject Header (Simulated Folder) */}
          <div 
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => setOpenSubject(openSubject === subject.id ? null : subject.id)}
          >
            {openSubject === subject.id ? <FolderOpen className="w-5 h-5 text-blue-500" /> : <Folder className="w-5 h-5 text-blue-500" />}
            <span className="font-bold text-sm">{subject.name}</span>
            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded ml-auto">
              {(subject.terms || []).reduce((acc: number, t: any) => acc + (t.topics?.length || 0), 0)} Topics
            </span>
          </div>

          {/* Nested Terms and Topics */}
          {openSubject === subject.id && (
            <div className="ml-5 mt-1 border-l border-border pl-4 space-y-1">
              {(subject.terms || []).map((term: any) => (
                <div key={term.id} className="mb-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg group justify-between hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => toggleTerm(term.id)}>
                    <div className="flex items-center gap-2">
                      {openTerms.has(term.id) ? <FolderOpen className="w-4 h-4 text-orange-500" /> : <Folder className="w-4 h-4 text-orange-500" />}
                      <span className="font-medium text-sm text-muted-foreground">{term.name}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setAddingTopicToTerm(term.id); }}
                      className="p-1 hover:bg-card border border-transparent hover:border-border rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Add Topic"
                    >
                      <Plus className="w-3 h-3 text-muted-foreground" />
                    </button>
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
                              <button 
                                onClick={() => setAddingSubtopicToTopic(topic.id)}
                                className="p-1 hover:bg-card border border-transparent hover:border-border rounded"
                                title="Add Lesson"
                              >
                                <Plus className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <TopicMenu topicId={topic.id} />
                            </div>
                          </div>

                          {/* Subtopics */}
                          {openTopics.has(topic.id) && (
                            <div className="ml-5 border-l border-border pl-4 space-y-1">
                              {(topic.subtopics || []).map((sub: any) => (
                                <div key={sub.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">{sub.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1 hover:bg-card border border-transparent hover:border-border rounded"><MoveRight className="w-3 h-3 text-muted-foreground" /></button>
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
