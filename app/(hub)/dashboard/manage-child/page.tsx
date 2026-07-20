"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Mail, AlertCircle, CheckCircle2, Clock, ChevronRight, Activity, Target, Flame } from "lucide-react";
import { requestChildManagement, getManagedChildren } from "@/app/actions/parent";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManageChildPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      const data = await getManagedChildren();
      setChildren(data);
      if (data.length === 0) {
        setShowAddForm(true);
      }
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
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading accounts...</div>;
  }

  const hasChildren = children.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Manage Child</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Oversee your child's learning progress and achievements.
          </p>
        </div>
        
        {hasChildren && !showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors"
          >
            <UserPlus className="w-5 h-5" /> Add Child
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm max-w-xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <UserPlus className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl">Add Child Account</h2>
              <p className="text-sm text-muted-foreground font-medium">Send a request to link an existing account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Child's Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-muted/50 border-2 border-border rounded-xl pl-12 pr-4 py-3 text-[15px] font-medium focus:outline-none focus:border-foreground/30 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-500 font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>An email and in-app notification will be sent. They must approve the request before you can manage their account.</p>
            </div>

            <div className="flex gap-4">
              {hasChildren && (
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-muted text-foreground font-bold py-3 rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] bg-foreground text-background font-bold py-3 rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending Request..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {hasChildren && !showAddForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-6 hover:border-foreground/30 hover:shadow-md transition-all duration-300 relative group overflow-hidden flex flex-col cursor-pointer" onClick={() => {
              if (item.link.status === 'approved') {
                router.push(`/dashboard/manage-child/${item.child.id}`);
              } else {
                toast("This account has not approved your request yet.");
              }
            }}>
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {item.child.avatarUrl ? (
                      <img src={item.child.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold uppercase">{item.child.name.substring(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">{item.child.name}</h3>
                    <div className="text-xs text-muted-foreground font-medium">{item.child.email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex-grow relative z-10">
                {item.link.status === 'approved' ? (
                  <>
                    <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                        <Flame className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-bold uppercase">Current Streak</div>
                        <div className="font-extrabold">{item.child.streak || 0} Days</div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <Target className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-bold uppercase">Total Points</div>
                        <div className="font-extrabold">{item.child.points || 0}</div>
                      </div>
                    </div>
                  </>
                ) : item.link.status === 'pending' ? (
                  <div className="flex flex-col items-center justify-center h-24 bg-orange-500/5 rounded-2xl border border-orange-500/20 text-orange-500">
                    <Clock className="w-6 h-6 mb-2" />
                    <span className="text-sm font-bold">Request Pending</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-24 bg-red-500/5 rounded-2xl border border-red-500/20 text-red-500">
                    <AlertCircle className="w-6 h-6 mb-2" />
                    <span className="text-sm font-bold">Request Rejected</span>
                  </div>
                )}
              </div>

              {item.link.status === 'approved' && (
                <div className="mt-6 flex items-center justify-between text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors relative z-10">
                  View Detailed Report
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
