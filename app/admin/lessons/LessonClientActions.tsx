"use client";

import { useState } from "react";
import { MoreHorizontal, Trash } from "lucide-react";
import { deleteSubtopic } from "../actions";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { toast } from "sonner";

export function LessonMenu({ lessonId }: { lessonId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  async function executeDelete() {
    setLoading(true);
    try {
      await deleteSubtopic(lessonId);
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
    <div className="relative inline-block text-left">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-muted-foreground hover:bg-card hover:text-foreground rounded-md border border-transparent hover:border-border transition-all">
        <MoreHorizontal className="w-4 h-4" />
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
