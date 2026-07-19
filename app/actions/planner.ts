"use server";

import { db } from "@/db";
import { studySessions, userProfiles } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq, and, gte, lte } from "drizzle-orm";
import { endOfWeek, startOfWeek } from "date-fns";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getStudySessions(startDateStr: string, endDateStr: string) {
  const user = await getUser();
  if (!user) return [];

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  return await db.query.studySessions.findMany({
    where: and(
      eq(studySessions.userId, user.id),
      gte(studySessions.scheduledDate, startDate),
      lte(studySessions.scheduledDate, endDate)
    )
  });
}

export async function scheduleSession(subjectSlug: string, topicSlug: string, title: string, scheduledDate: string, durationMinutes: number = 60) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db.insert(studySessions).values({
    userId: user.id,
    subjectSlug,
    topicSlug,
    title,
    scheduledDate: new Date(scheduledDate),
    durationMinutes
  });
  
  return { success: true };
}

export async function updateSessionComplete(sessionId: number, isCompleted: boolean) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db.update(studySessions)
    .set({ isCompleted })
    .where(and(eq(studySessions.id, sessionId), eq(studySessions.userId, user.id)));
  
  return { success: true };
}

export async function deleteSession(sessionId: number) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db.delete(studySessions)
    .where(and(eq(studySessions.id, sessionId), eq(studySessions.userId, user.id)));
  
  return { success: true };
}
