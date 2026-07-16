import { notFound } from "next/navigation";
import { getSubjectsByLevel, getCategories, getLevels } from "@/lib/curriculum";
import SubjectExplorer from "./SubjectExplorer";

// Generate static params so the route is statically rendered
export function generateStaticParams() {
  const levels = getLevels();
  return levels.map(level => ({
    level: level
  }));
}

export default async function LevelSubjectsPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  
  // Validate level
  const levels = getLevels();
  if (!levels.includes(level)) {
    notFound();
  }

  // Fetch data on the server
  const subjects = getSubjectsByLevel(level);
  const categories = getCategories(level);

  return (
    <SubjectExplorer 
      level={level} 
      initialSubjects={subjects} 
      categories={categories} 
    />
  );
}
