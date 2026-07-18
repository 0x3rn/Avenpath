"use client";

import { useDroppable } from "@dnd-kit/core";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { Clock, CheckCircle2 } from "lucide-react";

function DroppableDay({ date, sessions, onToggleComplete }: { date: Date, sessions: any[], onToggleComplete: (id: number, current: boolean) => void }) {
  const dateStr = format(date, "yyyy-MM-dd");
  const { isOver, setNodeRef } = useDroppable({
    id: `date-${dateStr}`,
  });

  const daySessions = sessions.filter(s => {
    // Be robust with date objects vs strings
    const sessionDate = typeof s.scheduledDate === 'string' ? new Date(s.scheduledDate) : s.scheduledDate;
    return isSameDay(sessionDate, date);
  });

  return (
    <div 
      ref={setNodeRef}
      className={`min-h-[150px] p-4 rounded-3xl border transition-all ${isOver ? 'border-foreground bg-foreground/5 shadow-lg' : 'border-border bg-card/20'} ${isToday(date) ? 'ring-2 ring-primary border-transparent' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{format(date, "EEE")}</span>
        <span className={`text-lg font-extrabold ${isToday(date) ? 'text-primary' : 'text-foreground'}`}>
          {format(date, "d")}
        </span>
      </div>

      <div className="space-y-3">
        {daySessions.length === 0 && (
          <div className="text-xs text-muted-foreground/50 font-medium italic py-2 text-center">
            Drop here
          </div>
        )}
        {daySessions.map(session => (
          <div key={session.id} className={`p-3 rounded-xl text-sm font-bold border transition-all ${session.isCompleted ? 'bg-muted/50 border-transparent text-muted-foreground opacity-60' : 'bg-card border-border hover:border-foreground/30'}`}>
            <div className="flex items-start justify-between gap-2">
              <span className="leading-tight">{session.title}</span>
              <button onClick={() => onToggleComplete(session.id, session.isCompleted)} className="mt-0.5 text-muted-foreground hover:text-primary transition-colors">
                <CheckCircle2 className={`w-4 h-4 ${session.isCompleted ? 'text-green-500 fill-green-500/20' : ''}`} />
              </button>
            </div>
            {!session.isCompleted && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-medium">
                <Clock className="w-3 h-3" /> {session.durationMinutes} min
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarGrid({ sessions, onToggleComplete }: { sessions: any[], onToggleComplete: (id: number, current: boolean) => void }) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  return (
    <div className="bg-card/50 border border-border rounded-3xl p-6 h-[800px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold">This Week</h2>
          <p className="text-muted-foreground font-medium">{format(start, "MMMM d")} - {format(addDays(start, 6), "MMMM d, yyyy")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-y-auto hidden-scrollbar pb-4">
        {days.map(date => (
          <DroppableDay key={date.toISOString()} date={date} sessions={sessions} onToggleComplete={onToggleComplete} />
        ))}
      </div>
    </div>
  );
}
