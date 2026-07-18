"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Mail, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { requestChildManagement, getManagedChildren } from "@/app/actions/parent";
import { toast } from "sonner";

export default function ManageChildPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      const data = await getManagedChildren();
      setChildren(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load managed children");
    } finally {
      setFetching(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await requestChildManagement(email);
      toast.success("Management request sent!");
      setEmail("");
      loadChildren();
    } catch (error: any) {
      toast.error(error.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Manage Child</h1>
        <p className="text-muted-foreground mt-2">
          Request to manage your child's account to oversee their learning progress and achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ADD CHILD FORM */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Add Child Account</h2>
              <p className="text-xs text-muted-foreground">Send a request to an existing account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Child's Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-3 flex gap-3 text-xs text-muted-foreground">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>An email and in-app notification will be sent to this user. They must approve the request before you can manage their account.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-foreground text-background font-bold py-2.5 rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending Request..." : "Send Request"}
            </button>
          </form>
        </div>

        {/* LIST OF CHILDREN */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Managed Accounts</h2>
              <p className="text-xs text-muted-foreground">Accounts you currently manage</p>
            </div>
          </div>

          {fetching ? (
            <div className="text-center py-8 text-sm text-muted-foreground">Loading...</div>
          ) : children.length === 0 ? (
            <div className="text-center py-8 bg-muted/30 rounded-xl border border-dashed border-border">
              <p className="text-sm font-medium text-muted-foreground">No accounts linked yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {children.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {item.child.avatarUrl ? (
                        <img src={item.child.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold uppercase">{item.child.name.substring(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{item.child.name}</div>
                      <div className="text-[10px] text-muted-foreground">{item.child.email}</div>
                    </div>
                  </div>
                  
                  <div>
                    {item.link.status === 'approved' ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </div>
                    ) : item.link.status === 'pending' ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-[10px] font-bold">
                        <Clock className="w-3 h-3" /> Pending
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-bold">
                        <AlertCircle className="w-3 h-3" /> Rejected
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
