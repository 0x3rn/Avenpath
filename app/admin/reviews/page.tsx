"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, AlertCircle, RefreshCw } from "lucide-react";
import { approveRevision, rejectRevision } from "@/app/admin/actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ReviewQueuePage() {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevision, setSelectedRevision] = useState<any | null>(null);

  const fetchRevisions = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('content_revisions')
      .select('*, author:author_id(name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (data) setRevisions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveRevision(id);
      setSelectedRevision(null);
      fetchRevisions();
    } catch (e: any) {
      toast.error("Error approving: " + e.message);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectRevision(id);
      setSelectedRevision(null);
      fetchRevisions();
    } catch (e: any) {
      toast.error("Error rejecting: " + e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Review Queue</h1>
          <p className="text-muted-foreground font-medium">Approve or reject drafts submitted by moderators.</p>
        </div>
        <button onClick={fetchRevisions} className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-blue-500" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Author</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="p-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {revisions.map((rev) => (
              <tr key={rev.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-sm uppercase text-blue-500">{rev.entity_type}</div>
                  <div className="text-xs text-muted-foreground mt-1">ID: {rev.entity_id || "New"}</div>
                </td>
                <td className="p-4 text-sm font-bold">{rev.author?.name || rev.author_id}</td>
                <td className="p-4 text-sm text-muted-foreground">{new Date(rev.created_at).toLocaleString()}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setSelectedRevision(rev)} className="inline-flex items-center gap-1 bg-muted text-foreground px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-foreground hover:text-background transition-colors">
                    <Eye className="w-3 h-3" /> View Payload
                  </button>
                </td>
              </tr>
            ))}
            {revisions.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-500/30 mb-4" />
                    <span className="font-bold text-lg text-foreground">Queue is empty</span>
                    <span className="text-sm">No pending revisions. Great job!</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAYLOAD MODAL */}
      {selectedRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2">Review {selectedRevision.entity_type.toUpperCase()}</h2>
                <p className="text-sm text-muted-foreground mt-1">Submitted by {selectedRevision.author?.name}</p>
              </div>
              <button onClick={() => setSelectedRevision(null)} className="text-muted-foreground hover:text-foreground"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-muted/10 font-mono text-sm whitespace-pre-wrap">
              {JSON.stringify(selectedRevision.proposed_payload, null, 2)}
            </div>
            
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/30">
              <button 
                onClick={() => handleReject(selectedRevision.id)}
                className="px-6 py-2 rounded-xl font-bold bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
              >
                Reject & Delete
              </button>
              <button 
                onClick={() => handleApprove(selectedRevision.id)}
                className="px-6 py-2 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
