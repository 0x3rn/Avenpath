"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle2, RefreshCw, ExternalLink, Edit2, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Simulate verifying the email after a delay
  const simulateVerification = () => {
    setIsVerified(true);
  };

  const handleResend = async () => {
    setIsResending(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsResending(false);
  };

  const handleContinue = () => {
    router.push("/onboarding");
  };

  if (isVerified) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
        <div className="w-24 h-24 mb-6">
          <CheckCircle2 className="w-full h-full text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">Email Verified!</h1>
        <p className="text-muted-foreground font-medium mb-8 max-w-sm">
          Your account is ready. Let's personalize your learning experience.
        </p>
        <button 
          onClick={handleContinue}
          className="w-full max-w-xs bg-foreground text-background font-bold py-3.5 rounded-xl transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center text-center">
      
      {/* Icon */}
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-8 relative">
        <Mail className="w-10 h-10 text-foreground" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-card flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-extrabold tracking-tight mb-4">Verify Your Email</h1>
      <p className="text-muted-foreground font-medium mb-10 max-w-sm">
        We sent a verification link to <span className="text-foreground font-bold">you@example.com</span>
      </p>

      {/* Primary Actions */}
      <div className="w-full space-y-3 mb-10">
        <button 
          onClick={simulateVerification} // Hidden trick to proceed in demo
          className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-foreground/90 active:scale-[0.98]"
        >
          Open Email App <ExternalLink className="w-4 h-4" />
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleResend}
            disabled={isResending}
            className="bg-card border border-border text-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-muted disabled:opacity-50"
          >
            {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Resend
          </button>
          <button className="bg-card border border-border text-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-muted">
            <Edit2 className="w-4 h-4" /> Change Email
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm font-medium text-muted-foreground">
        Didn't receive anything? <br />
        Check your spam folder or try resending.
      </div>

    </div>
  );
}
