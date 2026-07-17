"use client";

import { useState, useEffect } from "react";
import { User, Edit2, Calendar, MapPin, GraduationCap, Clock, Target, BookOpen, Star, Trophy, Zap, ChevronRight, Activity, Award, Download, CheckCircle2, Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { getUserProfile, getUserBadges, getUserCertificates } from "@/app/actions/user";
import { getProgressStats } from "@/app/actions/progress";
import { getRecentLessons } from "@/app/actions/dashboard";
import { getMySubjects } from "@/app/actions/subjects";
import { formatDistanceToNow, format } from "date-fns";
import * as Icons from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [mySubjects, setMySubjects] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUserProfile().then(setProfile),
      getProgressStats().then(setStats),
      getRecentLessons().then(setRecentActivity),
      getMySubjects().then(setMySubjects),
      getUserBadges().then(setBadges),
      getUserCertificates().then(setCertificates),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );

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
              {profile?.university && <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {profile.university}</span>}
              {profile?.university && <span className="hidden sm:inline">•</span>}
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {profile?.createdAt ? format(new Date(profile.createdAt), "MMMM yyyy") : "Recently"}</span>
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
          { label: "Study Streak", val: stats?.streak || 0, suffix: "Days", icon: Zap, color: "text-orange-500" },
          { label: "Lessons", val: stats?.totalLessons || 0, icon: BookOpen, color: "text-blue-500" },
          { label: "Hours Studied", val: stats?.totalHours || 0, icon: Clock, color: "text-green-500" },
          { label: "Quizzes", val: stats?.totalQuizzes || 0, suffix: "Done", icon: Target, color: "text-purple-500" },
          { label: "Quiz Avg", val: `${stats?.quizAvg || 0}%`, icon: Activity, color: "text-subject-science" },
          { label: "Achievements", val: badges.length, icon: Trophy, color: "text-yellow-500" },
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
            <div className="bg-muted/50 border border-border rounded-2xl p-4 font-medium text-sm min-h-[120px] transition-colors">
              {profile?.bio || "You haven't written a bio yet."}
            </div>
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
                  <div className="font-bold">Student</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Institution</div>
                  <div className="font-bold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-muted-foreground" /> {profile?.university || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Major</div>
                  <div className="font-bold">{profile?.major || "Not specified"}</div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold">Learning Goals</h3>
                <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"><Edit2 className="w-4 h-4" /></Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.learningGoals && profile.learningGoals.length > 0 ? profile.learningGoals.map((goal: string, i: number) => (
                  <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${i < 3 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                    {goal}
                  </span>
                )) : (
                  <span className="text-sm font-bold text-muted-foreground">No learning goals set.</span>
                )}
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
              {mySubjects.length > 0 ? mySubjects.map((sub, i) => (
                <Link href={`/dashboard/subjects/${sub.id}`} key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl group hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex-1">
                    <h4 className={`font-extrabold mb-2 ${sub.color}`}>{sub.name}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-card rounded-full overflow-hidden border border-border">
                        <div className={`h-full ${sub.color.replace('text-', 'bg-')} rounded-full`} style={{ width: `${sub.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground w-8 text-right">{sub.progress}%</span>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="text-sm font-bold text-muted-foreground py-4">Not enrolled in any subjects.</div>
              )}
              <Link href="/dashboard/subjects" className="w-full py-4 border-2 border-dashed border-border rounded-2xl font-bold text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors flex items-center justify-center">
                + Add Subject
              </Link>
            </div>
          </section>

          {/* Badges Showcase */}
          <section className="bg-card border border-border rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Badges Showcase</h3>
              <Link href="/achievements" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {badges.length > 0 ? badges.map((b, i) => {
                const IconComponent = (Icons as any)[b.badge.iconName] || Icons.Star;
                return (
                  <div key={i} className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-2xl">
                    <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm mb-3">
                      <IconComponent className={`w-6 h-6 ${b.badge.color}`} />
                    </div>
                    <div className="text-xs font-bold">{b.badge.name}</div>
                  </div>
                )
              }) : (
                <div className="col-span-full text-sm font-bold text-muted-foreground py-4 text-center">No badges earned yet. Complete lessons and quizzes to earn badges!</div>
              )}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* Recent Activity */}
          <section className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-xl font-extrabold flex items-center gap-2 mb-6"><Activity className="w-5 h-5" /> Recent Activity</h3>
            
            <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
              
              {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((act, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-card border-4 border-foreground" />
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {act.date ? formatDistanceToNow(new Date(act.date), { addSuffix: true }) : "Recently"}
                  </div>
                  <div className="font-bold text-sm">
                    {act.type === 'lesson' ? 'Completed ' : 'Scored '} 
                    <span className="text-foreground">{act.name}</span>
                    {act.type === 'quiz' && <span className="text-green-500 ml-1">({act.score})</span>}
                  </div>
                </div>
              )) : (
                <div className="text-sm font-bold text-muted-foreground pl-6">No recent activity.</div>
              )}

            </div>
          </section>

          {/* Certificates */}
          <section className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-xl font-extrabold flex items-center gap-2 mb-6"><Award className="w-5 h-5 text-muted-foreground" /> Certificates</h3>
            
            <div className="space-y-4">
              {certificates.length > 0 ? certificates.map((c, i) => (
                <div key={i} className="bg-muted/50 rounded-2xl p-4 flex items-center justify-between group hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{c.certificate.name}</h4>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                        Earned {format(new Date(c.earnedAt), "MMM yyyy")}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg bg-card shadow-sm group-hover:scale-105 transition-transform"><Download className="w-4 h-4" /></button>
                </div>
              )) : (
                <div className="text-sm font-bold text-muted-foreground text-center py-4">No certificates earned yet.</div>
              )}
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
