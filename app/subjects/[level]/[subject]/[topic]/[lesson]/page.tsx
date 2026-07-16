import { notFound } from "next/navigation";
import { getSubject, getTopic, getSubtopic, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import LessonView from "./LessonView";

export function generateStaticParams() {
  const levels = getLevels();
  const params: { level: string, subject: string, topic: string, lesson: string }[] = [];
  
  for (const level of levels) {
    const subjects = getSubjectsByLevel(level);
    for (const subject of subjects) {
      for (const topic of subject.topics) {
        for (const subtopic of topic.subtopics) {
          params.push({ 
            level, 
            subject: subject.slug,
            topic: topic.slug,
            lesson: subtopic.slug
          });
        }
      }
    }
  }
  
  return params;
}

export default async function LessonPage({ params }: { params: Promise<{ level: string, subject: string, topic: string, lesson: string }> }) {
  const { level, subject: subjectSlug, topic: topicSlug, lesson: lessonSlug } = await params;

  // Fetch the data
  const subject = getSubject(level, subjectSlug);
  const topic = getTopic(level, subjectSlug, topicSlug);
  const lesson = getSubtopic(level, subjectSlug, topicSlug, lessonSlug);

  if (!subject || !topic || !lesson) {
    notFound();
  }

  return <LessonView level={level} subject={subject} topic={topic} lesson={lesson} />;
}
