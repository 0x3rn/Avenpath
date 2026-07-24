"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, GraduationCap, Building2, BookOpen, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { 
  createFaculty, createDepartment, createUniversityCourse,
  editFaculty, deleteFaculty,
  editDepartment, deleteDepartment,
  editUniversityCourse, deleteUniversityCourse,
  checkCourseExists, shareUniversityCourse,
  unlinkUniversityCourse, transferOwnershipAndDelete, editUniversityCourseAlias,
  searchGlobalCourses
} from "./actions";

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
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
                  value={name} onChange={handleNameChange} onKeyDown={handleKeyDown}
                  className="w-full bg-muted/50 border border-border focus:border-primary px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">URL Slug</label>
                <input 
                  value={slug} onChange={(e) => setSlug(e.target.value)} onKeyDown={handleKeyDown}
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
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
                  value={name} onChange={handleNameChange} onKeyDown={handleKeyDown}
                  className="w-full bg-muted/50 border border-border focus:border-emerald-500 px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">URL Slug</label>
                <input 
                  value={slug} onChange={(e) => setSlug(e.target.value)} onKeyDown={handleKeyDown}
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
  const [confirmShare, setConfirmShare] = useState(false);
  const [existingSubjectId, setExistingSubjectId] = useState<string | null>(null);

  // Autocomplete state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!name.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchGlobalCourses(name);
      if (res.success) {
        setSearchResults(res.results);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSlug(generateSlug(e.target.value));
    setId(`uni-${departmentId}-${generateSlug(e.target.value)}`);
    setShowDropdown(true);
  };

  const handleSelectCourse = (course: any) => {
    setName(course.name);
    setSlug(course.slug);
    setId(course.id);
    setShowDropdown(false);
  };

  const handleSave = async () => {
    if (!name || !slug || !id || !levelName || !className) return;
    setLoading(true);

    if (confirmShare && existingSubjectId) {
      await shareUniversityCourse(existingSubjectId, departmentId);
      setLoading(false);
      setIsOpen(false);
      setConfirmShare(false);
      setExistingSubjectId(null);
      setName("");
      setSlug("");
      return;
    }

    const existsCheck = await checkCourseExists(name);
    if (existsCheck.exists) {
      setExistingSubjectId(existsCheck.subjectId);
      setConfirmShare(true);
      setLoading(false);
      return;
    }

    await createUniversityCourse(departmentId, levelName, className, name, slug, id);
    setLoading(false);
    setIsOpen(false);
    setName("");
    setSlug("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
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
              {confirmShare ? "Course Already Exists" : "Add Course"}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Under {departmentName}</p>
            
            {confirmShare ? (
              <div className="space-y-4">
                <div className="bg-blue-500/10 text-blue-500 p-4 rounded-xl text-sm font-medium">
                  The course <strong>{name}</strong> already exists in another department. Do you want to link it to {departmentName}?
                  <br /><br />
                  <span className="text-xs">Linking ensures that any future content updates (topics, quizzes) are synchronized across all departments that share this course.</span>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button onClick={() => { setConfirmShare(false); setExistingSubjectId(null); }} className="px-4 py-2 font-bold text-sm text-muted-foreground hover:text-foreground">No, Cancel</button>
                  <button onClick={handleSave} disabled={loading} className="px-4 py-2 font-bold text-sm bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600">
                    {loading ? "Linking..." : "Yes, Link Course"}
                  </button>
                </div>
              </div>
            ) : (
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

                <div className="relative" ref={dropdownRef}>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Course Name</label>
                  <input 
                    autoFocus
                    placeholder="e.g. CSC 101 - Introduction to Computing"
                    value={name} onChange={handleNameChange} onKeyDown={handleKeyDown}
                    onFocus={() => { if (name.trim()) setShowDropdown(true); }}
                    className="w-full bg-muted/50 border border-border focus:border-blue-500 px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                  />
                  {showDropdown && name.trim() && (
                    <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
                      {isSearching ? (
                        <div className="p-3 text-sm text-muted-foreground text-center animate-pulse">Searching...</div>
                      ) : searchResults.length > 0 ? (
                        <ul className="max-h-48 overflow-y-auto">
                          {searchResults.map((course) => (
                            <li 
                              key={course.id}
                              onClick={() => handleSelectCourse(course)}
                              className="px-3 py-2 hover:bg-muted/50 cursor-pointer text-sm font-medium transition-colors border-b border-border/50 last:border-0"
                            >
                              {course.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 text-sm text-muted-foreground text-center">No existing courses found</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">URL Slug</label>
                    <input 
                      value={slug} onChange={(e) => setSlug(e.target.value)} onKeyDown={handleKeyDown}
                      className="w-full bg-muted/50 border border-border focus:border-blue-500 px-3 py-2 rounded-lg font-medium outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Unique ID</label>
                    <input 
                      value={id} onChange={(e) => setId(e.target.value)} onKeyDown={handleKeyDown}
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
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Edit & Delete Action Buttons

export function EditFacultyButton({ faculty }: { faculty: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(faculty.name);
  const [slug, setSlug] = useState(faculty.slug || generateSlug(faculty.name));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !slug) return;
    setLoading(true);
    await editFaculty(faculty.id, name, slug);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="text-[10px] font-bold px-2 py-1 rounded bg-muted hover:bg-blue-500 hover:text-white transition-colors" title="Edit Faculty">
        <Pencil className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-md p-6 rounded-2xl shadow-xl border border-border">
            <h2 className="text-xl font-extrabold flex items-center gap-2 mb-4"><Pencil className="w-5 h-5 text-blue-500" /> Edit Faculty</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Name</label>
                <input value={name} onChange={e => { setName(e.target.value); setSlug(generateSlug(e.target.value)); }} className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">URL Slug</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg outline-none" />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-bold bg-blue-500 text-white rounded-lg disabled:opacity-50">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DeleteFacultyButton({ facultyId, name }: { facultyId: number, name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await deleteFaculty(facultyId);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="text-[10px] font-bold px-2 py-1 rounded bg-muted hover:bg-red-500 hover:text-white transition-colors" title="Delete Faculty">
        <Trash2 className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-sm p-6 rounded-2xl shadow-xl border border-border text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Delete Faculty?</h2>
            <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete <strong>{name}</strong>? This will remove all departments and courses within it.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg">Cancel</button>
              <button onClick={handleConfirm} disabled={loading} className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg disabled:opacity-50">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function EditDepartmentButton({ department }: { department: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(department.name);
  const [slug, setSlug] = useState(department.slug || generateSlug(department.name));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !slug) return;
    setLoading(true);
    await editDepartment(department.departmentId, name, slug);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="text-[10px] font-bold px-2 py-1 rounded bg-muted hover:bg-emerald-500 hover:text-white transition-colors" title="Edit Department">
        <Pencil className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-md p-6 rounded-2xl shadow-xl border border-border">
            <h2 className="text-xl font-extrabold flex items-center gap-2 mb-4"><Pencil className="w-5 h-5 text-emerald-500" /> Edit Department</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Name</label>
                <input value={name} onChange={e => { setName(e.target.value); setSlug(generateSlug(e.target.value)); }} className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">URL Slug</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg outline-none" />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-bold bg-emerald-500 text-white rounded-lg disabled:opacity-50">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DeleteDepartmentButton({ departmentId, name }: { departmentId: number, name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await deleteDepartment(departmentId);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="text-[10px] font-bold px-2 py-1 rounded bg-muted hover:bg-red-500 hover:text-white transition-colors" title="Delete Department">
        <Trash2 className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-sm p-6 rounded-2xl shadow-xl border border-border text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Delete Department?</h2>
            <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete <strong>{name}</strong>? This will remove all courses within it.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg">Cancel</button>
              <button onClick={handleConfirm} disabled={loading} className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg disabled:opacity-50">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function EditCourseButton({ course }: { course: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(course.name);
  const [slug, setSlug] = useState(course.slug || generateSlug(course.name));
  const [levelName, setLevelName] = useState(course.levelName || "100 Level");
  const [className, setClassName] = useState(course.className || "First Semester");
  const [loading, setLoading] = useState(false);
  const [confirmLink, setConfirmLink] = useState(false);
  const [existingSubjectId, setExistingSubjectId] = useState<string | null>(null);

  const handleSave = async (editType: 'all' | 'local' = 'all') => {
    if (!name || !slug) return;
    setLoading(true);

    if (confirmLink && existingSubjectId) {
      if (!course.isShared) {
        await transferOwnershipAndDelete(course.id, course.departmentId);
      } else {
        await unlinkUniversityCourse(course.id, course.departmentId);
      }
      await shareUniversityCourse(existingSubjectId, course.departmentId);
      
      setLoading(false);
      setIsOpen(false);
      setConfirmLink(false);
      return;
    }

    if (name !== course.name) {
      const existsCheck = await checkCourseExists(name);
      if (existsCheck.exists && existsCheck.subjectId !== course.id) {
        setExistingSubjectId(existsCheck.subjectId);
        setConfirmLink(true);
        setLoading(false);
        return;
      }
    }

    if (editType === 'local') {
      await editUniversityCourseAlias(course.id, course.departmentId, name, slug, !course.isShared);
    } else {
      await editUniversityCourse(course.id, name, slug, levelName, className);
    }
    
    setLoading(false);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave('all'); // default to all if enter pressed
  };

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="text-[10px] font-bold px-3 py-1.5 rounded-md bg-muted hover:bg-blue-500 hover:text-white transition-colors uppercase tracking-wider" title="Edit Course">
        <Pencil className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-md p-6 rounded-2xl shadow-xl border border-border">
            <h2 className="text-xl font-extrabold flex items-center gap-2 mb-4"><Pencil className="w-5 h-5 text-blue-500" /> Edit Course</h2>
            
            {confirmLink ? (
              <div className="space-y-4">
                <div className="bg-blue-500/10 text-blue-500 p-4 rounded-xl text-sm font-medium">
                  The course <strong>{name}</strong> already exists globally. Do you want to unlink the current course and link to the existing one?
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button onClick={() => { setConfirmLink(false); setExistingSubjectId(null); }} className="px-4 py-2 font-bold text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                  <button onClick={() => handleSave('all')} disabled={loading} className="px-4 py-2 font-bold text-sm bg-blue-500 text-white rounded-lg disabled:opacity-50">
                    {loading ? "Linking..." : "Yes, Link Course"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Level</label>
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
                    <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Semester</label>
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
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Name</label>
                  <input value={name} onChange={e => { setName(e.target.value); setSlug(generateSlug(e.target.value)); }} onKeyDown={handleKeyDown} className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">URL Slug</label>
                  <input value={slug} onChange={e => setSlug(e.target.value)} onKeyDown={handleKeyDown} className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg outline-none" />
                </div>
                
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground">Cancel</button>
                    {(course.shareCount > 0 || course.isShared) && (
                      <button 
                        onClick={() => handleSave('local')} 
                        disabled={loading || levelName !== course.levelName || className !== course.className} 
                        className="px-4 py-2 text-sm font-bold bg-muted hover:bg-muted/80 text-foreground rounded-lg disabled:opacity-50 border border-border"
                        title={levelName !== course.levelName || className !== course.className ? "Cannot save semester changes locally" : ""}
                      >
                        Save for this dept only
                      </button>
                    )}
                    <button onClick={() => handleSave('all')} disabled={loading} className="px-4 py-2 text-sm font-bold bg-blue-500 text-white rounded-lg disabled:opacity-50">
                      Save {(course.shareCount > 0 || course.isShared) ? 'for ALL depts' : ''}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function DeleteCourseButton({ course }: { course: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmAll = async () => {
    setLoading(true);
    await deleteUniversityCourse(course.id);
    setLoading(false);
    setIsOpen(false);
  };

  const handleUnlink = async () => {
    setLoading(true);
    await unlinkUniversityCourse(course.id, course.departmentId);
    setLoading(false);
    setIsOpen(false);
  };

  const handleTransferAndDelete = async () => {
    setLoading(true);
    await transferOwnershipAndDelete(course.id, course.departmentId);
    setLoading(false);
    setIsOpen(false);
  };

  if (course.isShared) {
    return (
      <>
        <button onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="text-[10px] font-bold px-3 py-1.5 rounded-md bg-muted hover:bg-orange-500 hover:text-white transition-colors uppercase tracking-wider" title="Unlink Course">
          <Trash2 className="w-3 h-3" />
        </button>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
            <div className="bg-card w-full max-w-sm p-6 rounded-2xl shadow-xl border border-border text-center">
              <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">Unlink Course?</h2>
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to unlink <strong>{course.name}</strong> from your department?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg">Cancel</button>
                <button onClick={handleUnlink} disabled={loading} className="px-4 py-2 text-sm font-bold bg-orange-500 text-white rounded-lg disabled:opacity-50">Unlink</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="text-[10px] font-bold px-3 py-1.5 rounded-md bg-muted hover:bg-red-500 hover:text-white transition-colors uppercase tracking-wider" title="Delete Course">
        <Trash2 className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="bg-card w-full max-w-sm p-6 rounded-2xl shadow-xl border border-border text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Delete Course?</h2>
            
            {course.shareCount > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">You are the owner of <strong>{course.name}</strong>. It is currently shared by <strong>{course.shareCount} other departments</strong>.</p>
                <div className="flex flex-col gap-2">
                  <button onClick={handleTransferAndDelete} disabled={loading} className="px-4 py-2 text-sm font-bold bg-orange-500 text-white rounded-lg disabled:opacity-50 w-full">Delete for my dept only</button>
                  <button onClick={handleConfirmAll} disabled={loading} className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg disabled:opacity-50 w-full">Delete for ALL depts</button>
                  <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg mt-2 w-full">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete <strong>{course.name}</strong>?</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg">Cancel</button>
                  <button onClick={handleConfirmAll} disabled={loading} className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg disabled:opacity-50">Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
