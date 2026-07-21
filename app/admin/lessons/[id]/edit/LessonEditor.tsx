"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { saveLessonContent } from "../../../actions";
import { useRouter } from "next/navigation";
import { generateLessonContent, extractTextFromPDF } from "../../../ai-actions";
import { UploadCloud, Wand2, RefreshCw } from "lucide-react";

export default function LessonEditor({ lesson }: { lesson: any }) {
  const [content, setContent] = useState(lesson.content || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const lessonTitle = lesson.title || lesson.topic?.title || "Unknown Lesson";
  const topicTitle = lesson.topic?.title || "";
  let moduleTitle = lesson.topic?.term?.name || "";
  if (moduleTitle.toLowerCase().includes("term") || moduleTitle.toLowerCase() === "general") {
    moduleTitle = ""; // Eliminate time-based terms as they provide no context to the AI
  }

  // AI & PDF State
  const subject = lesson.topic?.term?.subject;
  let defaultAudience = "Highschool"; // A safer base fallback instead of General Audience
  if (subject) {
    const level = subject.levelName?.toLowerCase() || "";
    const cls = subject.className || "";

    if (level.includes("primary")) {
      defaultAudience = `Nigerian Primary School (${cls})`;
    } else if (level.includes("highschool")) {
      if (subject.slug?.includes("junior")) {
        const clsNum = cls.replace(/[^0-9]/g, '');
        defaultAudience = `Nigerian Junior Highschool (JSS ${clsNum || '1'})`;
      } else if (subject.slug?.includes("senior")) {
        const clsNum = cls.replace(/[^0-9]/g, '');
        defaultAudience = `Nigerian Senior Highschool (SSS ${clsNum || '1'})`;
      } else {
        defaultAudience = "Highschool";
      }
    } else if (level.includes("university")) {
      defaultAudience = "University Undergraduate";
    }
  }

  const predefinedAudiences = Array.from(new Set([
    defaultAudience,
    "Nigerian Primary School",
    "Nigerian Junior Highschool",
    "Nigerian Senior Highschool",
    "Highschool",
    "University Undergraduate"
  ]));

  const [referenceText, setReferenceText] = useState("");
  const [audience, setAudience] = useState(defaultAudience);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await saveLessonContent(lesson.id, content);
    setLoading(false);
    router.back();
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    setIsPdfLoading(true);
    try {
      const text = await extractTextFromPDF(formData);
      setReferenceText(prev => prev ? prev + "\n\n" + text : text);
    } catch (err) {
      alert("Failed to parse PDF.");
    } finally {
      setIsPdfLoading(false);
      e.target.value = ""; // Reset input
    }
  }

  async function handleGenerateNotes() {
    if (!referenceText.trim()) {
      alert("Please provide some reference text first.");
      return;
    }
    setIsAiLoading(true);
    try {
      const generatedMarkdown = await generateLessonContent(referenceText, audience, moduleTitle, topicTitle, lessonTitle);
      setContent((prev: string) => prev.trim() ? prev + "\n\n" + generatedMarkdown : generatedMarkdown);
    } catch (err) {
      alert("AI Generation failed. Check console or API key.");
    } finally {
      setIsAiLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 border border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
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

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT PANE: AI Assistant */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col h-[700px]">
            <div className="flex items-center justify-between bg-muted/30 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-muted-foreground uppercase">
                <Wand2 className="w-4 h-4 text-primary" />
                AI Content Assistant
              </div>
            </div>
            
            <div className="px-4 py-3 border-b border-border bg-card/50 flex flex-col gap-2">
              {moduleTitle && (
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Module</div>
                  <div className="font-semibold text-sm text-foreground/80 line-clamp-1">{moduleTitle}</div>
                </div>
              )}
              {topicTitle && (
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Topic</div>
                  <div className="font-semibold text-sm text-foreground/90 line-clamp-1">{topicTitle}</div>
                </div>
              )}
              <div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">Generating For Subtopic</div>
                <div className="font-extrabold text-base text-primary line-clamp-1">{lessonTitle}</div>
              </div>
            </div>
            
            <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Target Audience
                </label>
                <select 
                  value={audience} 
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-muted/50 border border-border text-foreground px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  {predefinedAudiences.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Reference Text (Source Material)
                  </label>
                  <div>
                    <input 
                      type="file" 
                      accept="application/pdf"
                      id="pdf-upload"
                      className="hidden"
                      onChange={handlePdfUpload}
                      disabled={isPdfLoading || isAiLoading}
                    />
                    <label 
                      htmlFor="pdf-upload" 
                      className={`text-xs font-bold flex items-center gap-1 cursor-pointer hover:text-primary transition-colors ${isPdfLoading ? "text-primary opacity-50" : "text-muted-foreground"}`}
                    >
                      {isPdfLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                      {isPdfLoading ? "Parsing PDF..." : "Upload PDF"}
                    </label>
                  </div>
                </div>
                <textarea
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                  className="w-full flex-1 p-3 bg-muted/50 border border-border text-foreground rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Paste textbook text, scanned OCR text, or upload a PDF to extract text..."
                />
              </div>

              <button 
                onClick={handleGenerateNotes}
                disabled={isAiLoading || !referenceText.trim()}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
              >
                {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {isAiLoading ? "Generating..." : "Generate lesson note"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Markdown Editor */}
        <div className="flex flex-col h-[700px]">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm p-1 h-full flex flex-col">
            <div className="flex bg-muted/30 border-b border-border px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Markdown Content {audience ? `for ${audience}` : ""}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 p-4 bg-card text-foreground font-mono text-sm outline-none resize-none"
              placeholder="Write your lesson content in Markdown or use the AI Assistant..."
            />
          </div>
        </div>

      </div>
    </div>
  );
}
