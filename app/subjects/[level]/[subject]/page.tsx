import { notFound } from "next/navigation";
import { getSubject, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import SubjectView from "./SubjectView";

export function generateStaticParams() {
  const levels = getLevels();
  const params: { level: string, subject: string }[] = [];
  
  for (const level of levels) {
    const subjects = getSubjectsByLevel(level);
    for (const subject of subjects) {
      params.push({ level, subject: subject.slug });
    }
  }
  
  return params;
}

export default async function SubjectPage({ params }: { params: Promise<{ level: string, subject: string }> }) {
  const { level, subject: subjectSlug } = await params;

  // Fetch the subject
  const subject = getSubject(level, subjectSlug);

  if (!subject) {
    notFound();
  }

  return <SubjectView level={level} subject={subject} />;
}
