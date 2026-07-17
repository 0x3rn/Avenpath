"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Library, PlayCircle, TrendingUp, Bookmark, 
  FileQuestion, Layers, Calendar, User, Settings, 
  Bell, Search, Flame, Menu, X, BookOpen, MessageSquare, Users, Trophy, Compass, Award
} from "lucide-react";
import { getUserProfile } from "@/app/actions/user";

const PRIMARY_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Recommendations", href: "/recommendations", icon: BookOpen },
  { name: "My Subjects", href: "/dashboard/subjects", icon: Library },
  { name: "Continue Learning", href: "/dashboard/continue", icon: PlayCircle },
  { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
];

const SECONDARY_LINKS = [
  { name: "Quizzes", href: "/quizzes", icon: FileQuestion },
  { name: "Flashcards", href: "/flashcards", icon: Layers },
  { name: "Study Planner", href: "/planner", icon: Calendar },
  { name: "Achievements", href: "/achievements", icon: Award },
];

const COMMUNITY_LINKS = [
  { name: "Discussions", href: "/community/discussions", icon: MessageSquare },
  { name: "Study Groups", href: "/community/groups", icon: Users },
  { name: "Leaderboards", href: "/community/leaderboards", icon: Trophy },
];

const SETTINGS_LINKS = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getUserProfile().then(p => {
      if (p) {
        if (p.onboardingCompleted === false) {
          router.push("/onboarding");
          return;
        }
        setProfile({ name: p.name, avatarUrl: p.avatarUrl, streak: p.streak });
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-[280px] bg-card border-r border-border fixed h-screen top-0 left-0 z-40 overflow-y-auto shrink-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight">Avenpath.</span>
          </Link>
        </div>

        <div className="px-4 py-2 flex-1 space-y-8">
          
          <nav className="space-y-1">
            {PRIMARY_LINKS.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[15px] transition-colors ${
                    isActive 
                      ? "bg-foreground text-background" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <link.icon className="w-5 h-5" /> {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="h-[1px] bg-border mx-4" />

          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-4 mt-2">Community</div>
            {COMMUNITY_LINKS.map(link => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    isActive 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <link.icon className="w-4 h-4" /> {link.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="h-[1px] bg-border mx-4 mt-4" />

          <nav className="space-y-1 mt-4">
            {SETTINGS_LINKS.map(link => (
              <Link 
                key={link.name} 
                href={link.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <link.icon className="w-4 h-4" /> {link.name}
              </Link>
            ))}
          </nav>
        </div>

      </aside>

      {/* --- MOBILE DRAWER --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="w-[280px] bg-card border-r border-border relative flex flex-col shadow-2xl h-full animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between">
              <span className="text-xl font-bold tracking-tight">Avenpath.</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-4 space-y-1 flex-1 overflow-y-auto pb-24">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2 mt-4">Menu</div>
              {[...PRIMARY_LINKS, ...SECONDARY_LINKS, ...COMMUNITY_LINKS, ...SETTINGS_LINKS].map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
                      isActive 
                        ? "bg-foreground text-background" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <link.icon className="w-5 h-5" /> {link.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
        
        {/* --- TOP NAV --- */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
          
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Search (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 bg-muted/50 border border-border px-4 py-2.5 rounded-full min-w-[300px] text-muted-foreground cursor-text hover:border-foreground/30 transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm font-semibold">Search anything...</span>
              <kbd className="ml-auto text-[10px] font-bold bg-background border border-border px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Search className="w-5 h-5 sm:hidden" />
            
            <div className="flex items-center gap-1.5 font-bold text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full text-sm">
              <Flame className="w-4 h-4 fill-orange-500" /> {profile?.streak || 0}
            </div>

            <button className="relative">
              <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
            </button>

            <Link href="/profile" className="flex items-center justify-center w-9 h-9 rounded-full bg-muted cursor-pointer overflow-hidden shadow-sm">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-foreground font-bold text-xs uppercase">
                  {profile?.name ? profile.name.substring(0, 2) : "ME"}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="flex-1 p-4 sm:p-8 pb-24 md:pb-8">
          {children}
        </main>

      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-card border-t border-border flex items-center justify-around px-2 py-3 z-30 pb-safe">
        {PRIMARY_LINKS.filter(link => link.name !== "Recommendations").map(link => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <link.icon className={`w-6 h-6 ${isActive ? "fill-foreground/10" : ""}`} />
              <span className="text-[10px] font-bold tracking-tight">{link.name}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
