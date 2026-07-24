export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowRight, Globe, MapPin } from "lucide-react";
import { getRegions } from "@/lib/curriculum";
import { getUserProfile } from "@/app/actions/user";

export default async function SubjectsDirectory() {
  const regions = await getRegions();
  const profile = await getUserProfile();
  
  const formatRegionName = (region: string) => {
    if (region === 'nigerian-education') return 'Nigerian Education';
    if (region === 'international') return 'International Curriculum';
    return region.charAt(0).toUpperCase() + region.slice(1);
  };

  const getRegionIcon = (region: string) => {
    if (region === 'nigerian-education') return <MapPin className="w-12 h-12 mb-6 text-foreground" />;
    if (region === 'international') return <Globe className="w-12 h-12 mb-6 text-foreground" />;
    return <Globe className="w-12 h-12 mb-6 text-foreground" />;
  };

  const getRegionDescription = (region: string) => {
    if (region === 'nigerian-education') return "Explore tailored subjects and curriculum aligned with the Nigerian educational standard.";
    if (region === 'international') return "Discover globally recognized curriculum paths from primary to university level.";
    return "Explore educational paths.";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar (Only for logged out users) */}
      {!profile && (
        <nav className="sticky top-0 flex items-center justify-between px-8 py-6 w-full z-40 bg-background border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Avenpath Logo" className="h-16 w-auto" />
          </Link>
        </nav>
      )}

      <main className="flex-grow flex flex-col items-center justify-center pt-12 pb-24 px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Choose your curriculum
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Select an educational region to explore tailored learning paths and subjects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          {regions.map(region => (
            <Link key={region} href={`/subjects/${region}`}>
              <div className="group bg-card border border-border hover:border-foreground/20 rounded-3xl p-10 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden h-full flex flex-col cursor-pointer">
                
                {/* Accent Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                  {getRegionIcon(region)}
                  <h2 className="text-3xl font-extrabold mb-4">{formatRegionName(region)}</h2>
                  <p className="text-muted-foreground text-[17px] font-medium leading-relaxed flex-grow">
                    {getRegionDescription(region)}
                  </p>
                  
                  <div className="mt-10 flex items-center gap-2 font-bold text-foreground group-hover:gap-4 transition-all duration-300">
                    Explore Region <ArrowRight className="w-5 h-5" />
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
