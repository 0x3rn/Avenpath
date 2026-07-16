"use client";

import Link from "next/link";
import { Shield, FileText, Cookie, AlertTriangle, ArrowRight } from "lucide-react";

export default function LegalCenter() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-500 pb-24">
      
      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Legal Center</h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium">
          Transparency and trust are fundamental to Avenpath. Here you'll find the policies that govern how we protect your information, operate our platform, and foster a safe learning community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {[
          { title: "Privacy Policy", desc: "Learn how your data is collected, used, and protected.", icon: Shield, href: "/legal/privacy", color: "text-blue-500" },
          { title: "Terms of Service", desc: "Understand the rules and responsibilities of using Avenpath.", icon: FileText, href: "/legal/terms", color: "text-purple-500" },
          { title: "Cookie Policy", desc: "See how cookies help improve your experience.", icon: Cookie, href: "/legal/cookies", color: "text-orange-500" },
          { title: "Acceptable Use Policy", desc: "Learn what keeps our learning community safe and respectful.", icon: AlertTriangle, href: "/legal/acceptable-use", color: "text-red-500" },
        ].map((policy, i) => (
          <Link key={i} href={policy.href} className="bg-card border border-border p-8 rounded-3xl group hover:border-foreground/30 transition-colors flex flex-col items-start text-left">
            <div className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${policy.color}`}>
              <policy.icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold mb-3 group-hover:text-foreground transition-colors">{policy.title}</h2>
            <p className="text-muted-foreground font-medium mb-8 flex-1">{policy.desc}</p>
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              Read Policy <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
