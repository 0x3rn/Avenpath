import { notFound } from "next/navigation";
import { getSubject, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import { getUserProfile } from "@/app/actions/user";
import SubjectView from "./SubjectView";

export async function generateStaticParams() {
  const levels = await getLevels();
  const params: { level: string, subject: string }[] = [];
  
  for (const level of levels) {
    const subjects = await getSubjectsByLevel(level);
    for (const subject of subjects) {
      params.push({ level, subject: subject.slug });
    }
  }
  
  return params;
}

export default async function SubjectPage({ params }: { params: Promise<{ level: string, subject: string }> }) {
  const { level, subject: subjectSlug } = await params;

  // Fetch the subject
  const subject = await getSubject(level, subjectSlug);
  const profile = await getUserProfile();

  if (!subject) {
    notFound();
  }

  return <SubjectView level={level} subject={subject} isLoggedIn={!!profile} />;
}
