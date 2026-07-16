"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSuccess(true);
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <MailCheck className="w-10 h-10 text-foreground" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">Check your inbox.</h1>
        <p className="text-muted-foreground font-medium mb-8">
          We've emailed instructions for resetting your password to <span className="text-foreground font-bold">{email}</span>.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="w-full bg-muted text-foreground font-bold py-3.5 rounded-xl transition-colors hover:bg-muted/80"
        >
          Try a different email
        </button>
        <div className="mt-8">
          <Link href="/login" className="text-muted-foreground font-bold hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Forgot your password?</h1>
        <p className="text-muted-foreground font-medium">Enter your email address and we'll send you a password reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-foreground">Email</label>
          <input 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all"
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          disabled={!email.trim() || isLoading}
          className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Sending Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>

      </form>

      {/* Footer */}
      <div className="mt-12 text-center">
        <Link href="/login" className="text-muted-foreground font-bold hover:text-foreground inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>

    </div>
  );
}
