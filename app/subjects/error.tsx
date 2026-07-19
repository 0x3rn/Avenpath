"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, BookX, RefreshCcw, ArrowLeft } from "lucide-react";

export default function SubjectsError({
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
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="sticky top-0 flex items-center px-8 py-6 max-w-7xl mx-auto w-full z-40 bg-background/90 backdrop-blur-md">
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">Avenpath.</Link>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
            {isOffline ? (
              <WifiOff className="w-10 h-10 text-orange-500" />
            ) : (
              <BookX className="w-10 h-10 text-red-500" />
            )}
          </div>
          
          <h1 className="text-2xl font-extrabold mb-3">
            {isOffline ? "Connection Lost" : "Failed to load content"}
          </h1>
          
          <p className="text-muted-foreground font-medium mb-8">
            {isOffline 
              ? "We couldn't load this curriculum data because your device is offline. Check your connection to resume learning." 
              : "We encountered an issue fetching this subject's data from the server."}
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => reset()}
              className="w-full bg-foreground text-background py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <RefreshCcw className="w-4 h-4" /> Try Again
            </button>
            
            <Link href="/subjects">
              <button className="w-full bg-transparent border-2 border-border text-foreground py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-foreground/30 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Subjects
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
