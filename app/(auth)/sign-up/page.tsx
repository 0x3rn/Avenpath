"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { signup } from "@/app/actions/auth";

export default function SignUpPage() {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Password validation logic
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const isValid = 
    name.trim().length > 0 && 
    email.trim().length > 0 && 
    hasMinLength && 
    hasUppercase && 
    hasNumber && 
    hasSpecial && 
    passwordsMatch && 
    agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      // We are not using name yet in Supabase auth metadata, but we could!
      formData.append("name", name);
      
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-4">
          Create your account
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome to Avenpath</h1>
        <p className="text-muted-foreground font-medium">Start learning in less than a minute.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-foreground">Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all"
            required
          />
        </div>

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

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-foreground">Password</label>
          <input 
            type="password" 
            id="reg_password"
            name="reg_password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all"
            required
          />
          
          {/* Live Validation Indicators */}
          <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-muted/50 rounded-xl border border-border/50">
            <div className={`flex items-center gap-2 text-xs font-semibold ${hasMinLength ? 'text-green-600' : 'text-muted-foreground'}`}>
              <Check className="w-3.5 h-3.5" /> 8+ characters
            </div>
            <div className={`flex items-center gap-2 text-xs font-semibold ${hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
              <Check className="w-3.5 h-3.5" /> One uppercase
            </div>
            <div className={`flex items-center gap-2 text-xs font-semibold ${hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
              <Check className="w-3.5 h-3.5" /> One number
            </div>
            <div className={`flex items-center gap-2 text-xs font-semibold ${hasSpecial ? 'text-green-600' : 'text-muted-foreground'}`}>
              <Check className="w-3.5 h-3.5" /> One special
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-foreground">Confirm Password</label>
          <input 
            type="password" 
            id="reg_confirm_password"
            name="reg_confirm_password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${
              confirmPassword && !passwordsMatch ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-foreground'
            }`}
            required
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500 font-medium mt-1">Passwords do not match.</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <button 
            type="button"
            onClick={() => setAgreed(!agreed)}
            className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
              agreed ? 'bg-foreground border-foreground text-background' : 'bg-card border-border'
            }`}
          >
            {agreed && <Check className="w-3.5 h-3.5" />}
          </button>
          <span className="text-sm font-medium text-muted-foreground leading-snug">
            I agree to the <Link href="#" className="text-foreground hover:underline">Terms of Service</Link> and <Link href="#" className="text-foreground hover:underline">Privacy Policy</Link>.
          </span>
        </div>

        {/* Submit Button */}
        <button 
          disabled={!isValid || isLoading}
          className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Creating your account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="h-[1px] flex-1 bg-border"></div>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">OR</span>
        <div className="h-[1px] flex-1 bg-border"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center gap-3 bg-card border border-border py-3.5 rounded-xl font-bold hover:bg-muted transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center gap-3 bg-card border border-border py-3.5 rounded-xl font-bold hover:bg-muted transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 23 23">
            <path d="M11.4 24l-6.8-6.8c-.8-.8-1.2-1.8-1.2-2.9V7.5C3.4 5.6 5 4 6.9 4h6.8c1.1 0 2.1.4 2.9 1.2l6.8 6.8c1.6 1.6 1.6 4.1 0 5.7l-6.2 6.3c-.8.8-1.8 1.2-2.9 1.2s-2.1-.4-2.9-1.2z" fill="#000000" fillOpacity="0"/>
            <path d="M11.5 0H0v11.5l11.5 11.5L23 11.5 11.5 0z" fill="#F25022"/>
            <path d="M11.5 0v11.5H0L11.5 0z" fill="#7FBA00"/>
            <path d="M23 11.5v11.5L11.5 11.5H23z" fill="#00A4EF"/>
            <path d="M11.5 23L0 11.5h11.5V23z" fill="#FFB900"/>
          </svg>
          Continue with Microsoft
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <span className="text-muted-foreground font-medium">Already have an account? </span>
        <Link href="/login" className="text-foreground font-bold hover:underline inline-flex items-center gap-1">
          Sign In <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
