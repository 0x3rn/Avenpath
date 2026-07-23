import { notFound } from "next/navigation";
import { getSubject, getTopic, getSubtopicWithContent, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import LessonView from "./LessonView";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";


export default async function LessonPage({ params }: { params: Promise<{ region: string, level: string, subject: string, topic: string, lesson: string }> }) {
  const { region, level, subject: subjectSlug, topic: topicSlug, lesson: lessonSlug } = await params;

  // Fetch the data
  const subject = await getSubject(level, subjectSlug);
  const topic = await getTopic(level, subjectSlug, topicSlug);
  const lesson = await getSubtopicWithContent(lessonSlug);

  if (!subject || !topic || !lesson) {
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

  return <LessonView 
    region={region}
    level={level} 
    subject={subject} 
    topic={topic} 
    lesson={lesson} 
    completedSlugs={completedSlugs}
  />;
}
