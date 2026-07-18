"use client";

import { Users, Activity, BookOpen, Layers, HelpCircle, Clock, Plus, AlertCircle, FileEdit, CheckCircle2, ChevronRight, MoreHorizontal, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const CHART_HEIGHTS = [45, 60, 35, 80, 50, 70, 90, 40, 55, 75, 85, 30, 65, 95, 50, 40, 80, 60, 70, 55, 85, 45, 75, 90, 35, 65, 50, 80, 40, 70];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Good Morning, Admin</h1>
          <p className="text-muted-foreground font-medium">Here's what's happening on Avenpath today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["Create Subject", "Create Lesson", "Upload Media", "Create Quiz"].map((action, i) => (
            <button key={i} className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${
              i === 0 ? "bg-foreground text-background shadow-sm hover:opacity-90" : "bg-card border border-border text-foreground hover:bg-muted"
            }`}>
              <Plus className="w-4 h-4" /> {action}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Students", val: "248,492", icon: Users, color: "text-blue-500", trend: "+12%" },
          { label: "Active Today", val: "18,420", icon: Activity, color: "text-green-500", trend: "+5%" },
          { label: "Lessons Published", val: "12,842", icon: BookOpen, color: "text-purple-500", trend: "+2" },
          { label: "Subjects", val: "154", icon: Layers, color: "text-orange-500", trend: "0" },
          { label: "Quizzes", val: "9,614", icon: HelpCircle, color: "text-pink-500", trend: "+14" },
          { label: "Study Hours Today", val: "42,318", icon: Clock, color: "text-yellow-500", trend: "+8%" },
        ].map((kpi, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-muted">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              {kpi.trend !== "0" && (
                <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5 bg-green-500/10 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3" /> {kpi.trend}
                </span>
              )}
            </div>
            <div className="text-2xl font-extrabold mb-1">{kpi.val}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* USER GROWTH CHART (Simulated) */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold">User Growth</h3>
              <select className="bg-muted border border-border rounded-lg px-3 py-1.5 text-xs font-bold outline-none cursor-pointer">
                <option>Last 30 Days</option>
                <option>This Week</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64 w-full flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2 border-b border-border relative">
              {/* Simulated Chart Bars */}
              {CHART_HEIGHTS.map((height, i) => (
                  <div key={i} className="w-full bg-blue-500/20 hover:bg-blue-500 transition-colors rounded-t-sm" style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">
              <span>May 1</span>
              <span>May 15</span>
              <span>May 30</span>
            </div>
          </div>

          {/* RECENT CONTENT TABLE */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-extrabold">Recent Content</h3>
              <Link href="/admin/lessons" className="text-sm font-bold text-blue-500 hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Lesson</th>
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Updated</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { title: "Introduction to Calculus", sub: "Mathematics", status: "Published", statusCol: "bg-green-500", date: "2 hrs ago" },
                    { title: "Cell Division Explained", sub: "Biology", status: "Draft", statusCol: "bg-orange-500", date: "5 hrs ago" },
                    { title: "Python Data Structures", sub: "Computer Science", status: "In Review", statusCol: "bg-blue-500", date: "1 day ago" },
                    { title: "Newton's Laws", sub: "Physics", status: "Published", statusCol: "bg-green-500", date: "2 days ago" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors group cursor-pointer">
                      <td className="p-4 font-bold text-sm">{row.title}</td>
                      <td className="p-4 text-sm font-medium text-muted-foreground">{row.sub}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-muted ${row.statusCol.replace('bg-', 'text-')}`}>
                          <div className={`w-2 h-2 rounded-full ${row.statusCol}`} /> {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-muted-foreground">{row.date}</td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 text-muted-foreground hover:bg-card hover:text-foreground rounded-md opacity-0 group-hover:opacity-100 transition-all border border-transparent group-hover:border-border"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Content */}
        <div className="space-y-8">
          
          {/* PENDING REVIEWS */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-lg font-extrabold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" /> Action Required
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-orange-600 dark:text-orange-400">8 Draft Lessons</div>
                  <div className="text-xs font-bold text-orange-600/70 uppercase tracking-wider mt-0.5">Needs Review</div>
                </div>
                <button className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">Review</button>
              </div>

              <div className="p-4 bg-muted border border-border rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-extrabold">14 Uploaded Images</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Awaiting Approval</div>
                </div>
                <button className="px-3 py-1.5 bg-background border border-border text-xs font-bold rounded-lg hover:bg-muted transition-colors">View</button>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-red-600 dark:text-red-400">21 User Reports</div>
                  <div className="text-xs font-bold text-red-600/70 uppercase tracking-wider mt-0.5">Open Tickets</div>
                </div>
                <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">Resolve</button>
              </div>
            </div>
          </div>

          {/* PLATFORM ACTIVITY TIMELINE */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-lg font-extrabold mb-6">Activity Log</h3>
            <div className="relative border-l-2 border-muted ml-3 space-y-6 pb-2">
              
              <div className="relative pl-5">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-card border-4 border-blue-500" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">2 mins ago</div>
                <div className="font-bold text-sm text-muted-foreground">Sarah completed <span className="text-foreground">Biology Quiz</span></div>
              </div>

              <div className="relative pl-5">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-card border-4 border-green-500" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">15 mins ago</div>
                <div className="font-bold text-sm text-muted-foreground">New subject published <span className="text-foreground">Engineering Math</span></div>
              </div>

              <div className="relative pl-5">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-card border-4 border-purple-500" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">1 hour ago</div>
                <div className="font-bold text-sm text-muted-foreground">Admin approved <span className="text-foreground">Microbiology Lessons</span></div>
              </div>

            </div>
            <Link href="#" className="block mt-6 text-sm font-bold text-blue-500 hover:underline text-center">View Full Log</Link>
          </div>

          {/* MOST POPULAR SUBJECTS */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-lg font-extrabold mb-6">Popular Subjects</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-subject-math/10 flex items-center justify-center text-subject-math font-extrabold">M</div>
                  <span className="font-bold text-sm">Mathematics</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">48.1k</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-extrabold">C</div>
                  <span className="font-bold text-sm">Computer Science</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">41.0k</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
