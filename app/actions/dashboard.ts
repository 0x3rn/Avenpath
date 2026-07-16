"use server";

import { db } from "@/db";
import { userProfiles, userProgress, subtopics, topics, terms, subjects, studySessions } from "@/db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const userId = data.user.id;

  // Get user profile for streak
  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, userId));
  
  // Get today's study minutes
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySessions = await db
    .select({ totalMinutes: sql<number>`sum(${studySessions.durationMinutes})` })
    .from(studySessions)
    .where(and(
      eq(studySessions.userId, userId),
      gte(studySessions.createdAt, today)
    ));
    
  const todayMinutes = todaySessions[0]?.totalMinutes || 0;

  // Get weekly activity (last 7 days including today)
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 6);

  const weeklyData = await db
    .select({
      date: sql<Date>`date_trunc('day', ${studySessions.createdAt})`,
      minutes: sql<number>`sum(${studySessions.durationMinutes})`
    })
    .from(studySessions)
    .where(and(
      eq(studySessions.userId, userId),
      gte(studySessions.createdAt, oneWeekAgo)
    ))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // Map to M, T, W, T, F, S, S array
  // For simplicity in UI, we'll just return the last 7 days of minutes in order
  const last7Days = Array(7).fill(0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(oneWeekAgo);
    d.setDate(d.getDate() + i);
    const match = weeklyData.find(w => new Date(w.date).getTime() === d.getTime());
    if (match) {
      last7Days[i] = Number(match.minutes);
    }
  }

  // Calculate total weekly minutes
  const weeklyMinutes = last7Days.reduce((a, b) => a + b, 0);

  return {
    streak: profile?.streak || 0,
    todayMinutes: Number(todayMinutes),
    todayGoal: 60, // Fixed goal for now
    weeklyHours: Math.round(weeklyMinutes / 60),
    weeklyGoal: 8, // Fixed weekly goal
    activityGraph: last7Days
  };
}

export async function getRecentLessons() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return [];

  const userId = data.user.id;

  const lessons = await db
    .select({
      name: subtopics.title,
      subjectName: subjects.name,
      date: userProgress.completedAt,
    })
    .from(userProgress)
    .innerJoin(subtopics, eq(userProgress.subtopicId, subtopics.id))
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .innerJoin(subjects, eq(terms.subjectId, subjects.id))
    .where(eq(userProgress.userId, userId))
    .orderBy(desc(userProgress.completedAt))
    .limit(5);

  return lessons.map(l => ({
    ...l,
    score: "Done"
  }));
}

export async function getContinueLearning() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return [];
  const userId = data.user.id;

  // 1. Fetch user progress to know what subjects they are actually studying
  const progress = await db
    .select({
      subtopicId: userProgress.subtopicId,
      subjectId: terms.subjectId
    })
    .from(userProgress)
    .innerJoin(subtopics, eq(userProgress.subtopicId, subtopics.id))
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .where(eq(userProgress.userId, userId));

  // If the user hasn't studied anything yet, Continue Learning should be empty!
  if (progress.length === 0) return [];

  const completedIds = progress.map(p => p.subtopicId);
  const activeSubjectIds = [...new Set(progress.map(p => p.subjectId))];

  // 2. Only fetch subtopics from subjects the user has explicitly started
  const subList = await db
    .select({
      id: subtopics.id,
      title: subtopics.title,
      subjectName: subjects.name,
      color: subjects.color
    })
    .from(subtopics)
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .innerJoin(subjects, eq(terms.subjectId, subjects.id));

  // Filter for only active subjects, and exclude already completed subtopics
  // (In a real app with a lot of data, we would use an IN clause in Drizzle, but this works for our scale)
  const pending = subList.filter(s => activeSubjectIds.includes(s.id as unknown as string) && !completedIds.includes(s.id)).slice(0, 3);

  return pending.map(s => ({
    id: s.id,
    title: s.title,
    sub: s.subjectName,
    prog: 0,
    time: "15 mins",
    color: s.color || "bg-blue-500"
  }));
}

export async function seedStudySession(minutes: number) {
  // Utility to seed session data for testing
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await db.insert(studySessions).values({
    userId: data.user.id,
    durationMinutes: minutes
  });
  
  await db.update(userProfiles).set({
    streak: sql`streak + 1`,
    lastActiveDate: new Date()
  }).where(eq(userProfiles.id, data.user.id));
}
