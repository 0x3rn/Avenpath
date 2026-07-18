"use client";

import { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TopicSidebar from "./TopicSidebar";
import CalendarGrid from "./CalendarGrid";
import { scheduleSession } from "@/app/actions/planner";
import { updateSessionComplete } from "@/app/actions/planner";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

export default function PlannerClient({ userSubjects, initialSessions }: { userSubjects: any[], initialSessions: any[] }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeTopic, setActiveTopic] = useState<any>(null);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<{topic: any, subjectSlug: string} | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveTopic(active.data.current?.topic);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveTopic(null);

    if (!over) return;

    const topic = active.data.current?.topic;
    const subjectSlug = active.data.current?.subjectSlug;
    const dateStr = over.id; // The drop zone ID is the date string YYYY-MM-DD

    if (topic && dateStr.startsWith("date-")) {
      const scheduledDate = dateStr.replace("date-", "");
      
      // Optimistic UI update
      const newSession = {
        id: Math.random(),
        title: topic.name || topic.title,
        topicSlug: topic.slug,
        subjectSlug,
        scheduledDate: new Date(scheduledDate),
        isCompleted: false,
        durationMinutes: 60
      };
      
      setSessions((prev) => [...prev, newSession]);
      toast.success(`Scheduled for ${format(new Date(scheduledDate), "MMM do")}`);

      try {
        await scheduleSession(subjectSlug, topic.slug, topic.name || topic.title, scheduledDate);
      } catch (error) {
        toast.error("Failed to schedule session");
        setSessions((prev) => prev.filter(s => s.id !== newSession.id)); // revert
      }
    }
  };

  const handleToggleComplete = async (id: number, current: boolean) => {
    // Optimistic UI
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isCompleted: !current } : s));
    try {
      await updateSessionComplete(id, !current);
    } catch {
      toast.error("Failed to update status");
      setSessions(prev => prev.map(s => s.id === id ? { ...s, isCompleted: current } : s));
    }
  };

  const handleManualScheduleClick = (topic: any, subjectSlug: string) => {
    setSelectedTopic({ topic, subjectSlug });
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    setModalOpen(true);
  };

  const submitManualSchedule = async () => {
    if (!selectedTopic || !selectedDate) return;
    setModalOpen(false);
    
    const { topic, subjectSlug } = selectedTopic;
    const newSession = {
      id: Math.random(),
      title: topic.name || topic.title,
      topicSlug: topic.slug,
      subjectSlug,
      scheduledDate: new Date(selectedDate),
      isCompleted: false,
      durationMinutes: 60
    };
    
    setSessions((prev) => [...prev, newSession]);
    toast.success(`Scheduled for ${format(new Date(selectedDate), "MMM do")}`);

    try {
      await scheduleSession(subjectSlug, topic.slug, topic.name || topic.title, selectedDate);
    } catch (error) {
      toast.error("Failed to schedule session");
      setSessions((prev) => prev.filter(s => s.id !== newSession.id));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TopicSidebar subjects={userSubjects} onScheduleClick={handleManualScheduleClick} />
        </div>
        <div className="lg:col-span-3">
          <CalendarGrid sessions={sessions} onToggleComplete={handleToggleComplete} />
        </div>
      </div>
      <DragOverlay>
        {activeTopic ? (
          <div className="p-4 bg-foreground text-background rounded-xl shadow-2xl text-sm font-bold opacity-90 cursor-grabbing">
            {activeTopic.name || activeTopic.title}
          </div>
        ) : null}
      </DragOverlay>

      {/* Manual Schedule Modal */}
      {modalOpen && selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-extrabold mb-2">Schedule Topic</h3>
            <p className="text-sm font-bold text-muted-foreground mb-6 line-clamp-2">{selectedTopic.topic.name || selectedTopic.topic.title}</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Select Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-border font-bold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitManualSchedule}
                className="flex-1 px-4 py-3 rounded-xl bg-foreground text-background font-bold shadow-md hover:bg-foreground/90 transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
