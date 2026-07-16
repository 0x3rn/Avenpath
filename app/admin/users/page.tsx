"use client";

import { Search, Filter, MoreHorizontal, Download, UserCheck, Shield, Users, ShieldAlert, Ban } from "lucide-react";

export default function UserManager() {
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Students", val: "248,420", icon: Users, color: "text-blue-500" },
          { label: "Moderators", val: "32", icon: Shield, color: "text-green-500" },
          { label: "Admins", val: "6", icon: ShieldAlert, color: "text-red-500" },
        ].map((stat, i) => (
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

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, email, or username..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Roles</option>
            <option>Student</option>
            <option>Moderator</option>
            <option>Admin</option>
          </select>
          <select className="bg-muted/50 hover:bg-muted border border-border rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer appearance-none min-w-[120px]">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Deactivated</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-10 text-center"><input type="checkbox" className="rounded" /></th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Education</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Lessons</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Joined</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: "John Doe", email: "john@example.com", role: "Student", edu: "University", lessons: "214", status: "Active", color: "text-green-500", bg: "bg-green-500/10", date: "April 2026" },
                { name: "Sarah Smith", email: "sarah@avenpath.edu", role: "Admin", edu: "-", lessons: "-", status: "Active", color: "text-blue-500", bg: "bg-blue-500/10", date: "Jan 2026" },
                { name: "Mike Johnson", email: "mike@example.com", role: "Student", edu: "High School", lessons: "42", status: "Suspended", color: "text-red-500", bg: "bg-red-500/10", date: "May 2026" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 text-center"><input type="checkbox" className="rounded opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted border border-border" />
                      <div>
                        <div className="font-bold text-sm text-foreground group-hover:text-blue-500 transition-colors cursor-pointer">{row.name}</div>
                        <div className="text-xs font-medium text-muted-foreground">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-sm text-muted-foreground">{row.role}</td>
                  <td className="p-4 text-sm font-medium text-muted-foreground">{row.edu}</td>
                  <td className="p-4 text-sm font-bold text-muted-foreground text-right">{row.lessons}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${row.color} ${row.bg}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-muted-foreground text-right">{row.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {row.status === "Active" ? (
                        <button className="p-1.5 text-muted-foreground hover:bg-card hover:text-red-500 rounded-md border border-transparent hover:border-border transition-all" title="Suspend User"><Ban className="w-4 h-4" /></button>
                      ) : (
                        <button className="p-1.5 text-muted-foreground hover:bg-card hover:text-green-500 rounded-md border border-transparent hover:border-border transition-all" title="Activate User"><UserCheck className="w-4 h-4" /></button>
                      )}
                      <button className="p-1.5 text-muted-foreground hover:bg-card hover:text-foreground rounded-md border border-transparent hover:border-border transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
