"use client";

import { useState, useEffect } from "react";
import { getDiscussionById, createReply } from "@/app/actions/community";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, MessageSquare, ThumbsUp, Share2, Flag, Send } from "lucide-react";
import Link from "next/link";

export default function DiscussionThreadPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const router = useRouter();

  const [thread, setThread] = useState<any>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadThread();
  }, [id]);

  const loadThread = async () => {
    const data = await getDiscussionById(id);
    if (data) setThread(data);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || submitting) return;
    setSubmitting(true);
    await createReply(id, replyContent);
    setReplyContent("");
    setSubmitting(false);
    await loadThread(); // reload to show the new post
  };

  if (!thread) return <div className="p-12 text-center font-bold">Loading discussion...</div>;

  const { discussion, posts } = thread;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0 animate-in fade-in duration-500">
      <Link href="/community/discussions" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Discussions
      </Link>

      {/* ORIGINAL POST */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 mb-8 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {discussion.authorAvatar ? (
              <img src={discussion.authorAvatar} alt={discussion.authorName} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {discussion.authorName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-extrabold text-lg">{discussion.authorName}</div>
              <div className="text-sm font-medium text-muted-foreground">
                Posted {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          {discussion.subjectName && (
            <span className={`${discussion.subjectColor ? discussion.subjectColor.replace('text-', 'bg-').replace('500', '500/10') : 'bg-muted'} ${discussion.subjectColor || 'text-muted-foreground'} text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded`}>
              {discussion.subjectName}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-black mb-6 leading-tight">{discussion.title}</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 text-muted-foreground font-medium leading-relaxed">
          {discussion.content}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border">
          <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <ThumbsUp className="w-5 h-5" /> {discussion.upvotes}
            </button>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-5 h-5" /> {posts.length} Replies
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors"><Flag className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* REPLIES SECTION */}
      <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-muted-foreground" /> {posts.length} Replies
      </h3>

      <div className="space-y-6 mb-12">
        {posts.map((post: any) => (
          <div key={post.id} className="bg-card border border-border rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                  {post.authorName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-bold">{post.authorName}</div>
                <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</div>
              </div>
            </div>
            <div className="text-muted-foreground font-medium mb-4">
              {post.content}
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground pt-4 border-t border-border/50">
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <ThumbsUp className="w-4 h-4" /> {post.upvotes}
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center p-8 bg-muted/30 rounded-3xl border border-border border-dashed text-muted-foreground font-bold">
            No replies yet. Be the first to answer!
          </div>
        )}
      </div>

      {/* ADD REPLY FORM */}
      <div className="bg-muted/50 rounded-3xl p-6 sm:p-8 border border-border">
        <h4 className="font-extrabold mb-4">Add your reply</h4>
        <form onSubmit={handleReply}>
          <textarea 
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            placeholder="Write your response here..."
            className="w-full bg-background border border-border rounded-2xl p-4 font-medium mb-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20"
            required
          />
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={submitting || !replyContent.trim()}
              className="bg-foreground text-background px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" /> {submitting ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
