"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- SUBJECTS ---
export async function deleteSubject(subjectId: string) {
  await db.delete(schema.subjects).where(eq(schema.subjects.id, subjectId));
  revalidatePath("/admin/subjects");
  revalidatePath("/subjects");
  return { success: true };
}

export async function createSubject(data: { id: string, name: string, categoryId: number, levelName: string, className: string, description: string, icon: string, color: string }) {
  await db.insert(schema.subjects).values({
    ...data,
    slug: data.id,
    country: "International",
    curriculum: "General",
  });
  revalidatePath("/admin/subjects");
  revalidatePath("/subjects");
  return { success: true };
}

// --- TOPICS ---
export async function createTopic(data: { termId: number, title: string, slug: string }) {
  await db.insert(schema.topics).values({
    termId: data.termId,
    title: data.title,
    slug: data.slug,
    order: 0,
  });
  revalidatePath("/admin/topics");
  return { success: true };
}

export async function deleteTopic(topicId: number) {
  await db.delete(schema.topics).where(eq(schema.topics.id, topicId));
  revalidatePath("/admin/topics");
  return { success: true };
}

// --- SUBTOPICS / LESSONS ---
export async function createSubtopic(data: { topicId: number, title: string, slug: string }) {
  await db.insert(schema.subtopics).values({
    topicId: data.topicId,
    title: data.title,
    slug: data.slug,
    order: 0,
  });
  revalidatePath("/admin/lessons");
  revalidatePath("/admin/topics");
  return { success: true };
}

export async function saveLessonContent(subtopicId: number, content: string) {
  await db.update(schema.subtopics).set({ content }).where(eq(schema.subtopics.id, subtopicId));
  revalidatePath("/admin/lessons");
  // We would also revalidate the specific lesson path, but it's dynamic
  return { success: true };
}

export async function saveFlashcards(subtopicId: number, flashcards: any[]) {
  await db.update(schema.subtopics).set({ flashcards }).where(eq(schema.subtopics.id, subtopicId));
  return { success: true };
}

export async function deleteSubtopic(subtopicId: number) {
  await db.delete(schema.subtopics).where(eq(schema.subtopics.id, subtopicId));
  revalidatePath("/admin/lessons");
  return { success: true };
}

// --- QUIZZES ---
export async function createQuiz(data: { title: string, description: string, subtopicId?: number, termId?: number }) {
  await db.insert(schema.quizzes).values({
    title: data.title,
    description: data.description,
    subtopicId: data.subtopicId,
    termId: data.termId,
  });
  revalidatePath("/admin/quizzes");
  return { success: true };
}

export async function saveQuiz(quizId: number, title: string, description: string, questions: any[]) {
  await db.update(schema.quizzes).set({ title, description }).where(eq(schema.quizzes.id, quizId));
  
  // Re-sync questions
  await db.delete(schema.quizQuestions).where(eq(schema.quizQuestions.quizId, quizId));
  for (const q of questions) {
    await db.insert(schema.quizQuestions).values({
      quizId: quizId,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || ""
    });
  }
  revalidatePath("/admin/quizzes");
  return { success: true };
}

export async function deleteQuiz(quizId: number) {
  await db.delete(schema.quizzes).where(eq(schema.quizzes.id, quizId));
  revalidatePath("/admin/quizzes");
  return { success: true };
}
