"use client";

import Link from "next/link";
import { Search, BookOpen, Settings, PlayCircle, HelpCircle, Users, Award, ShieldAlert, ArrowRight, MessageSquare, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Can I use Avenpath for free?", a: "Yes. Avenpath offers a free learning experience with optional premium features planned for the future." },
    { q: "Can I switch from High School to University?", a: "Yes. You can switch your education level at any time in your Account Settings." },
    { q: "How is my progress calculated?", a: "Progress is calculated based on the number of lessons you have completed out of the total available lessons in a given subject or topic." },
    { q: "Can I download lessons?", a: "Currently, lessons require an internet connection to view. However, you can export your notes and downloaded certificates." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-500">
      
      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Help Center</h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium mb-8">
          Find answers, learn how Avenpath works, and get help whenever you need it.
        </p>
        <div className="relative max-w-2xl mx-auto">
          <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search for help..."
            className="w-full pl-14 pr-6 py-5 bg-card border border-border shadow-sm rounded-2xl font-bold outline-none focus:border-foreground/30 transition-colors text-lg"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-12">
        
        {/* MAIN CONTENT */}
        <div className="space-y-16">
          
          {/* Categories */}
          <section>
            <h2 className="text-2xl font-extrabold tracking-tight mb-6">Popular Categories</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Getting Started", icon: PlayCircle, href: "/help/getting-started", color: "text-blue-500" },
                { name: "Account", icon: Settings, href: "/help/account", color: "text-purple-500" },
                { name: "Learning", icon: BookOpen, href: "/help/learning", color: "text-green-500" },
                { name: "Quizzes", icon: HelpCircle, href: "/help/quizzes", color: "text-orange-500" },
                { name: "Community", icon: Users, href: "/help/community", color: "text-pink-500" },
                { name: "Certificates", icon: Award, href: "/help/certificates", color: "text-yellow-500" },
              ].map((cat, i) => (
                <Link key={i} href={cat.href} className="bg-card border border-border p-6 rounded-2xl hover:border-foreground/30 transition-colors group flex flex-col items-center text-center">
                  <cat.icon className={`w-8 h-8 mb-4 ${cat.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-bold">{cat.name}</span>
                </Link>
              ))}
              <Link href="/help/troubleshooting" className="bg-card border border-border p-6 rounded-2xl hover:border-foreground/30 transition-colors group flex flex-col items-center text-center sm:col-span-2 md:col-span-3">
                <ShieldAlert className="w-8 h-8 mb-4 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Troubleshooting & Technical Issues</span>
              </Link>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section>
            <h2 className="text-2xl font-extrabold tracking-tight mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <button 
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="p-6 pt-0 font-medium text-muted-foreground border-t border-border/50 bg-muted/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          
          {/* Quick Links */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="font-extrabold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "Create an Account",
                "Reset Password",
                "Manage Subjects",
                "Study Planner",
                "Flashcards",
                "Achievements"
              ].map((link, i) => (
                <li key={i}>
                  <Link href="#" className="flex items-center justify-between text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
                    {link} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div className="bg-blue-500 text-white rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
            <MessageSquare className="w-8 h-8 mx-auto mb-4" />
            <h3 className="text-xl font-extrabold mb-2 relative z-10">Still Need Help?</h3>
            <p className="text-sm font-medium text-blue-100 mb-6 relative z-10">We're here to help. Reach out to our support team.</p>
            <Link href="/contact" className="block w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-lg relative z-10">
              Contact Support
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
