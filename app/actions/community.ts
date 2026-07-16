"use server";

import { db } from "@/db";
import { discussions, discussionPosts, userProfiles, subtopics, subjects, topics, terms } from "@/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDiscussions() {
  const results = await db
    .select({
      id: discussions.id,
      title: discussions.title,
      content: discussions.content,
      upvotes: discussions.upvotes,
      createdAt: discussions.createdAt,
      authorName: userProfiles.name,
      authorAvatar: userProfiles.avatarUrl,
      subjectName: subjects.name,
      subjectColor: subjects.color,
      replyCount: sql<number>`(SELECT count(*) FROM ${discussionPosts} WHERE ${discussionPosts.discussionId} = ${discussions.id})`
    })
    .from(discussions)
    .innerJoin(userProfiles, eq(discussions.userId, userProfiles.id))
    .leftJoin(subtopics, eq(discussions.subtopicId, subtopics.id))
    .leftJoin(topics, eq(subtopics.topicId, topics.id))
    .leftJoin(terms, eq(topics.termId, terms.id))
    .leftJoin(subjects, eq(terms.subjectId, subjects.id))
    .orderBy(desc(discussions.createdAt));

  return results;
}

export async function getDiscussionById(id: number) {
  const [discussion] = await db
    .select({
      id: discussions.id,
      title: discussions.title,
      content: discussions.content,
      upvotes: discussions.upvotes,
      createdAt: discussions.createdAt,
      authorName: userProfiles.name,
      authorAvatar: userProfiles.avatarUrl,
      subjectName: subjects.name,
      subjectColor: subjects.color,
    })
    .from(discussions)
    .innerJoin(userProfiles, eq(discussions.userId, userProfiles.id))
    .leftJoin(subtopics, eq(discussions.subtopicId, subtopics.id))
    .leftJoin(topics, eq(subtopics.topicId, topics.id))
    .leftJoin(terms, eq(topics.termId, terms.id))
    .leftJoin(subjects, eq(terms.subjectId, subjects.id))
    .where(eq(discussions.id, id));

  if (!discussion) return null;

  const posts = await db
    .select({
      id: discussionPosts.id,
      content: discussionPosts.content,
      upvotes: discussionPosts.upvotes,
      createdAt: discussionPosts.createdAt,
      authorName: userProfiles.name,
      authorAvatar: userProfiles.avatarUrl,
    })
    .from(discussionPosts)
    .innerJoin(userProfiles, eq(discussionPosts.userId, userProfiles.id))
    .where(eq(discussionPosts.discussionId, id))
    .orderBy(discussionPosts.createdAt);

  return { discussion, posts };
}

export async function createDiscussion(title: string, content: string, subtopicId?: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { success: false, error: "Unauthorized" };

  const [newDiscussion] = await db.insert(discussions).values({
    userId: data.user.id,
    title,
    content,
    subtopicId: subtopicId || null,
  }).returning({ id: discussions.id });

  revalidatePath("/community/discussions");
  return { success: true, id: newDiscussion.id };
}

export async function createReply(discussionId: number, content: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { success: false, error: "Unauthorized" };

  await db.insert(discussionPosts).values({
    discussionId,
    userId: data.user.id,
    content,
  });

  revalidatePath(`/community/discussions/${discussionId}`);
  return { success: true };
}

export async function getTopContributors() {
  const contributors = await db
    .select({
      id: userProfiles.id,
      name: userProfiles.name,
      avatarUrl: userProfiles.avatarUrl,
      points: userProfiles.points,
    })
    .from(userProfiles)
    .orderBy(desc(userProfiles.points))
    .limit(5);

  return contributors;
}

export async function seedSampleDiscussions() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  const existing = await db.select().from(discussions).limit(1);
  if (existing.length > 0) return; // Already seeded

  const subs = await db.select().from(subtopics).limit(1);
  const subtopicId = subs.length > 0 ? subs[0].id : undefined;

  const [d1] = await db.insert(discussions).values({
    userId: data.user.id,
    title: "Why does the quadratic formula always work?",
    content: "I understand how to plug numbers into the formula, but I'm trying to understand the intuition behind it. Why does negative b plus or minus the square root of b squared minus 4ac over 2a always give the roots of a parabola?",
    subtopicId: subtopicId,
  }).returning({ id: discussions.id });

  await db.insert(discussionPosts).values({
    userId: data.user.id,
    discussionId: d1.id,
    content: "It comes from completing the square on the general equation ax^2 + bx + c = 0! Try dividing everything by a and isolating x, and you'll derive the exact formula yourself.",
  });
}
