import { notFound } from "next/navigation";
import { getSubjectsGroup, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import { getUserProfile } from "@/app/actions/user";
import SubjectView from "./SubjectView";



export default async function SubjectPage({ params }: { params: Promise<{ level: string, subject: string }> }) {
  const { level, subject: subjectSlug } = await params;

  // Fetch the subjects group
  const subjectsGroup = await getSubjectsGroup(level, subjectSlug);
  const profile = await getUserProfile();

  if (!subjectsGroup || subjectsGroup.length === 0) {
    notFound();
  }

  return <SubjectView level={level} subjects={subjectsGroup} isLoggedIn={!!profile} />;
}
