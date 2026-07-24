export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Pencil } from "lucide-react";
import { getLevelsByRegion } from "@/lib/curriculum";
import { getUserProfile } from "@/app/actions/user";
import { notFound } from "next/navigation";

export default async function RegionLevelsPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const levels = await getLevelsByRegion(region);
  const profile = await getUserProfile();

  if (!levels || levels.length === 0) {
    notFound();
  }
  
  const formatLevelName = (levelSlug: string, levelName: string) => {
    if (levelSlug === 'nigeria-university') return 'University';
    if (levelSlug === 'primaryschool' || levelName === 'PrimarySchool') return 'Primary School';
    return levelName;
  };

  const getLevelIcon = (levelSlug: string) => {
    if (levelSlug.includes('primary')) return <Pencil className="w-12 h-12 mb-6 text-foreground" />;
    if (levelSlug.includes('highschool') || levelSlug.includes('secondary')) return <BookOpen className="w-12 h-12 mb-6 text-foreground" />;
    if (levelSlug.includes('university')) return <GraduationCap className="w-12 h-12 mb-6 text-foreground" />;
    return <BookOpen className="w-12 h-12 mb-6 text-foreground" />;
  };

  const getLevelDescription = (levelSlug: string) => {
    if (levelSlug.includes('primary')) return "Discover fun, interactive basics in math, language, and the world around us.";
    if (levelSlug.includes('highschool') || levelSlug.includes('secondary')) return "Build a strong foundation with structured paths across core subjects.";
    if (levelSlug.includes('university')) return "Dive deep into advanced concepts, professional studies, and specialized fields.";
    return "Explore subjects and structured learning paths.";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar */}
      {!profile ? (
        <nav className="sticky top-0 flex items-center justify-between px-8 py-6 w-full z-40 bg-background border-b border-border">
          <Link href="/" className="flex items-center gap-2"><img src="/logo.png" alt="Avenpath Logo" className="h-16 w-auto" /></Link>
        </nav>
      ) : (
        <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground px-8 py-6 w-full">
          <Link href="/subjects" className="hover:text-foreground transition-colors">Curriculum</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-foreground capitalize">{region.split('-').map(w => w === 'education' && region === 'nigerian-education' ? '' : w).join(' ').trim()}</span>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-center pt-12 pb-24 px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 capitalize">
            {region.split('-').map(w => w === 'education' && region === 'nigerian-education' ? 'Curriculum' : w).join(' ').trim()}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Select an education level to explore tailored subjects, structured learning paths, and interactive lessons.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full ">
          {levels.map(level => (
            <Link key={level.id} href={`/subjects/${region}/${level.slug}`}>
              <div className="group bg-card border border-border hover:border-foreground/20 rounded-3xl p-10 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden h-full flex flex-col cursor-pointer">
                
                {/* Accent Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  {getLevelIcon(level.slug)}
                  <h2 className="text-3xl font-extrabold mb-4">{formatLevelName(level.slug, level.name)}</h2>
                  <p className="text-muted-foreground text-[17px] font-medium leading-relaxed flex-grow">
                    {getLevelDescription(level.slug)}
                  </p>
                  
                  <div className="mt-10 flex items-center gap-2 font-bold text-foreground group-hover:gap-4 transition-all duration-300">
                    Explore {level.slug.includes('university') ? 'Courses' : 'Subjects'} <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
