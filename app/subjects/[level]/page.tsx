import { notFound } from "next/navigation";
import { getSubjectsByLevel, getCategories, getLevels } from "@/lib/curriculum";
import { getUserProfile } from "@/app/actions/user";
import SubjectExplorer from "./SubjectExplorer";

// Generate static params so the route is statically rendered
export async function generateStaticParams() {
  const levels = await getLevels();
  return levels.map(level => ({
    level: level
  }));
}

export default async function LevelSubjectsPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  
  // Validate level
  const levels = await getLevels();
  if (!levels.includes(level)) {
    notFound();
  }

  // Fetch data on the server
  const subjects = await getSubjectsByLevel(level);
  const categories = await getCategories(level);
  const profile = await getUserProfile();

  return (
    <SubjectExplorer 
      level={level} 
      initialSubjects={subjects} 
      categories={categories} 
      isLoggedIn={!!profile}
    />
  );
}
