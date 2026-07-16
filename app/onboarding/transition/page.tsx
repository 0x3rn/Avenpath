"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Finding the best subjects...",
  "Building your study plan...",
  "Organizing your lessons...",
  "Preparing recommendations...",
  "Almost ready..."
];

export default function TransitionPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle messages every 900ms
    const interval = setInterval(() => {
      setMessageIndex(prev => {
        if (prev < MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

    // Redirect after 4.5 seconds
    const timeout = setTimeout(() => {
      router.push("/onboarding/welcome");
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-24">
      
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8 relative">
        <Loader2 className="w-10 h-10 text-foreground animate-spin" />
        <div className="absolute inset-0 border-4 border-foreground/10 rounded-full" />
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-center px-6">
        Building your personalized learning experience...
      </h1>
      
      <div className="h-8 relative w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground font-bold absolute"
          >
            {MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

    </div>
  );
}
