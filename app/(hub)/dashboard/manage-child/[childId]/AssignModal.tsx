"use client";

import { useState } from "react";
import { Plus, X, Search, BookOpen } from "lucide-react";
import { createAssignment } from "@/app/actions/parent";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AssignModal({ childId }: { childId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("subject");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleAssign = async () => {
    if (!query) {
      toast.error("Please enter a subject or quiz name");
      return;
    }
    
    setLoading(true);
    try {
      await createAssignment(childId, type, query, query);
      toast.success("Assignment sent successfully");
      setIsOpen(false);
      setQuery("");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to assign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors shadow-sm"
      >
        <Plus className="w-5 h-5" /> Assign Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" /> New Assignment
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold block">Assignment Type</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setType("subject")}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors border ${type === 'subject' ? 'bg-foreground text-background border-foreground' : 'bg-muted border-border hover:bg-muted/80 text-muted-foreground'}`}
                  >
                    Subject
                  </button>
                  <button 
                    onClick={() => setType("quiz")}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors border ${type === 'quiz' ? 'bg-foreground text-background border-foreground' : 'bg-muted border-border hover:bg-muted/80 text-muted-foreground'}`}
                  >
                    Quiz
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold block">Search & Select</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`e.g. ${type === 'subject' ? 'Algebra I' : 'Biology Midterm'}...`}
                    className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3 text-[15px] font-medium focus:outline-none focus:border-foreground/30 transition-colors"
                  />
                </div>
                <p className="text-xs font-bold text-muted-foreground">
                  No strict due dates. They will be notified via email and in-app popup.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssign}
                disabled={loading}
                className="bg-foreground text-background font-bold px-6 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? "Assigning..." : "Assign to Child"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
