export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getSubjectsGroup, getSubjectsByLevel, getLevels } from "@/lib/curriculum";
import { getUserProfile } from "@/app/actions/user";
import SubjectView from "./SubjectView";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import * as schema from "@/db/schema";

export default async function SubjectPage({ params }: { params: Promise<{ region: string, level: string, subject: string }> }) {
  const { region, level, subject: subjectSlug } = await params;

  // Fetch the subjects group
  const subjectsGroup = await getSubjectsGroup(level, subjectSlug);
  const profile = await getUserProfile();

  if (!subjectsGroup || subjectsGroup.length === 0) {
    notFound();
  }

  // Check if subject is saved
  let isSaved = false;
  if (profile) {
    const mainSubject = subjectsGroup[0]; // Assuming all share same core slug or we just use the first one
    const saved = await db.query.userSubjects.findFirst({
      where: (us, { eq, and }) => and(eq(us.userId, profile.id), eq(us.subjectId, mainSubject.slug))
    });
    isSaved = !!saved;
  }

  return <SubjectView region={region} level={level} subjects={subjectsGroup} isLoggedIn={!!profile} isSaved={isSaved} />;
}
