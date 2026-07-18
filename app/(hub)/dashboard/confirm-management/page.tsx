"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, XCircle, CheckCircle2 } from "lucide-react";
import { answerManagementRequest } from "@/app/actions/parent";
import { toast } from "sonner";
import Link from "next/link";

export default function ConfirmManagementPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

  const handleResponse = async (accept: boolean) => {
    if (!token) return;
    setLoading(true);
    try {
      await answerManagementRequest(token, accept);
      setStatus("success");
      toast.success(accept ? "Request approved!" : "Request rejected.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (e: any) {
      setStatus("error");
      toast.error(e.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <XCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-2xl font-extrabold">Invalid Request</h1>
        <p className="text-muted-foreground">No token was provided in the URL.</p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-24 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {status === "pending" && (
        <>
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10 text-blue-500" />
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Management Request</h1>
            <p className="text-muted-foreground mt-2">
              A user has requested to manage your Avenpath account. If you approve, they will be able to view your progress, achievements, and learning path.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button 
              onClick={() => handleResponse(false)}
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold bg-muted text-muted-foreground hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
            >
              Reject Request
            </button>
            <button 
              onClick={() => handleResponse(true)}
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold bg-foreground text-background hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Approve Management
            </button>
          </div>
        </>
      )}

      {status === "success" && (
        <div className="space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-extrabold">Done!</h1>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-extrabold">Error</h1>
          <p className="text-muted-foreground">This request is invalid, expired, or you do not have permission to answer it.</p>
          <button onClick={() => router.push("/dashboard")} className="mt-4 px-6 py-2 bg-muted rounded-xl font-bold">
            Return to Dashboard
          </button>
        </div>
      )}

    </div>
  );
}
