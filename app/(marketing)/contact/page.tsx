"use client";

import { useState } from "react";
import { MessageSquare, ShieldAlert, Briefcase, Megaphone, Send, CheckCircle2, Paperclip } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-500 pb-24">
      
      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Contact Us</h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium">
          We'd love to hear from you. Whether you have a question, feedback, or a partnership idea, our team is here to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        
        {/* CONTACT METHODS */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-xl mb-6">How can we help?</h3>
          {[
            { title: "General Support", desc: "Questions about your account or learning paths.", icon: MessageSquare, color: "text-blue-500" },
            { title: "Technical Issues", desc: "Report bugs, errors, or platform outages.", icon: ShieldAlert, color: "text-red-500" },
            { title: "Business & Partnerships", desc: "Collaborate with Avenpath for education.", icon: Briefcase, color: "text-purple-500" },
            { title: "Media Inquiries", desc: "Press kits, interviews, and media resources.", icon: Megaphone, color: "text-orange-500" },
          ].map((method, i) => (
            <div key={i} className="bg-card border border-border p-6 rounded-2xl flex items-start gap-4 group cursor-pointer hover:border-foreground/30 transition-colors">
              <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${method.color}`}>
                <method.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base mb-1 group-hover:text-foreground transition-colors">{method.title}</h4>
                <p className="text-sm font-medium text-muted-foreground">{method.desc}</p>
              </div>
            </div>
          ))}

          {/* System Status */}
          <div className="bg-card border border-border p-6 rounded-2xl mt-8">
            <h4 className="font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Platform Status</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-green-500">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" /> Operational
              </div>
              <span className="text-sm font-bold text-muted-foreground">99.98% Uptime</span>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
            
            {submitted ? (
              <div className="text-center py-12 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4">Thanks for reaching out!</h3>
                <p className="text-muted-foreground font-medium mb-8 max-w-md mx-auto">
                  We've received your message and will get back to you as soon as possible. Usually within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-muted text-foreground px-6 py-3 rounded-xl font-bold hover:bg-muted/80 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-6 animate-in fade-in duration-500"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Your Name</label>
                    <input required type="text" placeholder="Jane Doe" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:border-foreground/30 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Email Address</label>
                    <input required type="email" placeholder="jane@example.com" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:border-foreground/30 outline-none transition-colors" />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">How can we help?</label>
                  <select required className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:border-foreground/30 outline-none transition-colors appearance-none cursor-pointer">
                    <option value="" disabled selected>Select a category...</option>
                    <option>General Support</option>
                    <option>Technical Issue</option>
                    <option>Partnership Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Subject</label>
                  <input required type="text" placeholder="Brief summary of your inquiry" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:border-foreground/30 outline-none transition-colors" />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Message</label>
                  <textarea required placeholder="Please provide as much detail as possible..." className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm min-h-[150px] resize-none focus:border-foreground/30 outline-none transition-colors" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                  <button type="button" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Paperclip className="w-4 h-4" /> Add Attachment
                  </button>
                  <button type="submit" className="w-full sm:w-auto bg-foreground text-background px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
                    Send Message <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
