"use server";

import { db } from "@/db";
import { bookmarks, subtopics, topics, terms, subjects } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export async function getBookmarks() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return [];

  const userId = data.user.id;

  const results = await db
    .select({
      id: bookmarks.id,
      subtopicId: bookmarks.subtopicId,
      dateSaved: bookmarks.createdAt,
      title: subtopics.title,
      subjectName: subjects.name,
      color: subjects.color,
      topicId: topics.id,
      subjectId: subjects.id
    })
    .from(bookmarks)
    .innerJoin(subtopics, eq(bookmarks.subtopicId, subtopics.id))
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .innerJoin(subjects, eq(terms.subjectId, subjects.id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt));

  return results;
}

export async function toggleBookmark(subtopicId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { success: false };

  const userId = data.user.id;

  const existing = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.subtopicId, subtopicId)));

  if (existing.length > 0) {
    await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id));
    return { success: true, bookmarked: false };
  } else {
    await db.insert(bookmarks).values({
      userId,
      subtopicId
    });
    return { success: true, bookmarked: true };
  }
}
