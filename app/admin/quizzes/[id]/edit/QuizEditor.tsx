"use client";

import { useState } from "react";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { saveQuiz } from "../../../actions";
import { useRouter } from "next/navigation";

export default function QuizEditor({ quiz, initialQuestions }: { quiz: any, initialQuestions: any[] }) {
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description || "");
  const [questions, setQuestions] = useState(initialQuestions);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setLoading(true);
    await saveQuiz(quiz.id, title, description, questions);
    setLoading(false);
    router.push("/admin/quizzes");
  }

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: ""
      }
    ]);
  }

  function updateQuestion(index: number, field: string, value: any) {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  }

  function updateOption(qIndex: number, optIndex: number, value: string) {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = value;
    updated[qIndex].options = newOptions;
    setQuestions(updated);
  }

  function removeQuestion(index: number) {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/quizzes" className="p-2 border border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Edit Quiz</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">Configure questions and answers.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Quiz"}
        </button>
      </div>

      {/* QUIZ SETTINGS */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Quiz Details</h2>
        <div>
          <label className="block text-sm font-bold text-muted-foreground mb-1">Title</label>
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-muted-foreground mb-1">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground resize-none h-20" 
          />
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Questions ({questions.length})</h2>
          <button 
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold text-sm rounded-lg border border-border transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-card border border-border rounded-2xl p-6 shadow-sm relative group">
            <button 
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash className="w-4 h-4" />
            </button>
            <div className="mb-4">
              <label className="block text-sm font-bold text-muted-foreground mb-1">Question {qIndex + 1}</label>
              <input 
                value={q.questionText}
                onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" 
                placeholder="What is the..."
              />
            </div>
            
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-bold text-muted-foreground mb-1">Options (Select the correct one)</label>
              {q.options.map((opt: string, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name={`correct-${qIndex}`} 
                    checked={q.correctAnswer === optIndex}
                    onChange={() => updateQuestion(qIndex, "correctAnswer", optIndex)}
                    className="w-4 h-4"
                  />
                  <input 
                    value={opt}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    className={`flex-1 bg-muted border rounded-lg px-4 py-2 outline-none transition-colors ${q.correctAnswer === optIndex ? 'border-green-500' : 'border-border focus:border-foreground'}`}
                    placeholder={`Option ${optIndex + 1}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">Explanation (Optional)</label>
              <input 
                value={q.explanation || ""}
                onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2 outline-none focus:border-foreground" 
                placeholder="Why is this the correct answer?"
              />
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl text-muted-foreground">
            No questions yet. Click "Add Question" to start.
          </div>
        )}
      </div>
    </div>
  );
}
