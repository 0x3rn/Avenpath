import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { getLevels } from "@/lib/curriculum";

export default async function SubjectsDirectory() {
  const levels = await getLevels();
  
  // Custom format for presentation (e.g. "highschool" -> "High School")
  const formatLevelName = (level: string) => {
    if (level === 'highschool') return 'High School';
    if (level === 'university') return 'University';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const getLevelIcon = (level: string) => {
    if (level === 'highschool') return <BookOpen className="w-12 h-12 mb-6 text-foreground" />;
    if (level === 'university') return <GraduationCap className="w-12 h-12 mb-6 text-foreground" />;
    return <BookOpen className="w-12 h-12 mb-6 text-foreground" />;
  };

  const getLevelDescription = (level: string) => {
    if (level === 'highschool') return "Build a strong foundation with structured paths across core subjects.";
    if (level === 'university') return "Dive deep into advanced concepts, professional studies, and specialized fields.";
    return "Explore subjects and structured learning paths.";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar (simplified for this view, we can extract this to a layout later if needed) */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-50">
        <Link href="/" className="text-2xl font-bold tracking-tight">Avenpath.</Link>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center pt-12 pb-24 px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Choose your path
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Select an education level to explore tailored subjects, structured learning paths, and interactive lessons.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          {levels.map(level => (
            <Link key={level} href={`/subjects/${level}`}>
              <div className="group bg-card border border-border hover:border-foreground/20 rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full flex flex-col cursor-pointer">
                
                {/* Accent Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  {getLevelIcon(level)}
                  <h2 className="text-3xl font-extrabold mb-4">{formatLevelName(level)}</h2>
                  <p className="text-muted-foreground text-[17px] font-medium leading-relaxed flex-grow">
                    {getLevelDescription(level)}
                  </p>
                  
                  <div className="mt-10 flex items-center gap-2 font-bold text-foreground group-hover:gap-4 transition-all duration-300">
                    Explore Subjects <ArrowRight className="w-5 h-5" />
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
