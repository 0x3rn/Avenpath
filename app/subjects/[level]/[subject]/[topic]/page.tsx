import { notFound } from "next/navigation";
import { getSubject, getTopic, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import TopicView from "./TopicView";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";


export default async function TopicPage({ params }: { params: Promise<{ level: string, subject: string, topic: string }> }) {
  const { level, subject: subjectSlug, topic: topicSlug } = await params;

  // Fetch the subject and topic
  const subject = await getSubject(level, subjectSlug);
  const topic = await getTopic(level, subjectSlug, topicSlug);

  if (!subject || !topic) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let completedSlugs: string[] = [];
  if (user && topic.subtopics.length > 0) {
    const progress = await db
      .select({ subtopicId: userProgress.subtopicId })
      .from(userProgress)
      .where(eq(userProgress.userId, user.id));
      
    const completedIds = new Set(progress.map(p => p.subtopicId));
    completedSlugs = topic.subtopics
      .filter(s => completedIds.has(Number(s.id)))
      .map(s => s.slug);
  }

  return <TopicView level={level} subject={subject} topic={topic} completedSlugs={completedSlugs} />;
}
