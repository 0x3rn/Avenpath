"use client";

import { useEffect, useState } from "react";
import { Bell, BookOpen, Target, PlayCircle, Layers, Map, Trophy, Flame, Sparkles, MessageSquare, Users, Settings2, MoreHorizontal, CalendarCheck2, ArrowRight } from "lucide-react";
import { getUserNotifications, markNotificationRead } from "@/app/actions/notifications";
import Link from "next/link";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (e) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id: number, url: string | null) => {
    await markNotificationRead(id);
    if (url) {
      window.location.href = url;
    } else {
      loadNotifications();
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Notifications</h1>
          <p className="text-muted-foreground font-medium">Updates, reminders, and achievements.</p>
        </div>
        <div className="flex gap-2">
          <button className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
            Mark all read
          </button>
          <button className="bg-muted p-2 rounded-xl text-foreground hover:bg-foreground hover:text-background transition-colors">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-border">
        {["All", "Unread", "Study", "Achievements", "Community", "System"].map((filter, i) => (
          <button key={i} className={`px-4 py-2 rounded-xl font-bold text-sm shrink-0 ${i === 0 ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"}`}>
            {filter}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        
        {/* MAIN FEED */}
        <div className="lg:col-span-2 space-y-4">
          
          {loading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 bg-muted/30 rounded-xl border border-dashed border-border">
              <p className="text-sm font-medium text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif, i) => (
              <div key={i} className={`bg-card border p-4 sm:p-6 rounded-2xl flex gap-4 transition-colors group ${!notif.isRead ? "border-foreground/30 shadow-sm" : "border-border hover:border-foreground/20"}`}>
                <div className={`w-12 h-12 rounded-full ${notif.type === 'management_request' ? "bg-blue-500/10" : "bg-muted"} flex items-center justify-center shrink-0`}>
                  {notif.type === 'management_request' ? <Users className="w-6 h-6 text-blue-500" /> : <Bell className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`text-lg font-extrabold ${!notif.isRead ? "text-foreground" : "text-foreground/80"}`}>{notif.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-medium text-sm mb-3">
                    {notif.message}
                  </p>
                  {notif.actionUrl && (
                    <button onClick={() => handleAction(notif.id, notif.actionUrl)} className="flex items-center gap-2 text-sm font-bold bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors">
                      Action Required <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  {!notif.actionUrl && !notif.isRead && (
                    <button onClick={() => handleAction(notif.id, null)} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                      Mark Read
                    </button>
                  )}
                </div>
                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-foreground mt-2 shrink-0" />}
              </div>
            ))
          )}

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">
          
          {/* WEEKLY SUMMARY */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="font-extrabold text-lg flex items-center gap-2 mb-6">
              <CalendarCheck2 className="w-5 h-5 text-muted-foreground" /> This Week
            </h3>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-extrabold mb-1">6.4</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hours Studied</div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-muted-foreground">Lessons</span>
                <span>18</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-muted-foreground">Quizzes</span>
                <span>4</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="text-green-500">89%</span>
              </div>
            </div>
          </div>

          {/* QUICK PREFERENCES */}
          <div className="bg-muted/30 border border-border rounded-3xl p-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider mb-6 text-muted-foreground">Quick Settings</h3>
            <div className="space-y-4">
              {["Study Reminders", "Achievements", "Quiz Reminders", "Community Updates"].map((setting, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-bold text-sm">{setting}</span>
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${i === 3 ? "bg-muted" : "bg-green-500"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${i === 3 ? "translate-x-0" : "translate-x-4"}`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors text-center">
              View All Settings
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
