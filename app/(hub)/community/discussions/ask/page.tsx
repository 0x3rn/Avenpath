"use client";

import { useState } from "react";
import { createDiscussion } from "@/app/actions/community";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

export default function AskQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || submitting) return;
    setSubmitting(true);
    const result = await createDiscussion(title, content);
    if (result.success && result.id) {
      router.push(`/community/discussions/${result.id}`);
    } else {
      setSubmitting(false);
      alert("Failed to create discussion");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0 animate-in fade-in zoom-in-95 duration-500">
      <Link href="/community/discussions" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Cancel
      </Link>

      <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
          <MessageSquarePlus className="w-8 h-8 text-blue-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Ask a Question</h1>
        <p className="text-muted-foreground font-medium mb-10">
          Share your question with the community. Be as descriptive as possible so others can help you better!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-extrabold mb-2">Discussion Title</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Why does the quadratic formula always work?"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-foreground/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold mb-2">Details & Context</label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Explain what you're struggling with or what you want to discuss..."
              className="w-full bg-background border border-border rounded-2xl p-4 font-medium min-h-[200px] resize-y focus:outline-none focus:ring-2 focus:ring-foreground/20"
              required
            />
          </div>

          {/* Note: In a real app we'd have a subject/subtopic dropdown here */}

          <div className="pt-6 border-t border-border flex justify-end">
            <button 
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="bg-foreground text-background px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto justify-center"
            >
              {submitting ? "Posting..." : "Post Discussion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
