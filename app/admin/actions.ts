"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Helper to enforce authorization and determine role
async function getAdminOrModerator() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const [profile] = await db.select({ role: schema.userProfiles.role }).from(schema.userProfiles).where(eq(schema.userProfiles.id, user.id));
  if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
    throw new Error("Unauthorized: Insufficient permissions");
  }
  
  return { userId: user.id, role: profile.role };
}

// --- SUBJECTS ---
export async function deleteSubject(subjectId: string) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") throw new Error("Moderators cannot delete subjects");
  
  await db.delete(schema.subjects).where(eq(schema.subjects.id, subjectId));
  revalidatePath("/admin/subjects");
  revalidatePath("/subjects");
  return { success: true };
}

export async function createSubject(data: { id: string, name: string, categoryId: number, levelName: string, className: string, description: string, icon: string, color: string }) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") {
    await db.insert(schema.contentRevisions).values({
      authorId: user.userId,
      entityType: "subject",
      entityId: null,
      proposedPayload: data,
    });
    return { success: true, pending: true };
  }

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
  const user = await getAdminOrModerator();
  if (user.role === "moderator") {
    await db.insert(schema.contentRevisions).values({ authorId: user.userId, entityType: "topic", entityId: null, proposedPayload: data });
    return { success: true, pending: true };
  }

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
  const user = await getAdminOrModerator();
  if (user.role === "moderator") throw new Error("Moderators cannot delete topics");

  await db.delete(schema.topics).where(eq(schema.topics.id, topicId));
  revalidatePath("/admin/topics");
  return { success: true };
}

// --- SUBTOPICS / LESSONS ---
export async function createSubtopic(data: { topicId: number, title: string, slug: string }) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") {
    await db.insert(schema.contentRevisions).values({ authorId: user.userId, entityType: "subtopic", entityId: null, proposedPayload: data });
    return { success: true, pending: true };
  }

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
  const user = await getAdminOrModerator();
  if (user.role === "moderator") {
    await db.insert(schema.contentRevisions).values({ authorId: user.userId, entityType: "subtopic_content", entityId: String(subtopicId), proposedPayload: { content } });
    return { success: true, pending: true };
  }

  await db.update(schema.subtopics).set({ content }).where(eq(schema.subtopics.id, subtopicId));
  revalidatePath("/admin/lessons");
  return { success: true };
}

export async function saveFlashcards(subtopicId: number, flashcards: any[]) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") {
    await db.insert(schema.contentRevisions).values({ authorId: user.userId, entityType: "subtopic_flashcards", entityId: String(subtopicId), proposedPayload: { flashcards } });
    return { success: true, pending: true };
  }

  await db.update(schema.subtopics).set({ flashcards }).where(eq(schema.subtopics.id, subtopicId));
  return { success: true };
}

export async function deleteSubtopic(subtopicId: number) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") throw new Error("Moderators cannot delete lessons");

  await db.delete(schema.subtopics).where(eq(schema.subtopics.id, subtopicId));
  revalidatePath("/admin/lessons");
  return { success: true };
}

// --- QUIZZES ---
export async function createQuiz(data: { title: string, description: string, subtopicId?: number, topicId?: number, termId?: number, assessmentType: string }) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") {
    await db.insert(schema.contentRevisions).values({ authorId: user.userId, entityType: "quiz", entityId: null, proposedPayload: data });
    return { success: true, pending: true };
  }

  await db.insert(schema.quizzes).values({
    title: data.title,
    description: data.description,
    subtopicId: data.subtopicId,
    topicId: data.topicId,
    termId: data.termId,
    assessmentType: data.assessmentType,
  });
  revalidatePath("/admin/quizzes");
  return { success: true };
}

export async function saveQuiz(quizId: number, title: string, description: string, questions: any[]) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") {
    await db.insert(schema.contentRevisions).values({ authorId: user.userId, entityType: "quiz_edit", entityId: String(quizId), proposedPayload: { title, description, questions } });
    return { success: true, pending: true };
  }

  await db.update(schema.quizzes).set({ title, description }).where(eq(schema.quizzes.id, quizId));
  
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
  const user = await getAdminOrModerator();
  if (user.role === "moderator") throw new Error("Moderators cannot delete quizzes");

  await db.delete(schema.quizzes).where(eq(schema.quizzes.id, quizId));
  revalidatePath("/admin/quizzes");
  return { success: true };
}

// --- MEDIA ---
export async function saveMediaMetadata(data: { id: string, userId: string, filename: string, fileType: string, sizeBytes: number, url: string }) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") {
    await db.insert(schema.contentRevisions).values({ authorId: user.userId, entityType: "media", entityId: null, proposedPayload: data });
    return { success: true, pending: true };
  }

  await db.insert(schema.mediaAssets).values(data);
  revalidatePath("/admin/media");
  return { success: true };
}

export async function deleteMediaAsset(id: string) {
  const user = await getAdminOrModerator();
  if (user.role === "moderator") throw new Error("Moderators cannot delete media");

  await db.delete(schema.mediaAssets).where(eq(schema.mediaAssets.id, id));
  revalidatePath("/admin/media");
  return { success: true };
}

// --- REVISIONS (ADMIN ONLY) ---
export async function approveRevision(revisionId: number) {
  const user = await getAdminOrModerator();
  if (user.role !== "admin") throw new Error("Only admins can approve revisions");

  const [revision] = await db.select().from(schema.contentRevisions).where(eq(schema.contentRevisions.id, revisionId));
  if (!revision) throw new Error("Revision not found");
  if (revision.status !== "pending") throw new Error("Revision is not pending");

  const payload = revision.proposedPayload as any;

  // Apply the payload based on entityType
  if (revision.entityType === "subject") {
    await db.insert(schema.subjects).values({ ...payload, slug: payload.id, country: "International", curriculum: "General" });
  } else if (revision.entityType === "topic") {
    await db.insert(schema.topics).values({ termId: payload.termId, title: payload.title, slug: payload.slug, order: 0 });
  } else if (revision.entityType === "subtopic") {
    await db.insert(schema.subtopics).values({ topicId: payload.topicId, title: payload.title, slug: payload.slug, order: 0 });
  } else if (revision.entityType === "subtopic_content") {
    await db.update(schema.subtopics).set({ content: payload.content }).where(eq(schema.subtopics.id, parseInt(revision.entityId!)));
  } else if (revision.entityType === "subtopic_flashcards") {
    await db.update(schema.subtopics).set({ flashcards: payload.flashcards }).where(eq(schema.subtopics.id, parseInt(revision.entityId!)));
  } else if (revision.entityType === "quiz") {
    await db.insert(schema.quizzes).values({ title: payload.title, description: payload.description, subtopicId: payload.subtopicId, termId: payload.termId });
  } else if (revision.entityType === "quiz_edit") {
    const quizId = parseInt(revision.entityId!);
    await db.update(schema.quizzes).set({ title: payload.title, description: payload.description }).where(eq(schema.quizzes.id, quizId));
    await db.delete(schema.quizQuestions).where(eq(schema.quizQuestions.quizId, quizId));
    for (const q of payload.questions) {
      await db.insert(schema.quizQuestions).values({ quizId, questionText: q.questionText, options: q.options, correctAnswer: q.correctAnswer, explanation: q.explanation || "" });
    }
  } else if (revision.entityType === "media") {
    await db.insert(schema.mediaAssets).values(payload);
  } else {
    throw new Error("Unknown entityType: " + revision.entityType);
  }

  await db.update(schema.contentRevisions).set({ status: "approved", reviewedAt: new Date(), reviewedBy: user.userId }).where(eq(schema.contentRevisions.id, revisionId));
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function rejectRevision(revisionId: number) {
  const user = await getAdminOrModerator();
  if (user.role !== "admin") throw new Error("Only admins can reject revisions");

  await db.update(schema.contentRevisions).set({ status: "rejected", reviewedAt: new Date(), reviewedBy: user.userId }).where(eq(schema.contentRevisions.id, revisionId));
  revalidatePath("/admin/reviews");
  return { success: true };
}
