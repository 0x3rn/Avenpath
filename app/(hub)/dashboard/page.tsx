"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, Clock, Target, CalendarDays, Flame, ChevronRight, 
  ArrowRight, BookOpen, Layers, Bookmark, Calendar, TrendingUp 
} from "lucide-react";
import { getUserProfile } from "@/app/actions/user";
import { getDashboardStats, getRecentLessons, getContinueLearning, seedStudySession } from "@/app/actions/dashboard";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [continueLearning, setContinueLearning] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUserProfile().then(p => {
        if (p) setProfile({ name: p.name });
      }),
      getDashboardStats().then(setStats),
      getRecentLessons().then(setRecentLessons),
      getContinueLearning().then(setContinueLearning)
    ]).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-16 w-1/3 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="h-64 bg-card border border-border rounded-3xl" />
             <div className="h-48 bg-card border border-border rounded-3xl" />
             <div className="h-64 bg-card border border-border rounded-3xl" />
          </div>
          <div className="space-y-6">
             <div className="h-32 bg-card border border-border rounded-3xl" />
             <div className="h-32 bg-card border border-border rounded-3xl" />
             <div className="h-64 bg-card border border-border rounded-3xl" />
             <div className="h-48 bg-card border border-border rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">{greeting}, {profile?.name ? profile.name.split(" ")[0] : "Student"} 👋</h1>
        <p className="text-muted-foreground font-medium">
          You're on a <span className="text-foreground font-bold">{stats?.streak || 0}-day study streak</span>. Keep it going today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- MAIN COLUMN (Left 2/3) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HERO CARD */}
          <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group">
            {/* Subtle Illustration background */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-subject-math/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute right-8 top-8 opacity-10">
               {/* Decorative Math SVG */}
               <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>

            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 block">
                Continue where you left off
              </span>
              <h2 className="text-3xl font-extrabold mb-2">{continueLearning[0]?.title || "Get Started"}</h2>
              <div className={`flex items-center gap-2 text-sm font-bold ${continueLearning[0]?.color ? continueLearning[0].color.replace('bg-', 'text-') : 'text-foreground'} mb-6`}>
                <BookOpen className="w-4 h-4" /> {continueLearning[0]?.sub || "Pick a subject"}
              </div>

              {/* Progress */}
              {continueLearning[0] && (
                <div className="max-w-md space-y-2 mb-8">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{continueLearning[0].prog}%</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {continueLearning[0].time} left
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${continueLearning[0].color} rounded-full`} style={{ width: `${continueLearning[0].prog}%` }} />
                  </div>
                </div>
              )}

              <Link href={continueLearning[0] ? "/dashboard/continue" : "/dashboard/subjects"} className="bg-foreground text-background px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform w-fit">
                {continueLearning[0] ? "Continue Learning" : "Browse Subjects"} <Play className="w-4 h-4 fill-background" />
              </Link>
            </div>
          </div>

          {/* CONTINUE LEARNING ROW */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold tracking-tight">Continue Learning</h3>
              <Link href="/dashboard/continue" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
              {continueLearning.length > 1 ? continueLearning.slice(1).map((item, i) => (
                <div key={i} className="min-w-[280px] bg-card border border-border rounded-2xl p-5 shrink-0 snap-start group hover:border-foreground/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                    <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} /> {item.sub}
                  </div>
                  <h4 className="font-extrabold text-lg mb-4">{item.title}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>{item.prog}%</span>
                      <span>{item.time}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color.replace('text-', 'bg-')} rounded-full`} style={{ width: `${item.prog}%` }} />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm font-bold text-muted-foreground py-8">No current topics started. Pick a subject to begin!</div>
              )}
            </div>
          </div>

          {/* RECOMMENDED NEXT */}
          <div>
            <h3 className="text-xl font-extrabold tracking-tight mb-4">Recommended For You</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {continueLearning.slice(0, 2).map((item, i) => (
                <div key={i} className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between group cursor-pointer hover:border-foreground/30 transition-colors">
                  <div>
                    <h4 className="font-extrabold text-lg mb-1">{item.title}</h4>
                    <p className="text-xs font-medium text-muted-foreground mb-4">From {item.sub}</p>
                  </div>
                  <div className={`text-sm font-bold flex items-center gap-1 transition-colors ${item.color.replace('bg-', 'text-')}`}>
                    Start <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT LESSONS TABLE */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-extrabold tracking-tight">Recent Lessons</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs font-bold text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-4">Lesson</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Completed</th>
                    <th className="px-6 py-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {recentLessons.length > 0 ? recentLessons.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-bold">{row.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.subjectName}</td>
                      <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{row.date ? formatDistanceToNow(new Date(row.date), { addSuffix: true }) : "Unknown"}</td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">{row.score}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground font-bold">No recent lessons. Start learning today!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>


        {/* --- RIGHT COLUMN (Right 1/3) --- */}
        <div className="space-y-6">
          
          {/* DAILY GOAL */}
          <div className="bg-card border border-border rounded-3xl p-6 flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              {/* Fake SVG Circle Progress */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-muted stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-foreground stroke-current" strokeWidth="3" strokeDasharray={`${stats ? Math.min(Math.round((stats.todayMinutes / stats.todayGoal) * 100), 100) : 0}, 100`} fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-sm">
                {stats ? Math.round((stats.todayMinutes / stats.todayGoal) * 100) : 0}%
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-lg mb-1">Today's Goal</h3>
              <p className="text-sm font-medium text-muted-foreground mb-2">{stats?.todayMinutes || 0} / {stats?.todayGoal || 60} minutes</p>
              {stats && stats.todayMinutes < stats.todayGoal ? (
                <p className="text-xs font-bold text-foreground bg-muted inline-block px-2 py-1 rounded">{stats.todayGoal - stats.todayMinutes} mins remaining</p>
              ) : (
                <p className="text-xs font-bold text-green-600 bg-green-500/10 inline-block px-2 py-1 rounded">Goal reached! 🎉</p>
              )}
            </div>
          </div>

          {/* WEEKLY GOAL */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-extrabold text-lg mb-1">Weekly Goal</h3>
                <p className="text-sm font-medium text-muted-foreground">{stats?.weeklyHours || 0} / {stats?.weeklyGoal || 8} Hours</p>
              </div>
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${Math.min(((stats?.weeklyHours || 0) / (stats?.weeklyGoal || 8)) * 100, 100)}%` }} />
            </div>
            <p className="text-xs font-bold text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> You're ahead of last week!
            </p>
          </div>

          {/* UPCOMING REVIEW */}
          <div className="bg-subject-science/10 border border-subject-science/20 rounded-3xl p-6">
            <h3 className="font-extrabold text-lg mb-4 text-subject-science flex items-center gap-2">
              <Clock className="w-5 h-5" /> Review Today
            </h3>
            <ul className="space-y-3 mb-6">
              {continueLearning.length > 0 ? continueLearning.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-bold">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color ? item.color.replace('text-', 'bg-') : 'bg-subject-science'}`} /> {item.title}
                </li>
              )) : (
                <li className="text-sm font-bold text-muted-foreground">No reviews scheduled for today.</li>
              )}
            </ul>
            {continueLearning.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Est: 18 mins</span>
                <button className="bg-subject-science text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                  Start Review
                </button>
              </div>
            )}
          </div>

          {/* WEEKLY ACTIVITY GRAPH */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-lg">Activity</h3>
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-end justify-between h-24 mb-6">
              {stats?.activityGraph ? stats.activityGraph.map((h: number, i: number) => {
                const max = Math.max(...stats.activityGraph, 60);
                const heightPercentage = Math.max((h / max) * 100, 5); // At least 5% so it's visible
                return (
                  <div key={i} className="w-6 bg-muted rounded-t-md relative group">
                    <div className="absolute bottom-0 w-full bg-foreground rounded-t-md transition-all group-hover:opacity-80" style={{ height: `${heightPercentage}%` }} />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {h} mins
                    </div>
                  </div>
                )
              }) : Array(7).fill(0).map((_, i) => (
                <div key={i} className="w-6 bg-muted rounded-t-md relative group">
                  <div className="absolute bottom-0 w-full bg-foreground/10 rounded-t-md transition-all" style={{ height: `5%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold text-muted-foreground px-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>

          {/* STREAK */}
          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 fill-orange-500 text-orange-500" />
            </div>
            <h3 className="text-2xl font-extrabold mb-1">{stats?.streak || 0} Day Streak</h3>
            <p className="text-sm font-medium text-muted-foreground">Next Reward at {(stats?.streak || 0) + 3} Days</p>
            <button 
              onClick={async () => {
                await seedStudySession(15);
                window.location.reload();
              }}
              className="mt-4 text-xs font-bold bg-muted px-3 py-1 rounded-full hover:bg-foreground hover:text-background transition-colors"
            >
              Simulate Session
            </button>
          </div>

          {/* MOTIVATION */}
          <div className="bg-foreground text-background rounded-3xl p-6 text-center">
            <p className="font-bold text-lg leading-snug mb-2">"Consistency beats intensity."</p>
            <p className="text-sm font-medium opacity-80">Just 15 minutes today keeps your streak alive.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
