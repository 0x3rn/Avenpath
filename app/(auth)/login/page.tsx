"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Eye, EyeOff, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In Phase 3, we'll check if onboarding is complete via Supabase.
    // For now, redirect to the onboarding wizard.
    router.push("/onboarding");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-muted-foreground font-medium">Continue your learning journey.</p>
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

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-foreground">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all pr-12"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                rememberMe ? 'bg-foreground border-foreground text-background' : 'bg-card border-border'
              }`}
            >
              {rememberMe && <Check className="w-3.5 h-3.5" />}
            </button>
            <span className="text-sm font-medium text-foreground cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
              Remember me
            </span>
          </div>
          
          <Link href="/forgot-password" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button 
          disabled={!isValid || isLoading}
          className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
            </>
          ) : (
            "Sign In"
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
        <span className="text-muted-foreground font-medium">Don't have an account? </span>
        <Link href="/sign-up" className="text-foreground font-bold hover:underline inline-flex items-center gap-1">
          Create one <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
