"use server";

import { createClient } from "@/utils/supabase/server";

export async function getHomepageStats() {
  try {
    const supabase = await createClient();

    const { count: subjCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });
    const { count: topCount } = await supabase.from('topics').select('*', { count: 'exact', head: true });
    const { count: lessCount } = await supabase.from('subtopics').select('*', { count: 'exact', head: true });
    const { count: quizQCount } = await supabase.from('quiz_questions').select('*', { count: 'exact', head: true });

    const { data: subtopicsWithFlashcards } = await supabase.from('subtopics').select('flashcards').not('flashcards', 'is', null);
    
    let flashcardCount = 0;
    if (subtopicsWithFlashcards) {
      for (const st of subtopicsWithFlashcards) {
        if (Array.isArray(st.flashcards)) {
          flashcardCount += st.flashcards.length;
        }
      }
    }

    const totalQuestions = (quizQCount || 0) + flashcardCount;

    const { data: sessions } = await supabase.from('study_sessions').select('duration_minutes');
    let studyHours = 0;
    if (sessions) {
      const totalMins = sessions.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
      studyHours = Math.floor(totalMins / 60);
    }

    return {
      subjects: subjCount || 0,
      topics: topCount || 0,
      lessons: lessCount || 0,
      questions: totalQuestions,
      studyHours: studyHours
    };
  } catch (error) {
    console.error("Error fetching homepage stats:", error);
    return {
      subjects: 0,
      topics: 0,
      lessons: 0,
      questions: 0,
      studyHours: 0
    };
  }
}
