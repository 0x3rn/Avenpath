"use client";

import { Award, Flame, Target, Trophy, Star, BookOpen, Share2, Download, CheckCircle2, Medal, Zap, Users } from "lucide-react";

export default function AchievementsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24">
      
      {/* HEADER */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" /> Achievements
        </h1>
        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
          Every milestone represents another step toward mastering your goals.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER: Main Progress */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* HERO BADGE (XP & Level) */}
          <div className="bg-foreground text-background rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl w-64 h-64 bg-yellow-500 rounded-full" />
            
            <div className="shrink-0 relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-background/20 rounded-full flex items-center justify-center border-4 border-background/30 backdrop-blur-md">
                <Award className="w-16 h-16 md:w-20 md:h-20 text-yellow-400" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-950 font-extrabold px-4 py-1.5 rounded-full text-sm whitespace-nowrap">
                Scholar
              </div>
            </div>

            <div className="flex-1 w-full text-center md:text-left relative z-10">
              <div className="text-sm font-bold uppercase tracking-wider text-background/60 mb-2">Current Level</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-8">Level 18</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>4,240 XP</span>
                  <span className="text-background/60">760 XP until Level 19</span>
                </div>
                <div className="h-3 w-full bg-background/20 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: "84%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* STREAK */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight mb-2 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500 fill-orange-500" /> Current Streak
                </h3>
                <div className="text-4xl font-extrabold">28 <span className="text-xl text-muted-foreground">Days</span></div>
              </div>
              <div className="flex gap-2">
                {/* Simulated Calendar Grid */}
                {[...Array(7)].map((_, col) => (
                  <div key={col} className="space-y-2">
                    {[...Array(3)].map((_, row) => {
                      const isActive = row < 2 || (row === 2 && col < 5);
                      return (
                        <div key={row} className={`w-4 h-4 rounded-sm ${isActive ? "bg-orange-500" : "bg-muted"}`} />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Streak Milestones */}
            <div className="relative pt-6 border-t border-border mt-8">
              <div className="absolute top-[42px] left-0 right-0 h-1 bg-muted rounded-full" />
              <div className="absolute top-[42px] left-0 w-[45%] h-1 bg-orange-500 rounded-full" />
              
              <div className="flex justify-between relative z-10">
                {[
                  { days: 7, active: true },
                  { days: 14, active: true },
                  { days: 30, active: false, current: true },
                  { days: 100, active: false },
                  { days: 365, active: false }
                ].map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-4 ${
                      m.active ? "bg-orange-500 border-card ring-2 ring-orange-500" : 
                      m.current ? "bg-card border-orange-500 ring-2 ring-orange-500/30" : "bg-card border-muted"
                    }`}>
                      {m.active && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-xs font-bold ${m.active || m.current ? "text-foreground" : "text-muted-foreground"}`}>{m.days}d</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BADGES GRID */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                <Medal className="w-6 h-6 text-muted-foreground" /> Earned Badges
              </h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {["All", "Study", "Quizzes", "Community"].map((cat, i) => (
                  <button key={i} className={`px-4 py-2 rounded-xl font-bold text-sm shrink-0 ${i === 0 ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: "First Lesson", desc: "Completed your first lesson.", color: "text-blue-500" },
                { icon: Zap, title: "Quiz Master", desc: "Score 100% on five quizzes.", color: "text-yellow-500" },
                { icon: Flame, title: "Consistency", desc: "Maintain a 30-day streak.", color: "text-orange-500" },
                { icon: Target, title: "Focused Learner", desc: "Complete 20 study sessions in one week.", color: "text-green-500" },
              ].map((badge, i) => (
                <div key={i} className="bg-card border border-border p-4 rounded-2xl flex items-start gap-4 group hover:border-foreground/30 transition-colors cursor-pointer">
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0`}>
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <div>
                    <h3 className="font-extrabold mb-1 group-hover:text-foreground transition-colors">{badge.title}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CERTIFICATES */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-muted-foreground" /> Certificates
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Calculus Foundations", date: "June 2026", color: "bg-subject-math" },
                { title: "Python Basics", date: "March 2026", color: "bg-blue-500" },
              ].map((cert, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-3xl hover:shadow-lg transition-shadow relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-24 h-24 ${cert.color}/10 rounded-full blur-2xl -mr-4 -mt-4`} />
                  
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Award className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-1">{cert.title}</h3>
                  <div className="text-xs font-bold text-muted-foreground mb-6 uppercase tracking-wider">Completed • {cert.date}</div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-muted text-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> PDF
                    </button>
                    <button className="flex-1 bg-muted text-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT: Upcoming & Mastery */}
        <div className="space-y-8">
          
          {/* UPCOMING ACHIEVEMENTS */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-muted-foreground" /> Next Milestones
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Study another 2 days</span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-extrabold text-lg mb-3">30-Day Streak Badge</h4>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: "93%" }} />
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Complete 12 Lessons</span>
                  <BookOpen className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="font-extrabold text-lg mb-3">Math Explorer Badge</h4>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* SUBJECT MASTERY */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-muted-foreground" /> Subject Mastery
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                <div>
                  <h4 className="font-extrabold">Mathematics</h4>
                  <div className="text-xs font-bold text-subject-math uppercase tracking-wider mt-1">Mastered</div>
                </div>
                <div className="text-xl font-extrabold">98%</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                <div>
                  <h4 className="font-extrabold">Computer Science</h4>
                  <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mt-1">Advanced</div>
                </div>
                <div className="text-xl font-extrabold">87%</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                <div>
                  <h4 className="font-extrabold">Biology</h4>
                  <div className="text-xs font-bold text-subject-science uppercase tracking-wider mt-1">Intermediate</div>
                </div>
                <div className="text-xl font-extrabold">64%</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
