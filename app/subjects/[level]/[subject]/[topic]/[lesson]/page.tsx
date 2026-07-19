import { notFound } from "next/navigation";
import { getSubject, getTopic, getSubtopicWithContent, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import LessonView from "./LessonView";



export default async function LessonPage({ params }: { params: Promise<{ level: string, subject: string, topic: string, lesson: string }> }) {
  const { level, subject: subjectSlug, topic: topicSlug, lesson: lessonSlug } = await params;

  // Fetch the data
  const subject = await getSubject(level, subjectSlug);
  const topic = await getTopic(level, subjectSlug, topicSlug);
  const lesson = await getSubtopicWithContent(lessonSlug);

  if (!subject || !topic || !lesson) {
    notFound();
  }

  return <LessonView level={level} subject={subject} topic={topic} lesson={lesson} />;
}
