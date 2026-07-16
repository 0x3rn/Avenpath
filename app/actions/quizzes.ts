"use server";

import { db } from "@/db";
import { quizzes, quizQuestions, quizAttempts, subtopics, subjects, topics, terms } from "@/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export async function getQuizStats() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const userId = data.user.id;

  const attempts = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userId));

  const completed = attempts.length;
  const totalQuestions = attempts.reduce((acc, a) => acc + a.totalQuestions, 0);
  const totalCorrect = attempts.reduce((acc, a) => acc + a.score, 0);
  
  const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  // Calculate streak (consecutive 100% scores for example, or just correct answers)
  let currentStreak = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].score === attempts[i].totalQuestions) {
      currentStreak += attempts[i].score;
    } else {
      currentStreak += attempts[i].score; // count just correct answers until a mistake
      break; 
    }
  }

  return {
    completed,
    avgScore,
    totalQuestions,
    currentStreak
  };
}

export async function getRecentQuizResults() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return [];

  const userId = data.user.id;

  const results = await db
    .select({
      id: quizAttempts.id,
      score: quizAttempts.score,
      totalQuestions: quizAttempts.totalQuestions,
      date: quizAttempts.completedAt,
      subjectName: subjects.name,
      quizTitle: quizzes.title
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .innerJoin(subtopics, eq(quizzes.subtopicId, subtopics.id))
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .innerJoin(subjects, eq(terms.subjectId, subjects.id))
    .where(eq(quizAttempts.userId, userId))
    .orderBy(desc(quizAttempts.completedAt))
    .limit(10);

  return results.map(r => {
    const percentage = Math.round((r.score / r.totalQuestions) * 100);
    return {
      ...r,
      percentage,
      rating: Math.ceil((percentage / 100) * 5)
    };
  });
}

export async function getAvailableQuizzes() {
  const results = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      subjectName: subjects.name,
      color: subjects.color
    })
    .from(quizzes)
    .innerJoin(subtopics, eq(quizzes.subtopicId, subtopics.id))
    .innerJoin(topics, eq(subtopics.topicId, topics.id))
    .innerJoin(terms, eq(topics.termId, terms.id))
    .innerJoin(subjects, eq(terms.subjectId, subjects.id));

  return results;
}

export async function getQuizById(quizId: number) {
  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
  if (quiz.length === 0) return null;

  const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId));
  
  return {
    ...quiz[0],
    questions
  };
}

export async function submitQuizAttempt(quizId: number, score: number, totalQuestions: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { success: false };

  await db.insert(quizAttempts).values({
    userId: data.user.id,
    quizId,
    score,
    totalQuestions
  });

  return { success: true };
}

export async function seedSampleQuizzes() {
  // Utility to auto-seed a quiz so we have something to test
  // First, find a subtopic
  const subs = await db.select().from(subtopics).limit(1);
  if (subs.length === 0) return; // DB empty

  const subId = subs[0].id;

  // Check if quiz already exists
  const existing = await db.select().from(quizzes).where(eq(quizzes.subtopicId, subId));
  if (existing.length > 0) return;

  // Insert quiz
  const q = await db.insert(quizzes).values({
    subtopicId: subId,
    title: "Basic Knowledge Test",
    description: "A quick test to see how well you grasped the introductory concepts."
  }).returning({ id: quizzes.id });

  const quizId = q[0].id;

  // Insert questions
  await db.insert(quizQuestions).values([
    {
      quizId,
      questionText: "What is the main concept of this lesson?",
      options: ["Concept A", "Concept B", "Concept C", "Concept D"],
      correctAnswer: 0,
      explanation: "Concept A is introduced in paragraph 1."
    },
    {
      quizId,
      questionText: "Which of the following is NOT true?",
      options: ["Fact 1", "Fact 2", "False Fact", "Fact 3"],
      correctAnswer: 2,
      explanation: "The False Fact is clearly stated as a misconception."
    },
    {
      quizId,
      questionText: "How do you apply this in practice?",
      options: ["Method 1", "Method 2", "Method 3", "All of the above"],
      correctAnswer: 3,
      explanation: "All methods listed are valid applications."
    }
  ]);
}
