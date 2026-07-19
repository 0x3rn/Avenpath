"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Trash } from "lucide-react";
import { createSubject, deleteSubject } from "../actions";

export function NewSubjectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await createSubject({
      id: slug,
      name,
      categoryId: 1, // Defaulting to 1 for MVP
      levelName: "Highschool",
      className: "Class 1",
      description: formData.get("description") as string || "",
      icon: "BookOpen",
      color: "#3b82f6"
    });
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
        <Plus className="w-4 h-4" /> New Subject
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card text-foreground rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Create New Subject</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Subject Name</label>
                <input required name="name" className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" placeholder="e.g. Advanced Physics" />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Description</label>
                <textarea name="description" className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground resize-none h-24" placeholder="Brief description..." />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg font-bold text-muted-foreground hover:bg-muted">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg font-bold bg-foreground text-background hover:opacity-90 disabled:opacity-50">
                  {loading ? "Saving..." : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function SubjectMenu({ subjectId }: { subjectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this subject? All its topics and lessons will be lost.")) {
      setLoading(true);
      await deleteSubject(subjectId);
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-muted-foreground hover:bg-card hover:text-foreground rounded-md transition-all border border-transparent hover:border-border">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in zoom-in-95 duration-100">
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash className="w-4 h-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
