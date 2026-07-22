"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Trash, Edit3 } from "lucide-react";
import { createQuiz, deleteQuiz } from "../actions";
import Link from "next/link";
import { toast } from "sonner";

export function NewQuizButton({ subjects = [] }: { subjects?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState('quiz');
  const [subjectId, setSubjectId] = useState('');
  const [termId, setTermId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [subtopicId, setSubtopicId] = useState('');

  const selectedSubject = subjects.find((s: any) => s.id.toString() === subjectId);
  const selectedTerm = selectedSubject?.terms?.find((t: any) => t.id.toString() === termId);
  const selectedTopic = selectedTerm?.topics?.find((t: any) => t.id.toString() === topicId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (type === 'test' && !termId) { toast.error("Please select a module"); return; }
    if (type === 'quiz' && !topicId) { toast.error("Please select a topic"); return; }
    if (type === 'knowledge_check' && !subtopicId) { toast.error("Please select a lesson"); return; }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await createQuiz({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assessmentType: type,
      termId: type === 'test' ? parseInt(termId) : undefined,
      topicId: type === 'quiz' ? parseInt(topicId) : undefined,
      subtopicId: type === 'knowledge_check' ? parseInt(subtopicId) : undefined,
    });
    
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
        <Plus className="w-4 h-4" /> New Assessment
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card text-foreground rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Assessment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Assessment Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                  <option value="test">Module Test (End of Term)</option>
                  <option value="quiz">Topic Quiz (End of Topic)</option>
                  <option value="knowledge_check">Knowledge Check (End of Lesson)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Subject</label>
                  <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTermId(''); setTopicId(''); setSubtopicId(''); }} className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                    <option value="">Select Subject...</option>
                    {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                
                {subjectId && (
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-1">Module</label>
                    <select value={termId} onChange={(e) => { setTermId(e.target.value); setTopicId(''); setSubtopicId(''); }} className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                      <option value="">Select Module...</option>
                      {selectedSubject?.terms?.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {termId && (type === 'quiz' || type === 'knowledge_check') && (
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Topic</label>
                  <select value={topicId} onChange={(e) => { setTopicId(e.target.value); setSubtopicId(''); }} className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                    <option value="">Select Topic...</option>
                    {selectedTerm?.topics?.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
              )}

              {topicId && type === 'knowledge_check' && (
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Lesson (Subtopic)</label>
                  <select value={subtopicId} onChange={(e) => setSubtopicId(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                    <option value="">Select Lesson...</option>
                    {selectedTopic?.subtopics?.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
              )}

              <hr className="border-border my-4" />

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Title</label>
                <input required name="title" className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" placeholder="e.g. Midterm Assessment" />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Description</label>
                <textarea name="description" className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground resize-none h-20" placeholder="Optional description..." />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg font-bold text-muted-foreground hover:bg-muted">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg font-bold bg-foreground text-background hover:opacity-90 disabled:opacity-50">
                  {loading ? "Saving..." : "Create Assessment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

import { ConfirmModal } from "@/app/components/ConfirmModal";

export function QuizMenu({ quizId }: { quizId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function executeDelete() {
    setLoading(true);
    try {
      await deleteQuiz(quizId);
      toast.success("Assessment deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete assessment");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
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
              onClick={() => setShowConfirmModal(true)}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash className="w-3 h-3" /> Delete
            </button>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete Assessment?"
        description="Are you sure you want to delete this assessment and all its questions? This action cannot be undone."
        confirmText="Delete Assessment"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
        onConfirm={executeDelete}
        onClose={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
