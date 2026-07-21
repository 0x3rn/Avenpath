import { Users, BookOpen, Layers, HelpCircle, Plus, MoreHorizontal, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import * as schema from "@/db/schema";

import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: subjectCount } = await supabase.from("subjects").select("*", { count: "exact", head: true });
  const { count: topicCount } = await supabase.from("topics").select("*", { count: "exact", head: true });
  const { count: lessonCount } = await supabase.from("subtopics").select("*", { count: "exact", head: true });
  const { count: quizCount } = await supabase.from("quizzes").select("*", { count: "exact", head: true });
  const { count: userCount } = await supabase.from("user_profiles").select("*", { count: "exact", head: true });
  const { count: quizQCount } = await supabase.from("quiz_questions").select("*", { count: "exact", head: true });

  const { data: subtopicsWithFlashcards } = await supabase.from("subtopics").select("flashcards").not("flashcards", "is", null);
  let flashcardCount = 0;
  if (subtopicsWithFlashcards) {
    for (const st of subtopicsWithFlashcards) {
      if (Array.isArray(st.flashcards)) {
        flashcardCount += st.flashcards.length;
      }
    }
  }

  const totalQuestions = (quizQCount || 0) + flashcardCount;

  // Recent lessons (subtopics) with their parent subject
  const recentLessons = await db.query.subtopics.findMany({
    limit: 5,
    orderBy: (subtopics, { desc }) => [desc(subtopics.id)],
    with: {
      topic: {
        with: {
          term: {
            with: {
              subject: true,
            },
          },
        },
      },
    },
  });

  const kpis = [
    { label: "Subjects", val: (subjectCount || 0).toLocaleString(), icon: Layers, color: "text-orange-500" },
    { label: "Topics", val: (topicCount || 0).toLocaleString(), icon: BookOpen, color: "text-purple-500" },
    { label: "Lessons", val: (lessonCount || 0).toLocaleString(), icon: BookOpen, color: "text-blue-500" },
    { label: "Quizzes", val: (quizCount || 0).toLocaleString(), icon: HelpCircle, color: "text-pink-500" },
    { label: "Questions", val: totalQuestions.toLocaleString(), icon: HelpCircle, color: "text-yellow-500" },
    { label: "Users", val: (userCount || 0).toLocaleString(), icon: Users, color: "text-green-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Overview</h1>
          <p className="text-muted-foreground font-medium">Platform overview and quick actions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "Create Subject", href: "/admin/subjects" },
            { label: "Create Lesson", href: "/admin/lessons" },
            { label: "Create Quiz", href: "/admin/quizzes" },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${
                i === 0
                  ? "bg-foreground text-background shadow-sm hover:opacity-90"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              <Plus className="w-4 h-4" /> {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-muted">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <div className="text-2xl font-extrabold mb-1">{kpi.val}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* RECENT CONTENT TABLE */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-extrabold">Recent Lessons</h3>
          <Link href="/admin/lessons" className="text-sm font-bold text-blue-500 hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Lesson</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Topic</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentLessons.map((lesson) => {
                const subject = lesson.topic?.term?.subject;
                const hasContent = !!lesson.content && lesson.content.length > 50;
                return (
                  <tr key={lesson.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-sm">{lesson.title}</td>
                    <td className="p-4 text-sm font-medium text-muted-foreground">{subject?.name || "—"}</td>
                    <td className="p-4 text-sm font-medium text-muted-foreground truncate max-w-[200px]">{lesson.topic?.title || "—"}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        hasContent ? "text-green-500 bg-green-500/10" : "text-orange-500 bg-orange-500/10"
                      }`}>
                        {hasContent ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentLessons.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground font-medium">
                    No lessons found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
