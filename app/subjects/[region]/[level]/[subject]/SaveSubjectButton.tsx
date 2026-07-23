"use client";

import { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";

export function SaveSubjectButton({ subjectId, initialSaved }: { subjectId: string, initialSaved: boolean }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);
      // Let's import the action from the correct path.
      // The action is in app/subjects/actions.ts
      const { toggleUserSubject } = await import("@/app/subjects/actions");
      const res = await toggleUserSubject(subjectId);
      setIsSaved(res.isSaved);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`px-8 py-4 rounded-full text-[15px] font-bold transition-all flex items-center gap-3 border-2 ${
        isSaved 
          ? "bg-transparent border-foreground/30 text-foreground hover:border-foreground/60" 
          : "bg-transparent border-border text-foreground hover:border-foreground/30"
      }`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isSaved ? (
        <>Added to My Subjects <Check className="w-5 h-5" /></>
      ) : (
        <>Add to My Subjects <Plus className="w-5 h-5" /></>
      )}
    </button>
  );
}
