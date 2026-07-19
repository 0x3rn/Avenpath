"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Trash, Edit3 } from "lucide-react";
import { createQuiz, deleteQuiz } from "../actions";
import Link from "next/link";

export function NewQuizButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await createQuiz({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    });
    
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
        <Plus className="w-4 h-4" /> New Quiz
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card text-foreground rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Create New Quiz</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Quiz Title</label>
                <input required name="title" className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" placeholder="e.g. Midterm Assessment" />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Description</label>
                <textarea name="description" className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground resize-none h-20" placeholder="Optional description..." />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg font-bold text-muted-foreground hover:bg-muted">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg font-bold bg-foreground text-background hover:opacity-90 disabled:opacity-50">
                  {loading ? "Saving..." : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function QuizMenu({ quizId }: { quizId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this quiz and all its questions?")) {
      setLoading(true);
      await deleteQuiz(quizId);
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-muted-foreground hover:bg-card hover:text-foreground rounded-md border border-transparent hover:border-border transition-all">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in zoom-in-95 duration-100">
            <Link 
              href={`/admin/quizzes/${quizId}/edit`}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-foreground hover:bg-muted flex items-center gap-2"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </Link>
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash className="w-3 h-3" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
