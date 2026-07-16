"use server";

import { db } from "@/db";
import { userProgress, studySessions, quizAttempts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export async function getProgressStats() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const userId = data.user.id;

  const [lessons] = await db.select({ count: sql<number>`count(*)` }).from(userProgress).where(eq(userProgress.userId, userId));
  const [sessions] = await db.select({ minutes: sql<number>`sum(duration_minutes)` }).from(studySessions).where(eq(studySessions.userId, userId));
  const [quizzes] = await db.select({ count: sql<number>`count(*)` }).from(quizAttempts).where(eq(quizAttempts.userId, userId));

  return {
    lessons: Number(lessons?.count || 0),
    hours: Math.floor(Number(sessions?.minutes || 0) / 60),
    quizzes: Number(quizzes?.count || 0),
    certificates: 0 // Not implemented yet
  };
}

export async function getHeatmapData() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return Array(364).fill(0);
  const userId = data.user.id;

  const activeDays = await db.select({
      date: sql<Date>`date_trunc('day', created_at)`,
      minutes: sql<number>`sum(duration_minutes)`
    })
    .from(studySessions)
    .where(eq(studySessions.userId, userId))
    .groupBy(sql`1`);

  const heatmap = Array(364).fill(0);
  const today = new Date();
  today.setHours(0,0,0,0);

  for (const day of activeDays) {
     const diffTime = Math.abs(today.getTime() - new Date(day.date).getTime());
     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
     if (diffDays < 364) {
       let level = 1;
       const m = Number(day.minutes);
       if (m > 15) level = 2;
       if (m > 30) level = 3;
       if (m > 60) level = 4;
       heatmap[363 - diffDays] = level;
     }
  }
  return heatmap;
}
