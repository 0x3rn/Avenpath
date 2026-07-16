"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, ArrowLeft, Check, Clock, Moon, Sun, Monitor } from "lucide-react";

// --- Data Constants ---
const USER_TYPES = [
  "High School Student", "University Student", "Graduate Student", 
  "Self Learner", "Teacher", "Professional"
];

const SUBJECTS = [
  "Mathematics", "Biology", "Chemistry", "Physics", 
  "Computer Science", "English", "History", "Economics", 
  "Accounting", "Psychology", "Statistics", "Engineering", 
  "Medicine", "Law", "Business", "Languages"
];

const GOALS = [
  "Improve grades", "Prepare for exams", "University coursework", 
  "Learn a new skill", "Career development", "Personal interest", 
  "Professional certification"
];

const SESSION_LENGTHS = ["10 min", "20 min", "30 min", "45 min", "1 hour"];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Mixed"];

// --- Main Component ---
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // --- State ---
  const [userType, setUserType] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [sessionLength, setSessionLength] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [theme, setTheme] = useState("System");
  const [language, setLanguage] = useState("English");

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    // Save to local storage or state management to simulate Supabase saving
    localStorage.setItem("onboardingData", JSON.stringify({
      userType, subjects, goals, weeklyHours, sessionLength, difficulty, reminderEnabled, reminderTime, theme, language
    }));
    router.push("/onboarding/transition");
  };

  const handleSkip = () => {
    router.push("/onboarding/transition");
  };

  // --- Step Components ---

  const Step1 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Tell us about yourself</h2>
        <p className="text-muted-foreground font-medium text-lg">We'll tailor recommendations to match your learning stage.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {USER_TYPES.map(type => (
          <button 
            key={type}
            onClick={() => { setUserType(type); setTimeout(nextStep, 300); }}
            className={`p-6 rounded-2xl border text-left font-bold transition-all ${
              userType === type 
                ? "bg-foreground text-background border-foreground shadow-lg scale-[1.02]" 
                : "bg-card border-border hover:border-foreground/30 hover:bg-muted"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );

  const Step2 = () => {
    const filteredSubjects = SUBJECTS.filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()));
    
    return (
      <div className="space-y-8 pb-20">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Choose your subjects</h2>
          <p className="text-muted-foreground font-medium text-lg">Select at least one subject to get started.</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search subjects..."
            value={subjectSearch}
            onChange={e => setSubjectSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-lg font-medium"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredSubjects.map(sub => {
            const isSelected = subjects.includes(sub);
            return (
              <button 
                key={sub}
                onClick={() => {
                  if (isSelected) setSubjects(subjects.filter(s => s !== sub));
                  else setSubjects([...subjects, sub]);
                }}
                className={`p-4 rounded-xl border font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 text-center aspect-square ${
                  isSelected 
                    ? "bg-foreground text-background border-foreground shadow-md scale-[1.02]" 
                    : "bg-card border-border hover:border-foreground/30 hover:bg-muted"
                }`}
              >
                {isSelected && <Check className="w-5 h-5" />}
                {sub}
              </button>
            )
          })}
        </div>
        
        {/* Sticky bottom bar */}
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-md border-t border-border p-4 md:p-6 flex items-center justify-between z-20">
          <div className="font-bold text-muted-foreground max-w-7xl mx-auto w-full px-4 flex justify-between items-center">
            <span>Selected <span className="text-foreground">{subjects.length} Subjects</span></span>
            <button 
              onClick={nextStep}
              disabled={subjects.length === 0}
              className="bg-foreground text-background px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Step3 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">What's your goal?</h2>
        <p className="text-muted-foreground font-medium text-lg">Select all that apply.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {GOALS.map(goal => {
          const isSelected = goals.includes(goal);
          return (
            <button 
              key={goal}
              onClick={() => {
                if (isSelected) setGoals(goals.filter(g => g !== goal));
                else setGoals([...goals, goal]);
              }}
              className={`px-6 py-4 rounded-full border font-bold transition-all flex items-center gap-2 ${
                isSelected 
                  ? "bg-foreground text-background border-foreground shadow-md scale-[1.02]" 
                  : "bg-card border-border hover:border-foreground/30 hover:bg-muted"
              }`}
            >
              {isSelected && <Check className="w-4 h-4" />}
              {goal}
            </button>
          )
        })}
      </div>
      <button 
        onClick={nextStep}
        disabled={goals.length === 0}
        className="bg-foreground text-background px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 w-full sm:w-auto transition-transform active:scale-[0.98] disabled:opacity-50 mt-8"
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Weekly Study Goal</h2>
        <p className="text-muted-foreground font-medium text-lg">How much time can you dedicate each week?</p>
      </div>
      
      <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
        <div className="flex items-center justify-between text-xl font-extrabold text-foreground">
          <span>{weeklyHours} Hours</span>
        </div>
        <input 
          type="range" 
          min="1" max="20" step="1"
          value={weeklyHours}
          onChange={e => setWeeklyHours(parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
        />
        <p className="text-sm font-medium text-muted-foreground">We'll recommend lessons that fit your schedule.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Preferred session length</h3>
        <div className="flex flex-wrap gap-3">
          {SESSION_LENGTHS.map(len => (
            <button 
              key={len}
              onClick={() => { setSessionLength(len); setTimeout(nextStep, 300); }}
              className={`px-6 py-3 rounded-full border font-bold transition-all ${
                sessionLength === len 
                  ? "bg-foreground text-background border-foreground shadow-md scale-[1.05]" 
                  : "bg-card border-border hover:border-foreground/30 hover:bg-muted"
              }`}
            >
              {len}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Almost done!</h2>
        <p className="text-muted-foreground font-medium text-lg">Let's set up your learning experience.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-foreground">Preferred difficulty</h3>
        <div className="grid grid-cols-2 gap-3">
          {DIFFICULTIES.map(diff => (
            <button 
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`p-4 rounded-xl border font-bold transition-all ${
                difficulty === diff 
                  ? "bg-foreground text-background border-foreground" 
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Daily Reminder</h3>
            <p className="text-sm font-medium text-muted-foreground">Remind me to study</p>
          </div>
          <button 
            onClick={() => setReminderEnabled(!reminderEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${reminderEnabled ? 'bg-foreground' : 'bg-muted'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-background absolute top-1 transition-transform ${reminderEnabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        {reminderEnabled && (
          <div className="flex items-center gap-3 mt-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <input 
              type="time" 
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-foreground"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-bold text-foreground">Theme</h3>
        <div className="flex gap-3">
          {[
            { name: "System", icon: Monitor }, 
            { name: "Light", icon: Sun }, 
            { name: "Dark", icon: Moon }
          ].map(t => (
            <button 
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={`flex-1 p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                theme === t.name 
                  ? "bg-foreground text-background border-foreground" 
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.name}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={handleFinish}
        disabled={!difficulty}
        className="w-full bg-foreground text-background font-bold py-4 rounded-xl mt-8 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Finish Setup <ChevronRight className="w-5 h-5" />
      </button>

    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-6 relative flex flex-col min-h-[70vh]">
      
      {/* Top Nav & Progress */}
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {step > 1 && (
            <button onClick={prevStep} className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="text-sm font-bold text-foreground">Step {step} of {totalSteps}</div>
            <div className="text-xs font-semibold text-muted-foreground">Estimated time: 1 minute</div>
          </div>
        </div>
        <button onClick={handleSkip} className="text-sm font-bold text-muted-foreground hover:text-foreground px-4 py-2 hover:bg-muted rounded-full transition-colors">
          Skip
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="h-full bg-foreground rounded-full"
          initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>

      {/* Dynamic Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
            {step === 5 && <Step5 />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
