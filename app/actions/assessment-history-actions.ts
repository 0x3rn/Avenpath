"use server";

import { db } from "@/db";
import { assessmentSubmissions } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { eq, desc } from "drizzle-orm";

export interface SaveSubmissionInput {
  title: string;
  assessmentType: "quiz" | "test" | "exam";
  score: number;
  totalScore?: number;
  percentage: number;
  breakdown?: any[];
}

export async function saveAssessmentSubmission(input: SaveSubmissionInput) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const inserted = await db.insert(assessmentSubmissions).values({
      userId: data.user.id,
      title: input.title,
      assessmentType: input.assessmentType,
      score: Math.round(input.score),
      totalScore: input.totalScore || 100,
      percentage: Math.round(input.percentage),
      breakdown: input.breakdown || [],
    }).returning();

    return { success: true, submission: inserted[0] };
  } catch (error: any) {
    console.error("Failed to save assessment submission:", error);
    return { success: false, error: error.message || "Failed to save submission" };
  }
}

export async function getUserAssessmentHistory() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return [];
  }

  try {
    const history = await db.query.assessmentSubmissions.findMany({
      where: eq(assessmentSubmissions.userId, data.user.id),
      orderBy: [desc(assessmentSubmissions.completedAt)],
    });

    return history;
  } catch (error) {
    console.error("Failed to fetch assessment history:", error);
    return [];
  }
}

export async function getAssessmentSubmissionById(id: number) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return null;
  }

  try {
    const item = await db.query.assessmentSubmissions.findFirst({
      where: (table, { eq, and }) => and(eq(table.id, id), eq(table.userId, data.user.id)),
    });

    return item || null;
  } catch (error) {
    console.error("Failed to fetch assessment submission details:", error);
    return null;
  }
}
