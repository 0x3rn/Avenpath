"use client";

import Link from "next/link";
import { Search, LogIn, Menu, X, ArrowRight, Code, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-subject-math/20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight">Avenpath.</Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/blog" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <Link href="/help" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Help Center</Link>
            <Link href="/contact" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <Link href="/login" className="flex items-center gap-2 text-sm font-bold bg-muted px-4 py-2 rounded-lg hover:bg-foreground hover:text-background transition-colors">
              <LogIn className="w-4 h-4" /> Login
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background border-t border-border p-6 md:hidden">
          <nav className="flex flex-col gap-6">
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold">Blog</Link>
            <Link href="/help" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold">Help Center</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold">Contact</Link>
            <hr className="border-border" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold flex items-center gap-2"><LogIn className="w-5 h-5" /> Login</Link>
          </nav>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="text-xl font-extrabold tracking-tight mb-4 inline-block">Avenpath.</Link>
              <p className="text-sm font-medium text-muted-foreground mb-6">
                The open educational platform designed to help university and high school students study smarter.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><MessageCircle className="w-5 h-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Code className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-extrabold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/help" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/quizzes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Quizzes</Link></li>
                <li><Link href="/flashcards" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Flashcards</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/legal" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Legal Center</Link></li>
                <li><Link href="/legal/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-medium text-muted-foreground">© {new Date().getFullYear()} Avenpath. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/legal/cookies" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
              <Link href="/legal/acceptable-use" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Acceptable Use</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
