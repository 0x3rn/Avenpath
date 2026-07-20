"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserProfile } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

export async function toggleUserSubject(subjectId: string) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Must be logged in to save subjects");

  const existing = await db.query.userSubjects.findFirst({
    where: (us, { eq, and }) => and(eq(us.userId, profile.id), eq(us.subjectId, subjectId))
  });

  if (existing) {
    await db.delete(schema.userSubjects).where(eq(schema.userSubjects.id, existing.id));
  } else {
    await db.insert(schema.userSubjects).values({
      userId: profile.id,
      subjectId,
    });
  }

  revalidatePath("/dashboard/subjects");
  revalidatePath(`/subjects/[level]/[subject]`, "page");
  
  return { success: true, isSaved: !existing };
}
