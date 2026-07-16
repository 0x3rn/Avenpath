"use client";

import Link from "next/link";
import { ChevronLeft, FileText, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HelpCategory() {
  const pathname = usePathname();
  const categorySlug = pathname.split('/').pop() || '';
  
  const categoryName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const articles = [
    { title: "How Learning Paths Work", desc: "Understand how to navigate structured courses and prerequisites." },
    { title: "Using Flashcards effectively", desc: "Learn how the spaced repetition algorithm works to maximize retention." },
    { title: "Completing Lessons", desc: "How to mark lessons as complete and track your progress." },
    { title: "Managing Bookmarks", desc: "Save important sections for quick review later." },
    { title: "The Quiz System", desc: "How assessments are graded and how to retake them." },
    { title: "Setting up your Study Planner", desc: "Organize your week with scheduled learning blocks." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-in fade-in duration-500">
      
      <Link href="/help" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft className="w-4 h-4" /> Back to Help Center
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{categoryName} Guides</h1>
        <p className="text-lg text-muted-foreground font-medium">
          Everything you need to know about {categoryName.toLowerCase()} on Avenpath.
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((art, i) => (
          <Link key={i} href="#" className="bg-card border border-border p-6 rounded-2xl hover:border-foreground/30 transition-colors flex items-center justify-between group">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-muted rounded-lg shrink-0 mt-1">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors mb-1">{art.title}</h3>
                <p className="text-sm font-medium text-muted-foreground">{art.desc}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 hidden sm:block" />
          </Link>
        ))}
      </div>

    </div>
  );
}
