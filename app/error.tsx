"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, ServerCrash, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check if the error might be network related
    if (!navigator.onLine) {
      setIsOffline(true);
    }
    
    // Set up listeners for connection restore
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-xl">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          {isOffline ? (
            <WifiOff className="w-10 h-10 text-orange-500" />
          ) : (
            <ServerCrash className="w-10 h-10 text-red-500" />
          )}
        </div>
        
        <h1 className="text-2xl font-extrabold mb-3">
          {isOffline ? "No Internet Connection" : "Something went wrong"}
        </h1>
        
        <p className="text-muted-foreground font-medium mb-8">
          {isOffline 
            ? "It looks like you're offline. Please check your network connection and try again." 
            : "We encountered an unexpected server error while loading this page. Our team has been notified."}
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => reset()}
            className="w-full bg-foreground text-background py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
          
          <Link href="/">
            <button className="w-full bg-transparent border-2 border-border text-foreground py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-foreground/30 transition-colors">
              <Home className="w-4 h-4" /> Go to Homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
