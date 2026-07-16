"use client";

import { CalendarDays, Plus, CheckCircle2, CircleDashed, Clock, Bell, Target, TrendingUp, BarChart3, Repeat } from "lucide-react";

export default function StudyPlanner() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Study Planner</h1>
          <p className="text-muted-foreground font-medium">Turn learning into a consistent habit.</p>
        </div>
        
        <button className="bg-foreground text-background px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
          <Plus className="w-5 h-5" /> Schedule Session
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Agenda & Plan */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TODAY'S PLAN */}
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-muted-foreground" /> Today's Plan
            </h2>
            
            <div className="space-y-4">
              {[
                { title: "Study Mathematics", sub: "Calculus", duration: "30 mins", time: "9:00 AM", completed: true, color: "bg-subject-math" },
                { title: "Review Flashcards", sub: "Biology", duration: "15 mins", time: "2:00 PM", completed: false, color: "bg-subject-science" },
                { title: "Biology Quiz", sub: "Cell Structure", duration: "20 mins", time: "6:30 PM", completed: false, color: "bg-subject-science" },
              ].map((task, i) => (
                <div key={i} className={`bg-card border p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-foreground/30 ${task.completed ? "opacity-60 border-border" : "border-border"}`}>
                  <div className="flex items-start sm:items-center gap-4">
                    <button className="mt-1 sm:mt-0">
                      {task.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <CircleDashed className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />}
                    </button>
                    <div>
                      <h3 className={`font-extrabold text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                        <div className={`w-2 h-2 rounded-full ${task.color}`} /> {task.sub}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 pl-10 sm:pl-0">
                    <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {task.duration}</span>
                      <span className="flex items-center gap-1.5"><Bell className="w-4 h-4" /> {task.time}</span>
                    </div>
                    {!task.completed && (
                      <button className="hidden sm:block bg-muted px-4 py-2 rounded-lg text-sm font-bold hover:bg-foreground hover:text-background transition-colors">
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECURRING SCHEDULE */}
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
              <Repeat className="w-5 h-5 text-muted-foreground" /> Recurring Schedule
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { day: "Every Monday", subject: "Mathematics", time: "7:00 PM", color: "bg-subject-math" },
                { day: "Every Wed & Fri", subject: "Biology", time: "6:00 PM", color: "bg-subject-science" },
                { day: "Every Sunday", subject: "Weekly Review", time: "10:00 AM", color: "bg-muted-foreground" },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border p-5 rounded-2xl flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">{item.day}</span>
                    <h4 className="font-extrabold text-lg mb-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} /> {item.subject}
                    </h4>
                    <span className="text-sm font-bold flex items-center gap-1.5 text-muted-foreground"><Clock className="w-4 h-4" /> {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Goals & Insights */}
        <div className="space-y-8">
          
          {/* WEEKLY GOAL */}
          <div className="bg-card border border-border rounded-3xl p-8 text-center flex flex-col items-center">
            <Target className="w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="font-extrabold text-lg mb-1">Weekly Goal</h3>
            <p className="text-3xl font-extrabold mb-6">5 <span className="text-xl text-muted-foreground">/ 8 Hours</span></p>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden mb-4">
              <div className="h-full bg-foreground rounded-full w-[62.5%]" />
            </div>
            <p className="text-sm font-bold text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> You're on track!
            </p>
          </div>

          {/* INSIGHTS */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" /> Insights
            </h3>
            
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Best Study Day</span>
                <div className="font-extrabold text-xl">Wednesday</div>
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Average Session</span>
                <div className="font-extrabold text-xl">38 minutes</div>
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Most Productive Time</span>
                <div className="font-extrabold text-xl">Evening (7pm - 9pm)</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
