"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateFlashcards } from "@/app/admin/lessons/ai-actions";
import { saveFlashcards } from "@/app/admin/actions";
import { ArrowLeft, Save, AlertCircle, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function FlashcardEditor({ lesson }: { lesson: any }) {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<any[]>(lesson.flashcards || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!lesson.content || lesson.content.trim() === "") {
      toast.error("You must generate lesson content first before generating flashcards.");
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateFlashcards(lesson.content);
      setFlashcards(generated);
      toast.success("Flashcards generated successfully!");
    } catch (error: any) {
      toast.error(`Error generating flashcards: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveFlashcards(lesson.id, flashcards);
      toast.success("Flashcards saved successfully!");
      router.push("/admin/flashcards");
    } catch (error: any) {
      toast.error(`Error saving flashcards: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-2xl sticky top-20 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/flashcards" className="p-2 border border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Flashcards: {lesson.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">Manage active recall cards for this lesson.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !lesson.content}
            className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-500 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Copy className="w-4 h-4" />}
            Generate Flashcards
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || flashcards.length === 0}
            className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Save className="w-4 h-4" />}
            Save Flashcards
          </button>
        </div>
      </div>

      {!lesson.content ? (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 mt-1" />
          <div>
            <h3 className="font-bold text-lg">No Lesson Content Found</h3>
            <p className="font-medium opacity-80 mt-1">
              You must generate or write lesson notes for <strong>{lesson.title}</strong> before you can generate flashcards.
            </p>
            <Link href={`/admin/lessons/${lesson.id}/edit`} className="inline-block mt-4 text-sm font-bold bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Go to Lesson Editor
            </Link>
          </div>
        </div>
      ) : flashcards.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
          <Copy className="w-12 h-12 mb-4 opacity-50" />
          <h3 className="font-bold text-xl text-foreground mb-2">No Flashcards Yet</h3>
          <p className="font-medium max-w-sm mb-6">Generate flashcards from the lesson notes automatically using AI.</p>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-600 transition-colors"
          >
            {isGenerating ? <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Copy className="w-5 h-5" />}
            Generate Flashcards
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flashcards.map((fc, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4 text-muted-foreground">
                <span className="text-xs font-bold bg-muted px-2 py-1 rounded uppercase tracking-wider">Card {i + 1}</span>
                <button 
                  onClick={() => {
                    const updated = [...flashcards];
                    updated.splice(i, 1);
                    setFlashcards(updated);
                  }}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Front (Question)</label>
                  <textarea 
                    value={fc.front}
                    onChange={(e) => {
                      const updated = [...flashcards];
                      updated[i].front = e.target.value;
                      setFlashcards(updated);
                    }}
                    className="w-full bg-background border border-border rounded-lg p-3 text-sm font-bold min-h-[80px] focus:outline-none focus:border-foreground/30 transition-colors resize-y"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Back (Answer)</label>
                  <textarea 
                    value={fc.back}
                    onChange={(e) => {
                      const updated = [...flashcards];
                      updated[i].back = e.target.value;
                      setFlashcards(updated);
                    }}
                    className="w-full bg-background border border-border rounded-lg p-3 text-sm font-medium min-h-[100px] focus:outline-none focus:border-foreground/30 transition-colors resize-y"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
