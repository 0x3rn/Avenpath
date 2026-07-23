"use client";

import { useState, useEffect } from "react";
import { getBookmarks, toggleBookmark } from "@/app/actions/bookmarks";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Clock, BookOpen, Trash2, ArrowDownUp } from "lucide-react";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "subject">("newest");

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    const data = await getBookmarks();
    setBookmarks(data);
    setLoading(false);
  };

  const handleRemove = async (subtopicId: number) => {
    // Optimistic update
    setBookmarks(prev => prev.filter(b => b.subtopicId !== subtopicId));
    await toggleBookmark(subtopicId);
  };

  // Sort the bookmarks
  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime();
    if (sortOrder === "oldest") return new Date(a.dateSaved).getTime() - new Date(b.dateSaved).getTime();
    if (sortOrder === "subject") return a.subjectName.localeCompare(b.subjectName);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Saved Lessons</h1>
          <p className="text-muted-foreground font-medium">
            You have <span className="text-foreground font-bold">{bookmarks.length}</span> bookmarks to review.
          </p>
        </div>

        {/* Filters & Sorting */}
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl">
          <div className="px-3 text-sm font-bold text-muted-foreground flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4" /> Sort By:
          </div>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-transparent text-sm font-bold outline-none cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <option value="newest">Recently Saved</option>
            <option value="oldest">Oldest First</option>
            <option value="subject">By Subject</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border border-border h-48 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : sortedBookmarks.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-between group hover:border-foreground/30 transition-colors relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${bookmark.color ? bookmark.color.replace('bg-', 'text-') : 'text-foreground'}`}>
                    <div className={`w-2 h-2 rounded-full ${bookmark.color ? bookmark.color.replace('text-', 'bg-') : 'bg-foreground'}`} />
                    {bookmark.subjectName}
                  </div>
                  <button 
                    onClick={() => handleRemove(bookmark.subtopicId)}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-extrabold mb-2 leading-tight group-hover:text-foreground/80 transition-colors">
                  {bookmark.title}
                </h3>
                
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-6">
                  <Clock className="w-3 h-3" /> Saved {formatDistanceToNow(new Date(bookmark.dateSaved), { addSuffix: true })}
                </p>
              </div>

              <Link href={`/subjects/${bookmark.regionSlug}/${bookmark.levelSlug}/${bookmark.subjectSlug}/${bookmark.topicSlug}/${bookmark.subtopicSlug}`} className="bg-muted text-foreground px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors">
                <BookOpen className="w-4 h-4" /> Open Lesson
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-extrabold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground font-medium max-w-md mb-6">
            When you find a lesson or topic you want to remember, click the bookmark icon to save it here for later.
          </p>
          <Link href="/dashboard/subjects" className="bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
            Browse Subjects
          </Link>
        </div>
      )}
    </div>
  );
}
