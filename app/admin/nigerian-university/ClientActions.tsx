"use client";

import { useState } from "react";
import { Plus, GraduationCap, Building2, BookOpen } from "lucide-react";
import { createFaculty, createDepartment, createUniversityCourse } from "./actions";

// Generate slug helper
function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function AddFacultyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const handleSave = async () => {
    if (!name || !slug) return;
    setLoading(true);
    await createFaculty(name, slug);
    setLoading(false);
    setIsOpen(false);
    setName("");
    setSlug("");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Faculty
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-extrabold flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-primary" />
              Add New Faculty
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Faculty Name</label>
                <input 
                  autoFocus
                  placeholder="e.g. Faculty of Engineering"
                  value={name} onChange={handleNameChange}
                  className="w-full bg-muted/50 border border-border focus:border-primary px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">URL Slug</label>
                <input 
                  value={slug} onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-muted/50 border border-border focus:border-primary px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 font-bold text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="px-4 py-2 font-bold text-sm bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
                  {loading ? "Saving..." : "Save Faculty"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AddDepartmentButton({ facultyId, facultyName }: { facultyId: number, facultyName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const handleSave = async () => {
    if (!name || !slug) return;
    setLoading(true);
    await createDepartment(facultyId, name, slug);
    setLoading(false);
    setIsOpen(false);
    setName("");
    setSlug("");
  };

  return (
    <>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
        className="text-[10px] font-bold px-2 py-1 rounded bg-muted hover:bg-primary hover:text-primary-foreground uppercase tracking-wider transition-colors flex items-center gap-1"
        title="Add Department"
      >
        <Plus className="w-3 h-3" /> Dept
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-extrabold flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-emerald-500" />
              Add Department
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Under {facultyName}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Department Name</label>
                <input 
                  autoFocus
                  placeholder="e.g. Computer Science"
                  value={name} onChange={handleNameChange}
                  className="w-full bg-muted/50 border border-border focus:border-emerald-500 px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">URL Slug</label>
                <input 
                  value={slug} onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-muted/50 border border-border focus:border-emerald-500 px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 font-bold text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="px-4 py-2 font-bold text-sm bg-emerald-500 text-white rounded-lg disabled:opacity-50 hover:bg-emerald-600">
                  {loading ? "Saving..." : "Save Department"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AddCourseButton({ departmentId, departmentName }: { departmentId: number, departmentName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [levelName, setLevelName] = useState("100 Level");
  const [className, setClassName] = useState("First Semester");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSlug(generateSlug(e.target.value));
    setId(`uni-${departmentId}-${generateSlug(e.target.value)}`);
  };

  const handleSave = async () => {
    if (!name || !slug || !id || !levelName || !className) return;
    setLoading(true);
    await createUniversityCourse(departmentId, levelName, className, name, slug, id);
    setLoading(false);
    setIsOpen(false);
    setName("");
    setSlug("");
  };

  return (
    <>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
        className="text-[10px] font-bold px-2 py-1 rounded bg-muted hover:bg-blue-500 hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1"
        title="Add Course"
      >
        <Plus className="w-3 h-3" /> Course
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-extrabold flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Add Course
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Under {departmentName}</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Level</label>
                  <select 
                    value={levelName} onChange={(e) => setLevelName(e.target.value)}
                    className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg font-medium outline-none cursor-pointer"
                  >
                    <option>100 Level</option>
                    <option>200 Level</option>
                    <option>300 Level</option>
                    <option>400 Level</option>
                    <option>500 Level</option>
                    <option>600 Level</option>
                    <option>Postgraduate</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Semester</label>
                  <select 
                    value={className} onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg font-medium outline-none cursor-pointer"
                  >
                    <option>First Semester</option>
                    <option>Second Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Course Name</label>
                <input 
                  autoFocus
                  placeholder="e.g. CSC 101 - Introduction to Computing"
                  value={name} onChange={handleNameChange}
                  className="w-full bg-muted/50 border border-border focus:border-blue-500 px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">URL Slug</label>
                  <input 
                    value={slug} onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-muted/50 border border-border focus:border-blue-500 px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Unique ID</label>
                  <input 
                    value={id} onChange={(e) => setId(e.target.value)}
                    className="w-full bg-muted/50 border border-border focus:border-blue-500 px-3 py-2 rounded-lg font-medium outline-none transition-colors text-xs"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 font-bold text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="px-4 py-2 font-bold text-sm bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600">
                  {loading ? "Saving..." : "Save Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
