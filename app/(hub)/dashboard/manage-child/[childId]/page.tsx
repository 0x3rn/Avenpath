import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { parentChildLinks, userProfiles, assignments, userSubjects, subjects, studySessions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Calendar, CheckCircle2, ChevronRight, Activity, Award, BarChart2 } from "lucide-react";
import AssignModal from "./AssignModal";

export default async function ChildDetailDashboard(props: { params: Promise<{ childId: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify parent link
  const link = await db.select().from(parentChildLinks)
    .where(and(
      eq(parentChildLinks.parentId, user.id), 
      eq(parentChildLinks.childId, params.childId),
      eq(parentChildLinks.status, 'approved')
    ));

  if (link.length === 0) {
    redirect("/dashboard/manage-child");
  }

  // Fetch Child Data
  const childResult = await db.select().from(userProfiles).where(eq(userProfiles.id, params.childId));
  const child = childResult[0];

  // Fetch Assignments
  const childAssignments = await db.select().from(assignments).where(eq(assignments.childId, params.childId)).orderBy(desc(assignments.createdAt));

  // Fetch active subjects
  const activeSubjects = await db.select({
    subject: subjects,
    enrolledAt: userSubjects.createdAt
  })
  .from(userSubjects)
  .innerJoin(subjects, eq(userSubjects.subjectId, subjects.id))
  .where(eq(userSubjects.userId, params.childId));

  // Fetch recent study sessions
  const recentSessions = await db.select()
    .from(studySessions)
    .where(eq(studySessions.userId, params.childId))
    .orderBy(desc(studySessions.createdAt))
    .limit(5);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/manage-child" className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border shadow-sm">
              {child.avatarUrl ? (
                <img src={child.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold uppercase">{child.name.substring(0, 2)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{child.name}</h1>
              <p className="text-muted-foreground font-medium">{child.email}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <AssignModal childId={child.id} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* MAIN OVERVIEW */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-card border border-border rounded-3xl p-8 flex justify-around shadow-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <BarChart2 className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold">{activeSubjects.length}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active Subjects</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-extrabold">{child.streak || 0}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold">{child.points || 0}</div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Points</div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold mb-6">Recent Activity</h2>
            {recentSessions.length === 0 ? (
              <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground font-medium">
                No recent activity recorded for {child.name}.
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-bold">{session.title || "Study Session"}</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5" /> {session.subjectSlug || "General"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{session.durationMinutes} min</div>
                      <div className="text-xs text-muted-foreground">{session.createdAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-extrabold mb-6">Enrolled Subjects</h2>
            {activeSubjects.length === 0 ? (
              <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground font-medium">
                Not enrolled in any subjects.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {activeSubjects.map((s) => (
                  <div key={s.subject.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-background ${s.subject.color ? s.subject.color.replace('text-', 'bg-') : 'bg-foreground'}`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold mb-1">{s.subject.name}</h4>
                      <div className="text-xs font-bold text-muted-foreground uppercase">{s.subject.levelName}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-muted/30 border border-border rounded-3xl p-6">
            <h3 className="font-extrabold text-lg flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-muted-foreground" /> Assignments
            </h3>
            
            {childAssignments.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-6">
                No active assignments.
              </div>
            ) : (
              <div className="space-y-4">
                {childAssignments.map(a => (
                  <div key={a.id} className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-sm capitalize">{a.entityType}</div>
                      {a.status === 'completed' ? (
                        <div className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold">Completed</div>
                      ) : (
                        <div className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-1 rounded font-bold">Pending</div>
                      )}
                    </div>
                    <div className="text-sm font-medium mb-3">{a.entityId}</div>
                    <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Assigned {a.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
