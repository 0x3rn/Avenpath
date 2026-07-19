import { Search, Download, Users, Shield, ShieldAlert, Ban, UserCheck, MoreHorizontal } from "lucide-react";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import * as schema from "@/db/schema";

export default async function UserManager() {
  const users = await db.query.userProfiles.findMany({
    orderBy: (userProfiles, { desc }) => [desc(userProfiles.createdAt)],
  });

  // Count by role
  const roleCounts: Record<string, number> = { student: 0, moderator: 0, admin: 0 };
  users.forEach((u) => {
    const role = u.role?.toLowerCase() || "student";
    if (roleCounts[role] !== undefined) roleCounts[role]++;
    else roleCounts.student++;
  });

  const stats = [
    { label: "Students", val: roleCounts.student.toLocaleString(), icon: Users, color: "text-blue-500" },
    { label: "Moderators", val: roleCounts.moderator.toLocaleString(), icon: Shield, color: "text-green-500" },
    { label: "Admins", val: roleCounts.admin.toLocaleString(), icon: ShieldAlert, color: "text-red-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">User Management</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage everyone using Avenpath.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xl font-extrabold">{stat.val}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
            <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Points</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Streak</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => {
                const role = user.role || "student";
                const roleColor = role === "admin" ? "text-red-500 bg-red-500/10" : role === "moderator" ? "text-blue-500 bg-blue-500/10" : "text-green-500 bg-green-500/10";
                const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—";

                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{user.name}</div>
                          <div className="text-xs font-medium text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${roleColor}`}>
                        {role}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-muted-foreground text-right">{user.points?.toLocaleString() || 0}</td>
                    <td className="p-4 text-sm font-bold text-muted-foreground text-right">{user.streak || 0}</td>
                    <td className="p-4 text-sm font-medium text-muted-foreground text-right">{joinedDate}</td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
