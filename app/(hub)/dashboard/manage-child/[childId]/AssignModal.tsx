"use client";

import { useState, useEffect } from "react";
import { Plus, X, Search, BookOpen, Layers } from "lucide-react";
import { createAssignment } from "@/app/actions/parent";
import { getBasicSubjects } from "@/app/actions/subjects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AssignModal({ childId }: { childId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<{ levels: any[], categories: any[], subjects: any[] } | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedLevelName, setSelectedLevelName] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (isOpen && !data) {
      getBasicSubjects().then(setData).catch(() => toast.error("Failed to load subjects"));
    }
  }, [isOpen, data]);

  const handleAssign = async (subjectId: string, subjectName: string) => {
    setLoading(true);
    try {
      await createAssignment(childId, "subject", subjectId, subjectName);
      toast.success(`${subjectName} assigned successfully`);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to assign");
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = data?.categories.filter(c => c.levelId === selectedLevelId) || [];
  
  // All subjects in the category
  const categorySubjects = data?.subjects.filter(s => s.categoryId === selectedCategoryId) || [];
  
  // Unique Level Names (e.g., Junior Secondary, Senior Secondary)
  const uniqueLevelNames = Array.from(new Set(categorySubjects.map(s => s.levelName))).filter(Boolean);
  
  // Filter subjects by selected levelName
  const levelFilteredSubjects = selectedLevelName 
    ? categorySubjects.filter(s => s.levelName === selectedLevelName) 
    : categorySubjects;

  // Unique Class Names (e.g., JSS 1, SS 1)
  const uniqueClassNames = Array.from(new Set(levelFilteredSubjects.map(s => s.className))).filter(Boolean);

  // Final filtered subjects
  const availableSubjects = selectedClassName 
    ? levelFilteredSubjects.filter(s => s.className === selectedClassName)
    : levelFilteredSubjects;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors shadow-sm"
      >
        <Plus className="w-5 h-5" /> Assign Subjects
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" /> Assign Subjects
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {!data ? (
                <div className="text-center py-10 text-muted-foreground animate-pulse">Loading subjects...</div>
              ) : (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold block text-muted-foreground">1. Select Level</label>
                      <select 
                        value={selectedLevelId || ""}
                        onChange={(e) => {
                          setSelectedLevelId(Number(e.target.value));
                          setSelectedCategoryId(null);
                          setSelectedLevelName(null);
                          setSelectedClassName(null);
                        }}
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-foreground/30 transition-colors"
                      >
                        <option value="" disabled>Choose Level</option>
                        {data.levels.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block text-muted-foreground">2. Select Category</label>
                      <select 
                        value={selectedCategoryId || ""}
                        onChange={(e) => {
                          setSelectedCategoryId(Number(e.target.value));
                          setSelectedLevelName(null);
                          setSelectedClassName(null);
                        }}
                        disabled={!selectedLevelId}
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-foreground/30 transition-colors disabled:opacity-50"
                      >
                        <option value="" disabled>Choose Category</option>
                        {availableCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedCategoryId && uniqueLevelNames.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="space-y-2">
                        <label className="text-sm font-bold block text-muted-foreground">3. School Section</label>
                        <select 
                          value={selectedLevelName || ""}
                          onChange={(e) => {
                            setSelectedLevelName(e.target.value);
                            setSelectedClassName(null);
                          }}
                          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-foreground/30 transition-colors"
                        >
                          <option value="" disabled>Choose Section</option>
                          {uniqueLevelNames.map(ln => (
                            <option key={ln} value={ln}>{ln}</option>
                          ))}
                        </select>
                      </div>

                      {selectedLevelName && uniqueClassNames.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-bold block text-muted-foreground">4. Select Class</label>
                          <select 
                            value={selectedClassName || ""}
                            onChange={(e) => setSelectedClassName(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-foreground/30 transition-colors"
                          >
                            <option value="" disabled>Choose Class</option>
                            {uniqueClassNames.map(cn => (
                              <option key={cn} value={cn}>{cn}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedCategoryId && (!uniqueLevelNames.length || selectedClassName)) && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <h3 className="text-sm font-bold block text-muted-foreground mb-4">5. Assign Subjects</h3>
                      {availableSubjects.length === 0 ? (
                        <div className="text-sm text-muted-foreground bg-muted/20 border border-dashed border-border rounded-xl p-4 text-center">
                          No subjects found for this selection.
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {availableSubjects.map(s => (
                            <div key={s.id} className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4">
                              <div>
                                <div className="font-bold">{s.name}</div>
                                <div className="text-xs text-muted-foreground">{s.levelName} • {s.className}</div>
                              </div>
                              <button 
                                onClick={() => handleAssign(s.id, s.name)}
                                disabled={loading}
                                className="bg-foreground text-background text-sm font-bold px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50"
                              >
                                Assign
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
