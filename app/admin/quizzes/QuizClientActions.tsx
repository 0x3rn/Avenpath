"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Trash, Edit3, Eye, EyeOff } from "lucide-react";
import { createQuiz, deleteQuiz, toggleQuizPublishStatus } from "../actions";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NewQuizButton({ subjects = [] }: { subjects?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [type, setType] = useState('quiz');
  const [subjectId, setSubjectId] = useState('');
  const [termId, setTermId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [subtopicId, setSubtopicId] = useState('');

  const selectedSubject = subjects.find((s: any) => s.id.toString() === subjectId);
  const selectedTerm = selectedSubject?.terms?.find((t: any) => t.id.toString() === termId);
  const selectedTopic = selectedTerm?.topics?.find((t: any) => t.id.toString() === topicId);

  // Group subjects natively based on DB structure
  const groupedSubjects = subjects.reduce((acc: any, s: any) => {
    const categoryName = `${s.country || 'Global'} - ${s.levelName || 'General'} - ${s.className || 'General'}`;
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(s);
    return acc;
  }, {});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (type === 'test' && !termId) { toast.error("Please select a module"); return; }
    if (type === 'quiz' && !topicId) { toast.error("Please select a topic"); return; }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    let defaultTitle = type === 'test' ? 'End of Module Test' : 'Topic Quiz';
    if (type === 'exam') defaultTitle = 'Final Subject Exam';
    
    const titleVal = formData.get("title") as string;
    const finalTitle = titleVal && titleVal.trim() !== '' ? titleVal : defaultTitle;
    
    const res = await createQuiz({
      title: finalTitle,
      description: formData.get("description") as string,
      assessmentType: type,
      termId: type === 'test' ? parseInt(termId) : undefined,
      topicId: type === 'quiz' ? parseInt(topicId) : undefined,
    });
    
    setLoading(false);
    setIsOpen(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Assessment generated successfully!");
    }
    
    // Auto-redirect to edit page so user can instantly see or generate questions!
    if (res.quizId) {
      router.push(`/admin/quizzes/${res.quizId}/edit`);
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
        <Plus className="w-4 h-4" /> New Assessment
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card text-foreground rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border border-border">
            <h2 className="text-xl font-bold mb-4">Create New Assessment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Assessment Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                  <option value="test">Module Test (End of Module)</option>
                  <option value="quiz">Topic Quiz (End of Topic)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Subject</label>
                  <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTermId(''); setTopicId(''); setSubtopicId(''); }} className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                    <option value="">Select Subject...</option>
                    {Object.keys(groupedSubjects).map((level) => (
                      <optgroup key={level} label={level}>
                        {groupedSubjects[level].map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                
                {subjectId && (
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-1">Module</label>
                    <select value={termId} onChange={(e) => { setTermId(e.target.value); setTopicId(''); setSubtopicId(''); }} className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                      <option value="">Select Module...</option>
                      {selectedSubject?.terms?.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {termId && type === 'quiz' && (
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Topic</label>
                  <select value={topicId} onChange={(e) => { setTopicId(e.target.value); setSubtopicId(''); }} className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground">
                    <option value="">Select Topic...</option>
                    {selectedTerm?.topics?.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
              )}

              <hr className="border-border my-4" />

              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Title (Optional)</label>
                <input name="title" className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" placeholder={`e.g. ${type === 'test' ? 'End of Module Test' : 'Topic Quiz'}`} />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">Description (Optional)</label>
                <textarea name="description" className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground resize-none h-20" placeholder="Optional description..." />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg font-bold text-muted-foreground hover:bg-muted">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg font-bold bg-foreground text-background hover:opacity-90 disabled:opacity-50">
                  {loading ? "Generating Assessment (~30s)..." : "Generate Assessment"}
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

export function QuizMenu({ quizId, isPublished }: { quizId: number, isPublished: boolean }) {
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
    }
  }

  async function handleTogglePublish() {
    setLoading(true);
    try {
      await toggleQuizPublishStatus(quizId, !isPublished);
      toast.success(isPublished ? "Assessment reverted to draft" : "Assessment published successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update publish status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={handleTogglePublish}
        disabled={loading}
        className="p-2 text-muted-foreground hover:bg-card hover:text-foreground rounded-md border border-transparent hover:border-border transition-all disabled:opacity-50"
        title={isPublished ? "Unpublish to Draft" : "Publish Assessment"}
      >
        {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <Link 
        href={`/admin/quizzes/${quizId}/edit`}
        className="p-2 text-muted-foreground hover:bg-card hover:text-foreground rounded-md border border-transparent hover:border-border transition-all"
        title="Edit"
      >
        <Edit3 className="w-4 h-4" />
      </Link>
      <button 
        onClick={() => setShowConfirmModal(true)}
        disabled={loading}
        className="p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded-md border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50"
        title="Delete"
      >
        <Trash className="w-4 h-4" />
      </button>

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
