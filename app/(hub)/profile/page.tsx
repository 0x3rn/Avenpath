"use client";

import { useState, useEffect } from "react";
import { User, Edit2, Calendar, MapPin, GraduationCap, Clock, Target, BookOpen, Star, Trophy, Zap, ChevronRight, Activity, Award, Download, CheckCircle2, Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { getUserProfile } from "@/app/actions/user";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{name: string, university?: string | null, major?: string | null, avatarUrl?: string | null, points: number} | null>(null);

  useEffect(() => {
    getUserProfile().then(p => {
      if (p) setProfile(p);
    });
  }, []);
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24">
      
      {/* HEADER & HERO */}
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
        
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="w-32 h-32 rounded-full bg-muted border-4 border-background flex items-center justify-center shrink-0 relative z-10 shadow-xl">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg border-2 border-background">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-center sm:text-left flex-1 relative z-10">
            <h2 className="text-3xl font-extrabold mb-2">{profile?.name || "Student"}</h2>
            <div className="text-muted-foreground font-bold mb-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
              <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> University Student</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined April 2026</span>
            </div>
            <Link href="/settings" className="bg-muted text-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-foreground hover:text-background transition-colors inline-block mt-2">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Study Streak", val: "28", suffix: "Days", icon: Zap, color: "text-orange-500" },
          { label: "Lessons", val: "214", icon: BookOpen, color: "text-blue-500" },
          { label: "Hours Studied", val: "94", icon: Clock, color: "text-green-500" },
          { label: "Following", val: "8", suffix: "Subs", icon: Target, color: "text-purple-500" },
          { label: "Quiz Avg", val: "91%", icon: Activity, color: "text-subject-science" },
          { label: "Achievements", val: "36", icon: Trophy, color: "text-yellow-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-2xl flex flex-col items-center text-center">
            <stat.icon className={`w-6 h-6 mb-3 ${stat.color}`} />
            <div className="text-2xl font-extrabold mb-1">{stat.val} <span className="text-sm text-muted-foreground">{stat.suffix}</span></div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Me */}
          <section className="bg-card border border-border rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold flex items-center gap-2">About Me</h3>
              <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"><Edit2 className="w-4 h-4" /></button>
            </div>
            <textarea 
              className="w-full bg-muted/50 border border-border rounded-2xl p-4 font-medium text-sm min-h-[120px] resize-none outline-none focus:border-foreground/30 transition-colors"
              placeholder="Tell other students a little about yourself..."
              defaultValue="Computer Science major passionate about AI and machine learning. Always looking to collaborate and learn new things!"
            />
            <div className="text-right text-xs font-bold text-muted-foreground mt-2">124 / 300</div>
          </section>

          {/* Education & Personal Info */}
          <div className="grid sm:grid-cols-2 gap-8">
            <section className="bg-card border border-border rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold">Education</h3>
                <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"><Edit2 className="w-4 h-4" /></Link>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Level</div>
                  <div className="font-bold">University Student</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Institution</div>
                  <div className="font-bold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-muted-foreground" /> {profile?.university || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Major</div>
                  <div className="font-bold">{profile?.major || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Graduation</div>
                  <div className="font-bold">2027</div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold">Learning Goals</h3>
                <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"><Edit2 className="w-4 h-4" /></Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Improve Grades", "Exam Preparation", "Career Growth", "Learn New Skills", "Personal Interest"].map((goal, i) => (
                  <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${i < 3 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                    {goal}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* My Subjects */}
          <section className="bg-card border border-border rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold flex items-center gap-2"><BookOpen className="w-5 h-5" /> My Subjects</h3>
              <Link href="/dashboard/subjects" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">Manage <ChevronRight className="w-4 h-4" /></Link>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Computer Science", comp: 84, color: "text-blue-500", bg: "bg-blue-500" },
                { name: "Mathematics", comp: 72, color: "text-subject-math", bg: "bg-subject-math" },
                { name: "Physics", comp: 31, color: "text-purple-500", bg: "bg-purple-500" },
              ].map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl group hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex-1">
                    <h4 className={`font-extrabold mb-2 ${sub.color}`}>{sub.name}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-card rounded-full overflow-hidden border border-border">
                        <div className={`h-full ${sub.bg} rounded-full`} style={{ width: `${sub.comp}%` }} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground w-8 text-right">{sub.comp}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-border rounded-2xl font-bold text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors">
                + Add Subject
              </button>
            </div>
          </section>

          {/* Badges Showcase */}
          <section className="bg-card border border-border rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Badges Showcase</h3>
              <Link href="/achievements" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Zap, title: "Quiz Master", color: "text-yellow-500" },
                { icon: Flame, title: "30-Day Streak", color: "text-orange-500" },
                { icon: Star, title: "Top Contributor", color: "text-blue-500" },
                { icon: Target, title: "Math Explorer", color: "text-subject-math" },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-2xl">
                  <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm mb-3">
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <div className="text-xs font-bold">{badge.title}</div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* Recent Activity */}
          <section className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-xl font-extrabold flex items-center gap-2 mb-6"><Activity className="w-5 h-5" /> Recent Activity</h3>
            
            <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
              
              <div className="relative pl-6">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-card border-4 border-blue-500" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">2 hours ago</div>
                <div className="font-bold text-sm">Completed <span className="text-blue-500">Introduction to Algebra</span></div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-card border-4 border-subject-science" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Yesterday</div>
                <div className="font-bold text-sm">Scored <span className="text-green-500">96%</span> on Biology Quiz</div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-card border-4 border-yellow-500" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">3 days ago</div>
                <div className="font-bold text-sm">Earned <span className="text-yellow-500">Quiz Master</span> Badge</div>
              </div>

            </div>
          </section>

          {/* Certificates */}
          <section className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-xl font-extrabold flex items-center gap-2 mb-6"><Award className="w-5 h-5 text-muted-foreground" /> Certificates</h3>
            
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-2xl p-4 flex items-center justify-between group hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Python Basics</h4>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Completed</div>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg bg-card shadow-sm group-hover:scale-105 transition-transform"><Download className="w-4 h-4" /></button>
              </div>
            </div>
            <Link href="/achievements" className="block text-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mt-6">
              View All Certificates
            </Link>
          </section>

        </div>

      </div>

    </div>
  );
}
