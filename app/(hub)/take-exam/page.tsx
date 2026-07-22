import { db } from "@/db";
import { subtopics, topics, terms, subjects } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import TakeExamClient from "./TakeExamClient";

export default async function TakeExamPage() {
  const availableLessons = await db
    .select({
      id: subtopics.id,
      title: subtopics.title,
      slug: subtopics.slug,
      content: subtopics.content,
      topicTitle: topics.title,
      subjectName: subjects.name,
    })
    .from(subtopics)
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .innerJoin(subjects, eq(terms.subjectId, subjects.id))
    .where(ne(subtopics.content, ""))
    .limit(50);

  const cleanLessons = availableLessons
    .filter(l => l.content && l.content.trim().length > 50)
    .map(l => ({
      ...l,
      content: l.content as string
    }));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      <TakeExamClient lessons={cleanLessons} />
    </div>
  );
}
