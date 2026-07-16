"use client";

import { Trophy, Medal, Star, Flame, Award, Heart, CheckCircle2 } from "lucide-react";

export default function LeaderboardsPage() {
  return (
    <div className="relative">
      
      {/* COMING SOON OVERLAY */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md rounded-3xl m-4 md:m-0">
        <div className="bg-card border border-border p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Coming Soon</h2>
          <p className="text-muted-foreground font-medium mb-6">
            The Leaderboards feature is currently under development. Get ready to celebrate your learning achievements!
          </p>
          <button disabled className="bg-muted text-muted-foreground font-bold px-6 py-2.5 rounded-xl cursor-not-allowed">
            Notify Me
          </button>
        </div>
      </div>

      {/* FULL UI (Hidden beneath overlay) */}
      <div className="max-w-7xl mx-auto space-y-12 p-4 md:p-8 animate-in fade-in duration-500 pointer-events-none select-none">
        
        {/* HEADER */}
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Leaderboards</h1>
          <p className="text-muted-foreground font-medium">Celebrate progress, consistency, and learning achievements with students around the world.</p>
        </div>

        {/* TABS & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-2 bg-muted p-1 rounded-2xl w-fit">
            {["Daily", "Weekly", "Monthly", "Friends"].map((tab, i) => (
              <button key={i} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${i === 1 ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["Global", "Country", "University", "School", "Study Group"].map((filter, i) => (
              <button key={i} className={`px-4 py-2 rounded-xl font-bold text-sm shrink-0 ${i === 0 ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground"}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* LEFT: RANKING TABLE */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* My Position Sticky Card */}
            <div className="sticky top-24 z-10 bg-foreground text-background rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-extrabold w-16 text-center">#84</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-background/20" />
                  <div>
                    <div className="font-extrabold text-lg">You</div>
                    <div className="text-xs font-bold text-background/60 uppercase tracking-wider">Gold Scholar</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-extrabold mb-1">4,214</div>
                  <div className="text-[10px] font-bold text-background/60 uppercase tracking-wider">Points</div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-bold text-green-400 mb-1">+92 Points</div>
                  <div className="text-[10px] font-bold text-background/60 uppercase tracking-wider">To Next Rank</div>
                </div>
              </div>
            </div>

            {/* Ranking Table List */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:grid">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-5">Student</div>
                <div className="col-span-2 text-right">Points</div>
                <div className="col-span-2 text-right">Lessons</div>
                <div className="col-span-2 text-right">Streak</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-border">
                {[
                  { rank: 1, name: "Sarah Johnson", pts: "18,420", lessons: "241", streak: "42 Days", medal: "text-yellow-500" },
                  { rank: 2, name: "David Kim", pts: "17,901", lessons: "229", streak: "39 Days", medal: "text-gray-400" },
                  { rank: 3, name: "Emily Rodriguez", pts: "17,205", lessons: "218", streak: "35 Days", medal: "text-orange-600" },
                  { rank: 4, name: "Michael Chen", pts: "16,840", lessons: "205", streak: "28 Days" },
                  { rank: 5, name: "Jessica Williams", pts: "16,102", lessons: "198", streak: "21 Days" },
                ].map((user, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-6 items-center hover:bg-muted/30 transition-colors">
                    <div className="col-span-1 flex items-center gap-3 sm:justify-center">
                      <span className="text-xl font-extrabold text-muted-foreground w-6 sm:w-auto text-center">#{user.rank}</span>
                      {user.medal && <Medal className={`w-5 h-5 sm:hidden ${user.medal}`} />}
                    </div>
                    
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted border-2 border-card" />
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {user.name} 
                          {user.medal && <Medal className={`w-4 h-4 hidden sm:block ${user.medal}`} />}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-between sm:block sm:text-right font-extrabold">
                      <span className="sm:hidden text-muted-foreground font-medium">Points:</span>
                      {user.pts}
                    </div>
                    
                    <div className="col-span-2 flex justify-between sm:block sm:text-right text-sm font-bold text-muted-foreground">
                      <span className="sm:hidden text-muted-foreground font-medium">Lessons:</span>
                      {user.lessons}
                    </div>

                    <div className="col-span-2 flex justify-between sm:block sm:text-right text-sm font-bold text-orange-500 flex items-center sm:justify-end gap-1">
                      <span className="sm:hidden text-muted-foreground font-medium text-foreground">Streak:</span>
                      <Flame className="w-4 h-4" /> {user.streak}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: HALL OF FAME */}
          <div className="space-y-8">
            
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Hall of Fame
            </h2>

            <div className="space-y-4">
              
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> Most Helpful
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="font-extrabold text-lg">Sarah</div>
                </div>
                <div className="text-sm font-bold text-muted-foreground">1,204 Helpful Answers</div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  <Award className="w-4 h-4 text-blue-500" /> Quiz Champion
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="font-extrabold text-lg">Michael</div>
                </div>
                <div className="text-sm font-bold text-muted-foreground">98% Average Score</div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Top Contributor
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="font-extrabold text-lg">Daniel</div>
                </div>
                <div className="text-sm font-bold text-muted-foreground">312 Resources Shared</div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
