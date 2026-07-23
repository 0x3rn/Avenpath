"use client";

import { useState, useEffect } from "react";
import { Award, BookOpen, Clock, Target, CalendarDays, Lock, Trophy, Milestone, Flame } from "lucide-react";
import { getProgressStats, getHeatmapData } from "@/app/actions/progress";
import { getMySubjects } from "@/app/actions/subjects";
import { getRecentLessons } from "@/app/actions/dashboard";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function ProgressPage() {
  const [stats, setStats] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<number[]>(Array(364).fill(0));
  const [subjects, setSubjects] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProgressStats().then(setStats),
      getHeatmapData().then(setHeatmapData),
      getMySubjects().then(setSubjects),
      getRecentLessons().then(setTimeline)
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
        <div className="flex gap-8">
           <div className="h-64 bg-card rounded-3xl w-1/3" />
           <div className="h-64 bg-card rounded-3xl w-2/3" />
        </div>
        <div className="h-64 bg-card rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER & OVERALL HERO */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Overall Completion Ring */}
        <div className="bg-foreground text-background rounded-3xl p-8 md:w-1/3 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-6 relative z-10">Overall Completion</h2>
          <div className="relative w-40 h-40 shrink-0 mb-6 relative z-10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-background/20 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-background stroke-current" strokeWidth="3" strokeDasharray={`${subjects.length > 0 ? 10 : 0}, 100`} fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-4xl">
              {subjects.length > 0 ? "10%" : "0%"}
            </div>
          </div>
          <p className="font-medium text-sm opacity-80 relative z-10">
            {subjects.length > 0 ? "You're making progress!" : "Start a lesson to see your score!"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:w-2/3">
          {[
            { title: "Lessons Completed", val: stats?.lessons || 0, icon: BookOpen },
            { title: "Hours Studied", val: stats?.hours || 0, icon: Clock },
            { title: "Quizzes Taken", val: stats?.quizzes || 0, icon: Target },
            { title: "Certificates", val: stats?.certificates || 0, icon: Award },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-between hover:border-foreground/30 transition-colors">
              <stat.icon className="w-6 h-6 text-muted-foreground mb-4" />
              <div>
                <div className="text-3xl font-extrabold mb-1">{stat.val}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEARNING CALENDAR (HEATMAP) */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-muted-foreground" /> Learning Calendar
        </h2>
        <div className="bg-card border border-border rounded-3xl p-6 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="flex gap-1">
              {/* Split 364 days into 52 weeks of 7 days */}
              {Array.from({ length: 52 }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const val = heatmapData[weekIdx * 7 + dayIdx];
                    let bg = "bg-muted";
                    if (val === 1) bg = "bg-green-200 dark:bg-green-900";
                    if (val === 2) bg = "bg-green-400 dark:bg-green-700";
                    if (val === 3) bg = "bg-green-600 dark:bg-green-500";
                    if (val === 4) bg = "bg-green-800 dark:bg-green-400";
                    return (
                      <div key={dayIdx} className={`w-3 h-3 rounded-sm ${bg} hover:ring-2 ring-foreground transition-all cursor-pointer`} />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-xs font-bold text-muted-foreground">
              Less
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted" />
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
                <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
                <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-400" />
              </div>
              More
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* SUBJECT MASTERY */}
        <div>
          <h2 className="text-xl font-extrabold tracking-tight mb-6">Subject Mastery</h2>
          {subjects.length > 0 ? (
            <div className="space-y-4">
              {subjects.map((item, i) => (
                <div key={i} className="bg-card border border-border p-5 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">{item.name}</span>
                    <span className="font-extrabold">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                    <div className={`h-full ${item.color ? item.color.replace('text-', 'bg-') : 'bg-foreground'} rounded-full`} style={{ width: `${item.percentage}%` }} />
                  </div>
                  <Link href={`/subjects/${item.regionSlug}/${item.levelSlug}/${item.slug}`} className="text-sm font-bold bg-muted px-4 py-2 rounded-lg hover:bg-foreground hover:text-background transition-colors inline-block">
                    Continue
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border p-8 rounded-3xl text-center text-muted-foreground font-bold">
              No subjects started yet.
            </div>
          )}
        </div>

        {/* ACHIEVEMENTS & TIMELINE */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { title: "7 Day Streak", status: "Completed", icon: Flame, color: "text-orange-500" },
                { title: "100 Lessons", status: "Completed", icon: BookOpen, color: "text-blue-500" },
                { title: "Perfect Quiz", status: "Completed", icon: Target, color: "text-green-500" },
                { title: "Subject Master", status: "Locked", icon: Trophy, color: "text-muted-foreground" },
                { title: "Early Bird", status: "Locked", icon: Clock, color: "text-muted-foreground" },
                { title: "Explorer", status: "Locked", icon: Lock, color: "text-muted-foreground" },
              ].map((ach, i) => (
                <div key={i} className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-colors ${ach.status === "Locked" ? "bg-card/50 border-border/50 opacity-60" : "bg-card border-border hover:border-foreground/30 cursor-pointer"}`}>
                  <ach.icon className={`w-8 h-8 ${ach.color}`} />
                  <div>
                    <div className="font-bold text-sm mb-0.5 leading-tight">{ach.title}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{ach.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Timeline</h2>
            <div className="bg-card border border-border rounded-3xl p-6">
              {timeline.length > 0 ? (
                <div className="relative border-l-2 border-muted ml-3 space-y-8">
                  {timeline.map((item, i) => (
                    <div key={i} className="pl-6 relative">
                      <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      </div>
                      <h4 className="font-bold">Completed {item.name}</h4>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : "Recently"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground font-bold py-4">
                  Your timeline is empty.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
