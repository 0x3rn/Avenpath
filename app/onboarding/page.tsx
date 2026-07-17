"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/app/actions/user";
import { ChevronRight, Loader2, Target, BookOpen, GraduationCap, CheckCircle2, ChevronDown } from "lucide-react";

const GOALS = [
  "Improve Grades", 
  "Exam Preparation", 
  "Career Growth", 
  "Learn New Skills", 
  "Personal Interest",
  "College Prep"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    major: "",
    learningGoals: [] as string[]
  });
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [educationLevel, setEducationLevel] = useState("");

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = async (skipped = false) => {
    setLoading(true);
    try {
      await completeOnboarding({ ...formData, skipped });
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Progress Pills */}
        <div className="absolute top-8 left-8 flex items-center gap-1.5">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step ? "w-8 bg-foreground" : i < step ? "w-8 bg-foreground/50" : "w-4 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <button 
          onClick={() => handleComplete(true)}
          disabled={loading}
          className="absolute top-6 right-6 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>

        <div className="mb-10 mt-4 text-center">
          <div className="w-16 h-16 bg-foreground text-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookOpen className="w-8 h-8 fill-background" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome to Avenpath</h1>
          <p className="text-muted-foreground font-medium text-lg">Let's personalize your learning experience.</p>
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div>
              <label className="text-sm font-bold block mb-2">What should we call you?</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 font-bold text-base focus:border-foreground/30 outline-none transition-colors" 
              />
            </div>
          </div>
        )}

        {/* STEP 2: Education */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className="relative">
              <label className="text-sm font-bold block mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Current Education Level</label>
              <button 
                type="button"
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 font-bold text-base flex justify-between items-center outline-none hover:border-foreground/30 transition-colors"
              >
                <span className={educationLevel ? "text-foreground" : "text-muted-foreground"}>
                  {educationLevel || "Select your level"}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${levelDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {levelDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {["High School", "University / College", "Postgraduate", "Self Learner"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setEducationLevel(lvl);
                        setLevelDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3.5 font-bold text-sm hover:bg-muted transition-colors flex items-center justify-between"
                    >
                      {lvl}
                      {educationLevel === lvl && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-bold block mb-2">Institution or School Name</label>
              <input 
                type="text" 
                value={formData.university}
                onChange={e => setFormData({ ...formData, university: e.target.value })}
                placeholder="e.g. Stanford University"
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 font-bold text-base focus:border-foreground/30 outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-2">Major / Focus</label>
              <input 
                type="text" 
                value={formData.major}
                onChange={e => setFormData({ ...formData, major: e.target.value })}
                placeholder="e.g. Computer Science"
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 font-bold text-base focus:border-foreground/30 outline-none transition-colors" 
              />
            </div>
          </div>
        )}

        {/* STEP 3: Goals */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <label className="text-sm font-bold block mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> What are your learning goals?</label>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(goal => {
                const isSelected = formData.learningGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 rounded-xl font-bold text-sm text-left border-2 transition-all flex items-center justify-between ${
                      isSelected 
                        ? "border-foreground bg-foreground text-background" 
                        : "border-border hover:border-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {goal}
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border flex justify-between items-center">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Back
            </button>
          ) : <div />}
          
          <button 
            onClick={handleNext}
            disabled={loading}
            className="bg-foreground text-background px-8 py-3.5 rounded-xl font-extrabold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === 3 ? "Complete Setup" : "Continue")}
            {!loading && step < 3 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
}
