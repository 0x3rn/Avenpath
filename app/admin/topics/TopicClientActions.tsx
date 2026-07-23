"use client";

import { useState } from "react";
import { Plus, Trash, MoreVertical, Edit3, Eye, EyeOff } from "lucide-react";
import { createTopic, createSubtopic, deleteTopic, deleteSubtopic, toggleSubtopicPublishStatus } from "../actions";

import { ConfirmModal } from "@/app/components/ConfirmModal";
import { toast } from "sonner";

export function TopicMenu({ topicId }: { topicId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function executeDelete() {
    setLoading(true);
    try {
      await deleteTopic(topicId);
      toast.success("Topic deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete topic");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-card border border-transparent hover:border-border rounded">
        <MoreVertical className="w-3 h-3 text-muted-foreground" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in zoom-in-95 duration-100">
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
        title="Delete Topic?"
        description="Are you sure you want to delete this topic and all its associated lessons?"
        confirmText="Delete Topic"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
        onConfirm={executeDelete}
        onClose={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

export function SubtopicMenu({ subtopicId, isPublished }: { subtopicId: number, isPublished?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function executeTogglePublish() {
    setLoading(true);
    try {
      await toggleSubtopicPublishStatus(subtopicId, !isPublished);
      toast.success(!isPublished ? "Lesson published successfully" : "Lesson unpublished successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update publish status");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  async function executeDelete() {
    setLoading(true);
    try {
      await deleteSubtopic(subtopicId);
      toast.success("Lesson deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete lesson");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-card border border-transparent hover:border-border rounded">
        <MoreVertical className="w-3 h-3 text-muted-foreground" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in zoom-in-95 duration-100">
            <button 
              onClick={executeTogglePublish}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-foreground hover:bg-muted flex items-center gap-2 disabled:opacity-50"
            >
              {isPublished ? <><EyeOff className="w-3 h-3" /> Unpublish</> : <><Eye className="w-3 h-3" /> Publish</>}
            </button>
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
        title="Delete Lesson?"
        description="Are you sure you want to delete this lesson? This action cannot be undone."
        confirmText="Delete Lesson"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
        onConfirm={executeDelete}
        onClose={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

export function NewTopicDialog({ termId, onClose }: { termId: number, onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await createTopic({ termId, title, slug });
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card text-foreground rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-4">Add New Topic</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Topic Title</label>
            <input required name="title" className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" placeholder="e.g. Algebra Fundamentals" />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-bold text-muted-foreground hover:bg-muted">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg font-bold bg-foreground text-background hover:opacity-90 disabled:opacity-50">
              {loading ? "Saving..." : "Create Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewSubtopicDialog({ topicId, onClose }: { topicId: number, onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await createSubtopic({ topicId, title, slug });
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card text-foreground rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-4">Add New Lesson</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Lesson Title</label>
            <input required name="title" className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" placeholder="e.g. Introduction to Variables" />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-bold text-muted-foreground hover:bg-muted">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg font-bold bg-foreground text-background hover:opacity-90 disabled:opacity-50">
              {loading ? "Saving..." : "Create Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
