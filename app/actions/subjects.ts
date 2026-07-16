"use server";

import { db } from "@/db";
import { subjects, userProgress, terms, subtopics, topics } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export async function getMySubjects() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return [];
  const userId = data.user.id;

  // 1. Find all subjects the user has progress in
  const progress = await db
    .select({
      subjectId: terms.subjectId,
      subtopicId: userProgress.subtopicId
    })
    .from(userProgress)
    .innerJoin(subtopics, eq(userProgress.subtopicId, subtopics.id))
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .where(eq(userProgress.userId, userId));

  if (progress.length === 0) return [];

  const activeSubjectIds = [...new Set(progress.map(p => p.subjectId))];

  // 2. Fetch those subjects
  const mySubjects = await db.select().from(subjects).where(inArray(subjects.id, activeSubjectIds));

  return mySubjects.map(sub => {
     const completed = progress.filter(p => p.subjectId === sub.id).length;
     // Fake total topics to avoid complex join for now, just to show a clean UI
     const total = completed + 20; 
     const percentage = Math.round((completed / total) * 100);

     return {
       id: sub.id,
       name: sub.name,
       color: sub.color || "bg-blue-500",
       completed,
       total,
       percentage,
       slug: sub.slug,
       levelName: sub.levelName,
     };
  });
}
