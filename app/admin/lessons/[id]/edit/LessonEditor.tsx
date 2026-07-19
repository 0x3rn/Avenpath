"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { saveLessonContent } from "../../../actions";
import { useRouter } from "next/navigation";

export default function LessonEditor({ lesson }: { lesson: any }) {
  const [content, setContent] = useState(lesson.content || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setLoading(true);
    await saveLessonContent(lesson.id, content);
    setLoading(false);
    router.push("/admin/lessons");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/lessons" className="p-2 border border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Edit Lesson</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">Editing: {lesson.title}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Content"}
        </button>
      </div>

      {/* EDITOR */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm p-1">
        <div className="flex bg-muted/30 border-b border-border px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Markdown Content
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[600px] p-4 bg-card text-foreground font-mono text-sm outline-none resize-y"
          placeholder="Write your lesson content in Markdown..."
        />
      </div>
    </div>
  );
}
