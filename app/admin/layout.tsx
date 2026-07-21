"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, Layers, Edit3, HelpCircle, 
  Image as ImageIcon, Users, BarChart3, FileText, Settings, 
  Bell, Search, Menu, X, ShieldAlert, User, ShieldCheck, Home, CheckCircle2
} from "lucide-react";

const ADMIN_LINKS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, roles: ["admin", "moderator"] },
  { name: "Review Queue", href: "/admin/reviews", icon: CheckCircle2, roles: ["admin"] },
  { name: "Subjects", href: "/admin/subjects", icon: BookOpen, roles: ["admin", "moderator"] },
  { name: "Topics", href: "/admin/topics", icon: Layers, roles: ["admin", "moderator"] },
  { name: "Lessons", href: "/admin/lessons", icon: Edit3, roles: ["admin", "moderator"] },
  { name: "Quizzes", href: "/admin/quizzes", icon: HelpCircle, roles: ["admin", "moderator"] },
  { name: "Media", href: "/admin/media", icon: ImageIcon, roles: ["admin", "moderator"] },
  { name: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["admin"] },
];

const SYSTEM_LINKS = [
  { name: "Reports", href: "#", icon: FileText },
  { name: "Settings", href: "#", icon: Settings },
  { name: "Back to Dashboard", href: "/dashboard", icon: Home },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{name: string, role: string} | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('user_profiles').select('name, role').eq('id', user.id).single();
        if (data) setUserProfile(data);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 flex">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#0c0c0c] text-white fixed h-screen top-0 left-0 z-40 overflow-y-auto shrink-0 border-r border-white/10">
        <div className="p-6 flex items-center gap-3">
          <span className="font-extrabold tracking-tight text-xl">Admin Dashboard</span>
        </div>

        <nav className="px-4 space-y-1 flex-1">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-4 px-2 mt-2">Content</div>
          {ADMIN_LINKS.filter(link => !userProfile || link.roles.includes(userProfile.role)).map(link => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <link.icon className={`w-4 h-4 ${isActive ? "text-blue-400" : ""}`} /> {link.name}
              </Link>
            );
          })}

          <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-4 px-2 mt-8">System</div>
          {userProfile?.role === "admin" && SYSTEM_LINKS.map(link => (
            <Link 
              key={link.name}  
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              <link.icon className="w-4 h-4" /> {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-white/80">All Systems Operational</span>
            </div>
            <div className="text-[10px] font-medium text-white/40">Last check: 2 mins ago</div>
          </div>
        </div>
      </aside>

      {/* --- MOBILE DRAWER --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="w-[260px] bg-[#0c0c0c] text-white relative flex flex-col shadow-2xl h-full animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg">Admin Dashboard</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 bg-white/10 rounded-md">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <nav className="px-4 space-y-1 flex-1 overflow-y-auto pb-24">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-4 px-2 mt-2">Content</div>
              {ADMIN_LINKS.filter(link => !userProfile || link.roles.includes(userProfile.role)).map(link => {
                const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      isActive 
                        ? "bg-white/10 text-white" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? "text-blue-400" : ""}`} /> {link.name}
                  </Link>
                );
              })}

              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-4 px-2 mt-8">System</div>
              {userProfile?.role === "admin" && SYSTEM_LINKS.map(link => (
                <Link 
                  key={link.name}  
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <link.icon className="w-4 h-4" /> {link.name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen w-full min-w-0 max-w-[100vw] overflow-x-hidden">
        
        {/* --- TOP NAV --- */}
        <header className="h-16 bg-card border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
          
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 bg-muted/50 border border-border px-3 py-1.5 rounded-lg min-w-[250px] text-muted-foreground focus-within:border-foreground/30 transition-colors">
              <Search className="w-4 h-4" />
              <input type="text" placeholder="Search lessons, subjects, users..." className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground" />
              <div className="text-[10px] font-bold bg-card border border-border px-1.5 rounded text-muted-foreground">⌘K</div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
            </button>
            <div className="w-[1px] h-6 bg-border hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-foreground leading-none">{userProfile?.name || "Loading..."}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{userProfile?.role || "..."}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
          
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
        
      </div>

    </div>
  );
}
