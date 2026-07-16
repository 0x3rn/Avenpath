"use client";

import Link from "next/link";
import { 
  Play, Clock, Target, CalendarDays, Flame, ChevronRight, 
  ArrowRight, BookOpen, Layers, Bookmark, Calendar, TrendingUp 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Good morning, John 👋</h1>
        <p className="text-muted-foreground font-medium">
          You're on a <span className="text-foreground font-bold">12-day study streak</span>. Keep it going today.
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
              <h2 className="text-3xl font-extrabold mb-2">Linear Equations</h2>
              <div className="flex items-center gap-2 text-sm font-bold text-subject-math mb-6">
                <BookOpen className="w-4 h-4" /> Mathematics
                <span className="text-muted-foreground ml-2">Lesson 6 of 18</span>
              </div>

              {/* Progress */}
              <div className="max-w-md space-y-2 mb-8">
                <div className="flex justify-between text-sm font-bold">
                  <span>78%</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 8 mins left
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-subject-math rounded-full w-[78%]" />
                </div>
              </div>

              <button className="bg-foreground text-background px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Continue Learning <Play className="w-4 h-4 fill-background" />
              </button>
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
              {[
                { title: "Cell Membrane", sub: "Biology", prog: 62, time: "12 mins", color: "bg-subject-science" },
                { title: "Newton's Laws", sub: "Physics", prog: 34, time: "25 mins", color: "bg-subject-physics" },
                { title: "World War II", sub: "History", prog: 89, time: "5 mins", color: "bg-subject-history" },
              ].map((item, i) => (
                <div key={i} className="min-w-[280px] bg-card border border-border rounded-2xl p-5 shrink-0 snap-start group hover:border-foreground/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} /> {item.sub}
                  </div>
                  <h4 className="font-extrabold text-lg mb-4">{item.title}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>{item.prog}%</span>
                      <span>{item.time}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.prog}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDED NEXT */}
          <div>
            <h3 className="text-xl font-extrabold tracking-tight mb-4">Recommended For You</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Probability Basics", reason: "Because you recently completed Statistics" },
                { title: "Introduction to Calculus", reason: "Based on your math proficiency" }
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between group cursor-pointer hover:border-foreground/30 transition-colors">
                  <div>
                    <h4 className="font-extrabold text-lg mb-1">{item.title}</h4>
                    <p className="text-xs font-medium text-muted-foreground mb-4">{item.reason}</p>
                  </div>
                  <div className="text-sm font-bold flex items-center gap-1 group-hover:text-subject-math transition-colors">
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
                  {[
                    { name: "Quadratic Equations", sub: "Mathematics", date: "Yesterday", score: "95%" },
                    { name: "Photosynthesis", sub: "Biology", date: "2 days ago", score: "88%" },
                    { name: "Chemical Bonds", sub: "Chemistry", date: "3 days ago", score: "92%" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-bold">{row.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.sub}</td>
                      <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{row.date}</td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">{row.score}</td>
                    </tr>
                  ))}
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
                <path className="text-foreground stroke-current" strokeWidth="3" strokeDasharray="75, 100" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-sm">
                75%
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-lg mb-1">Today's Goal</h3>
              <p className="text-sm font-medium text-muted-foreground mb-2">45 / 60 minutes</p>
              <p className="text-xs font-bold text-foreground bg-muted inline-block px-2 py-1 rounded">15 mins remaining</p>
            </div>
          </div>

          {/* WEEKLY GOAL */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-extrabold text-lg mb-1">Weekly Goal</h3>
                <p className="text-sm font-medium text-muted-foreground">5 / 8 Hours</p>
              </div>
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full bg-foreground rounded-full w-[62.5%]" />
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
              {["Functions", "Biology Cells", "Python Variables"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-subject-science" /> {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Est: 18 mins</span>
              <button className="bg-subject-science text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                Start Review
              </button>
            </div>
          </div>

          {/* WEEKLY ACTIVITY GRAPH */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-lg">Activity</h3>
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-end justify-between h-24 mb-6">
              {[40, 60, 50, 30, 80, 45, 10].map((h, i) => (
                <div key={i} className="w-6 bg-muted rounded-t-md relative group">
                  <div className="absolute bottom-0 w-full bg-foreground rounded-t-md transition-all group-hover:opacity-80" style={{ height: `${h}%` }} />
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
            <h3 className="text-2xl font-extrabold mb-1">12 Day Streak</h3>
            <p className="text-sm font-medium text-muted-foreground">Next Reward at 15 Days</p>
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
