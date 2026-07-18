import { db } from "@/db";
import { subjects, studySessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import PlannerClient from "@/components/planner/PlannerClient";

export default async function PlannerPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's existing scheduled sessions
  let sessions = [];
  if (user) {
    sessions = await db.query.studySessions.findMany({
      where: eq(studySessions.userId, user.id)
    });
  }

  // Fetch some default subjects for the curriculum queue (e.g. Physiology)
  // In a real app, this would query a user_enrollments table.
  const enrolledSubjects = await db.query.subjects.findMany({
    with: {
      terms: {
        with: {
          topics: true
        }
      }
    },
    limit: 5
  });

  // Transform the DB structure to match what the Sidebar expects
  const formattedSubjects = enrolledSubjects.map(s => {
    // Collect all topics across all terms
    const allTopics = s.terms.flatMap(t => t.topics);
    return {
      name: s.name,
      slug: s.slug,
      color: s.color,
      topics: allTopics
    };
  }).filter(s => s.topics.length > 0);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Interactive Study Planner</h1>
        <p className="text-muted-foreground font-medium">
          Drag and drop your curriculum topics onto the calendar to build your schedule, or click to schedule manually.
        </p>
      </div>

      <PlannerClient userSubjects={formattedSubjects} initialSessions={sessions} />
    </div>
  );
}
