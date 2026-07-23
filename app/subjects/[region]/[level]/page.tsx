export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getSubjectsByLevel, getCategories, getLevels, getPublicUniversityTree } from "@/lib/curriculum";
import { getUserProfile } from "@/app/actions/user";
import SubjectExplorer from "./SubjectExplorer";
import UniversityExplorer from "./UniversityExplorer";



export default async function LevelSubjectsPage({ params }: { params: Promise<{ region: string, level: string }> }) {
  const { region, level } = await params;
  
  // Validate level
  const levels = await getLevels();
  if (!levels.includes(level)) {
    notFound();
  }

  // Fetch data on the server
  let subjects = await getSubjectsByLevel(level);
  let categories = await getCategories(level);

  // Filter out Nigeria subjects and categories if region is not nigerian-education
  if (region !== 'nigerian-education') {
    subjects = subjects.filter(s => s.category !== 'nigeria');
    categories = categories.filter(c => c !== 'nigeria');
  }

  const profile = await getUserProfile();

  if (level === 'nigeria-university') {
    const universityTree = await getPublicUniversityTree();
    return <UniversityExplorer region={region} level={level} tree={universityTree} isLoggedIn={!!profile} />;
  }

  return (
    <SubjectExplorer 
      region={region}
      level={level} 
      initialSubjects={subjects} 
      categories={categories} 
      isLoggedIn={!!profile}
    />
  );
}
