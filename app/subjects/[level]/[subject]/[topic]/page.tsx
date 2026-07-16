import { notFound } from "next/navigation";
import { getSubject, getTopic, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import TopicView from "./TopicView";

export async function generateStaticParams() {
  const levels = await getLevels();
  const params: { level: string, subject: string, topic: string }[] = [];
  
  for (const level of levels) {
    const subjects = await getSubjectsByLevel(level);
    for (const subject of subjects) {
      for (const topic of subject.topics) {
        params.push({ 
          level, 
          subject: subject.slug,
          topic: topic.slug
        });
      }
    }
  }
  
  return params;
}

export default async function TopicPage({ params }: { params: Promise<{ level: string, subject: string, topic: string }> }) {
  const { level, subject: subjectSlug, topic: topicSlug } = await params;

  // Fetch the subject and topic
  const subject = await getSubject(level, subjectSlug);
  const topic = await getTopic(level, subjectSlug, topicSlug);

  if (!subject || !topic) {
    notFound();
  }

  return <TopicView level={level} subject={subject} topic={topic} />;
}
