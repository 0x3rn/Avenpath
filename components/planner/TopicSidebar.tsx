"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BookOpen, CalendarPlus, GripVertical } from "lucide-react";

function DraggableTopic({ topic, subjectSlug, onScheduleClick }: { topic: any, subjectSlug: string, onScheduleClick: (topic: any, subjectSlug: string) => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `topic-${topic.slug}`,
    data: { topic, subjectSlug }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center justify-between p-3 mb-2 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all group z-10 relative"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div {...listeners} {...attributes} className="cursor-grab hover:bg-muted p-1 rounded text-muted-foreground hover:text-foreground">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-bold truncate">{topic.name || topic.title}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {topic.estimatedHours || 1} hr
          </span>
        </div>
      </div>
      <button 
        onClick={() => onScheduleClick(topic, subjectSlug)}
        className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
        title="Schedule manually"
      >
        <CalendarPlus className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function TopicSidebar({ subjects, onScheduleClick }: { subjects: any[], onScheduleClick: (t: any, s: string) => void }) {
  // If no subjects, show a placeholder
  if (!subjects || subjects.length === 0) {
    return (
      <div className="border border-border rounded-3xl p-6 bg-card/50 h-full">
        <h3 className="font-bold text-lg mb-2">Your Curriculum</h3>
        <p className="text-sm text-muted-foreground">You haven't enrolled or bookmarked any subjects yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-3xl p-6 bg-card/50 h-[800px] overflow-y-auto hidden-scrollbar">
      <h3 className="font-extrabold text-xl mb-6">Curriculum Queue</h3>
      <p className="text-sm text-muted-foreground mb-6 font-medium">Drag topics to the calendar, or click the plus icon to schedule.</p>
      
      <div className="space-y-8">
        {subjects.map((subj) => (
          <div key={subj.slug}>
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subj.color || '#3B82F6' }} />
              {subj.name}
            </h4>
            <div className="space-y-1">
              {subj.topics?.slice(0, 10).map((topic: any) => (
                <DraggableTopic key={topic.slug} topic={topic} subjectSlug={subj.slug} onScheduleClick={onScheduleClick} />
              ))}
              {subj.topics?.length > 10 && (
                <div className="text-xs font-bold text-muted-foreground text-center pt-2">
                  + {subj.topics.length - 10} more topics
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
