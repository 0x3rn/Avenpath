"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare, Clock, Filter, TrendingUp, CheckCircle2, Bookmark, Share2, Flag, ThumbsUp, Plus } from "lucide-react";
import { getDiscussions, getTopContributors, seedSampleDiscussions } from "@/app/actions/community";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [contributors, setContributors] = useState<any[]>([]);

  useEffect(() => {
    getDiscussions().then(setDiscussions);
    getTopContributors().then(setContributors);
  }, []);

  return (
    <div className="relative">

      {/* FULL UI */}
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Community Discussions</h1>
            <p className="text-muted-foreground font-medium">Ask questions, share knowledge, and learn together with students studying the same subjects.</p>
          </div>
          <Link href="/community/discussions/ask" className="bg-foreground text-background px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] active:scale-[0.98] transition-transform">
            <Plus className="w-5 h-5" /> Ask Question
          </Link>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search discussions..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl font-bold text-sm"
              readOnly
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["All", "Unanswered", "Popular", "Newest", "Following", "Solved"].map((filter, i) => (
              <button key={i} className={`px-4 py-2 rounded-xl font-bold text-sm shrink-0 ${i === 0 ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground"}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* MAIN FEED */}
          <div className="lg:col-span-3 space-y-6">
            <button 
              onClick={async () => {
                await seedSampleDiscussions();
                window.location.reload();
              }}
              className="text-xs font-bold bg-muted px-3 py-1.5 rounded-full hover:bg-foreground hover:text-background transition-colors"
            >
              Auto-Seed Discussion
            </button>

            {discussions.length > 0 ? discussions.map(disc => (
              <Link href={`/community/discussions/${disc.id}`} key={disc.id} className="block bg-card border border-border rounded-3xl p-6 sm:p-8 group hover:border-foreground/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {disc.authorAvatar ? (
                      <img src={disc.authorAvatar} alt={disc.authorName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {disc.authorName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm">{disc.authorName}</div>
                      <div className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(disc.createdAt), { addSuffix: true })}</div>
                    </div>
                  </div>
                  {disc.subjectName && (
                    <div className="flex items-center gap-2">
                      <span className={`${disc.subjectColor ? disc.subjectColor.replace('text-', 'bg-').replace('500', '500/10') : 'bg-muted'} ${disc.subjectColor || 'text-muted-foreground'} text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded`}>
                        {disc.subjectName}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-extrabold mb-2 group-hover:text-foreground/80 transition-colors">{disc.title}</h3>
                <p className="text-muted-foreground font-medium mb-6 line-clamp-2">
                  {disc.content}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-4 sm:gap-6 text-sm font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {Number(disc.replyCount)} Replies</span>
                    <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> {disc.upvotes} Helpful</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="p-2 hover:bg-muted rounded-lg transition-colors"><Bookmark className="w-4 h-4" /></div>
                    <div className="p-2 hover:bg-muted rounded-lg transition-colors"><Share2 className="w-4 h-4" /></div>
                    <div className="p-2 hover:bg-muted rounded-lg transition-colors"><Flag className="w-4 h-4" /></div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="bg-card border border-border p-12 rounded-3xl text-center">
                <p className="text-muted-foreground font-bold">No discussions found.</p>
                <p className="text-sm mt-2">Click "Auto-Seed Discussion" to generate a sample, or ask the first question!</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            
            {/* Trending Topics */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <h3 className="font-extrabold text-lg flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-muted-foreground" /> Trending Topics
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Calculus", count: 127, color: "text-subject-math" },
                  { title: "Cell Biology", count: 84, color: "text-subject-science" },
                  { title: "Organic Chemistry", count: 201, color: "text-orange-500" },
                ].map((topic, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`font-bold text-sm ${topic.color}`}>{topic.title}</span>
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">{topic.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <h3 className="font-extrabold text-lg flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground" /> Top Contributors
              </h3>
              <div className="space-y-4">
                {contributors.map((user, i) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-sm">{user.name}</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">+{user.points} pts</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
