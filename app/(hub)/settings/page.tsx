"use client";

import { useState, useEffect } from "react";
import { User, Bell, Palette, Globe, Shield, Key, Download, AlertTriangle, MonitorSmartphone, Plus, Save, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { getUserProfile, updateProfile } from "@/app/actions/user";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    university: "",
    major: "",
    email: "",
    bio: ""
  });

  useEffect(() => {
    getUserProfile().then(p => {
      if (p) {
        setFormData({
          name: p.name || "",
          university: p.university || "",
          major: p.major || "",
          email: p.email || "",
          bio: p.bio || ""
        });
      }
      setIsLoading(false);
    });
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        university: formData.university,
        major: formData.major,
        bio: formData.bio
      });
      setHasChanges(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const TABS = [
    { name: "Profile", icon: User },
    { name: "Notifications", icon: Bell },
    { name: "Appearance", icon: Palette },
    { name: "Language & Region", icon: Globe },
    { name: "Privacy", icon: Shield },
    { name: "Account", icon: Key },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-32">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your identity, preferences, and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SETTINGS NAVIGATION */}
        <div className="w-full md:w-64 shrink-0 flex gap-2 md:flex-col overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {TABS.map(tab => {
            const isActive = activeTab === tab.name;
            return (
              <button 
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap ${
                  isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.name}
              </button>
            )
          })}
        </div>

        {/* SETTINGS CONTENT */}
        <div className="flex-1 space-y-10">
          
          {/* PROFILE SECTION */}
          {activeTab === "Profile" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <section className="bg-card border border-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold mb-6">Profile Details</h3>
                
                <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center shrink-0 border-2 border-border border-dashed hover:border-foreground/30 transition-colors cursor-pointer group">
                    <Plus className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Display Name</label>
                        <input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:border-foreground/30 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Major / Course</label>
                        <input type="text" value={formData.major} onChange={e => handleChange('major', e.target.value)} placeholder="e.g. Computer Science" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:border-foreground/30 outline-none transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={e => handleChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm min-h-[100px] resize-none focus:border-foreground/30 outline-none transition-colors" 
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Education Level</label>
                      <select className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:border-foreground/30 outline-none transition-colors appearance-none">
                        <option>University Student</option>
                        <option>High School Student</option>
                        <option>Graduate Student</option>
                        <option>Self Learner</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Institution</label>
                      <input type="text" value={formData.university} onChange={e => handleChange('university', e.target.value)} placeholder="e.g. University of Lagos" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm focus:border-foreground/30 outline-none transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8 border-t border-border pt-6 min-h-[70px]">
                  {hasChanges && (
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl font-extrabold text-sm bg-foreground text-background hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 animate-in slide-in-from-right-4 duration-300"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                    </button>
                  )}
                </div>

              </section>
            </div>
          )}

          {/* APPEARANCE SECTION */}
          {activeTab === "Appearance" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <section className="bg-card border border-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold mb-6">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {["System", "Light", "Dark"].map((theme, i) => (
                    <button key={i} className={`p-4 rounded-2xl border-2 font-bold text-sm transition-colors ${i === 2 ? "border-foreground bg-muted/50" : "border-border hover:border-foreground/30 text-muted-foreground"}`}>
                      {theme}
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-card border border-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold mb-6">Accent Color</h3>
                <div className="flex gap-4">
                  {["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-foreground"].map((color, i) => (
                    <button key={i} className={`w-12 h-12 rounded-full ${color} flex items-center justify-center ring-offset-background ring-offset-2 transition-all hover:scale-110 ${i === 0 ? "ring-2 ring-foreground" : ""}`}>
                      {i === 0 && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-card border border-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold mb-6">Interface Options</h3>
                <div className="space-y-4">
                  {[
                    { title: "Compact Density", desc: "Reduces padding to show more information on screen." },
                    { title: "Reduced Motion", desc: "Disables non-essential animations." },
                    { title: "High Contrast", desc: "Increases text contrast for better readability." },
                  ].map((opt, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                      <div>
                        <div className="font-bold text-sm">{opt.title}</div>
                        <div className="text-xs font-medium text-muted-foreground">{opt.desc}</div>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-muted p-1 transition-colors cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-background shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ACCOUNT SECTION */}
          {activeTab === "Account" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              
              <section className="bg-card border border-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold mb-6">Credentials</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Email Address</label>
                    <div className="flex gap-4">
                      <input type="email" value={formData.email} readOnly className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 font-bold text-sm outline-none text-muted-foreground" />
                      <button className="bg-muted px-4 py-3 rounded-xl font-bold text-sm hover:bg-foreground hover:text-background transition-colors shrink-0">Change</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Password</label>
                    <button className="bg-muted px-4 py-3 rounded-xl font-bold text-sm hover:bg-foreground hover:text-background transition-colors w-full sm:w-auto">Change Password</button>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2"><MonitorSmartphone className="w-5 h-5 text-muted-foreground" /> Active Sessions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                    <div>
                      <div className="font-bold text-sm">Windows • Chrome</div>
                      <div className="text-xs font-medium text-green-500 mt-0.5">Current Session</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                    <div>
                      <div className="font-bold text-sm">iPhone • Safari</div>
                      <div className="text-xs font-medium text-muted-foreground mt-0.5">Yesterday, 10:42 PM</div>
                    </div>
                    <button className="text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors">Revoke</button>
                  </div>
                </div>
                <button className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mt-6 block">Sign Out Of All Devices</button>
              </section>

              <section className="bg-card border border-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2"><Download className="w-5 h-5 text-muted-foreground" /> Data Management</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {["Export Notes", "Download Certificates", "Export Progress Data", "Download Personal Data"].map((action, i) => (
                    <button key={i} className="p-4 rounded-2xl border-2 border-border font-bold text-sm text-left hover:border-foreground/30 transition-colors">
                      {action}
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold mb-2 text-red-500 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Danger Zone</h3>
                <p className="text-sm font-medium text-muted-foreground mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </section>

            </div>
          )}

          {/* PLACEHOLDER FOR OTHER TABS */}
          {["Notifications", "Language & Region", "Privacy"].includes(activeTab) && (
            <div className="bg-card border border-border rounded-3xl p-12 text-center animate-in slide-in-from-right-4 duration-500">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">{activeTab} Settings</h3>
              <p className="text-sm font-medium text-muted-foreground">This section would contain detailed toggles and configurations per the design spec.</p>
            </div>
          )}

        </div>

      </div>


    </div>
  );
}

// Icon for placeholder
function Settings2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
