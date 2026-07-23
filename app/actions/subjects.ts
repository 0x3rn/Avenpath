"use server";

import { db } from "@/db";
import { subjects, userProgress, terms, subtopics, topics, userSubjects, categories, levels } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
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

  // 2. Find all explicitly saved subjects
  const saved = await db
    .select({ subjectId: userSubjects.subjectId })
    .from(userSubjects)
    .where(eq(userSubjects.userId, userId));

  const activeSubjectIds = [...new Set([...progress.map(p => p.subjectId), ...saved.map(s => s.subjectId)])];

  if (activeSubjectIds.length === 0) return [];

  // 3. Fetch true totals for these subjects
  const totalsRaw = await db.select({
      subjectId: terms.subjectId,
      count: sql<number>`count(*)`.as("count")
    })
    .from(subtopics)
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .where(inArray(terms.subjectId, activeSubjectIds))
    .groupBy(terms.subjectId);
    
  const subjectTotals = totalsRaw.reduce((acc, curr) => {
    acc[curr.subjectId] = Number(curr.count) || 0;
    return acc;
  }, {} as Record<string, number>);

  // 4. Fetch those subjects with their categories and levels
  const mySubjects = await db.select({
    subject: subjects,
    levelSlug: levels.slug,
    regionSlug: levels.region
  })
  .from(subjects)
  .innerJoin(categories, eq(subjects.categoryId, categories.id))
  .innerJoin(levels, eq(categories.levelId, levels.id))
  .where(inArray(subjects.id, activeSubjectIds));

  return mySubjects.map(({ subject: sub, levelSlug, regionSlug }) => {
     const completed = progress.filter(p => p.subjectId === sub.id).length;
     const total = subjectTotals[sub.id] || 0; 
     const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
     
     let status = "Not Started";
     if (completed > 0 && completed < total) status = "Started";
     else if (completed > 0 && completed >= total) status = "Finished";

     // Format the pill logic. E.g. Senior Highschool
     let levelPill = sub.levelName;
     if (sub.className !== "General") {
       levelPill = `${sub.levelName} - ${sub.className}`;
     }
     // specific formatting requested: "Nigerian Junior Highschool"
     if (sub.slug.includes('-nigerian-')) {
        levelPill = "Nigerian " + levelPill;
     }

     return {
       id: sub.id,
       name: sub.name,
       color: sub.color || "bg-blue-500",
       completed,
       total,
       percentage,
       slug: sub.slug,
       levelName: sub.levelName,
       levelSlug,
       regionSlug,
       levelPill,
       status
     };
  });
}

export async function getBasicSubjects() {
  const allLevels = await db.query.levels.findMany();
  const allCategories = await db.query.categories.findMany();
  const allSubjects = await db.query.subjects.findMany({
    columns: { id: true, name: true, categoryId: true, levelName: true, className: true }
  });

  return { levels: allLevels, categories: allCategories, subjects: allSubjects };
}
