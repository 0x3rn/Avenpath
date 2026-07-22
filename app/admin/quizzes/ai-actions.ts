"use server";

import { db } from "@/db";
import { quizzes, quizQuestions, subtopics, terms, subjects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateTestAndRubric, generateExamAndRubric } from "@/app/actions/ai-test-actions";

/**
 * Admin Action: Generate and save an official 20-question test for a specific lesson subtopic
 */
export async function generateOfficialTestForSubtopic(subtopicId: number) {
  const sub = await db.query.subtopics.findFirst({
    where: eq(subtopics.id, subtopicId),
    with: {
      topic: {
        with: {
          term: {
            with: {
              subject: true
            }
          }
        }
      }
    }
  });

  if (!sub || !sub.content) {
    throw new Error("Subtopic not found or has no content to generate a test.");
  }

  const subjectObj = sub.topic?.term?.subject;
  const levelInfo = subjectObj ? `${subjectObj.levelName} (${subjectObj.className || "Standard Class"})` : undefined;

  // 1. Generate full 20-question rubric (10 MCQ, 5 Subjective, 5 Theory) with Age/Grade Calibration
  const rubric = await generateTestAndRubric(sub.content, levelInfo);

  // 2. Check if official test quiz record exists
  const existingQuizzes = await db.query.quizzes.findMany({
    where: eq(quizzes.subtopicId, subtopicId)
  });

  let quizId: number;
  if (existingQuizzes.length > 0) {
    quizId = existingQuizzes[0].id;
    await db.update(quizzes).set({
      title: `${sub.title} Official Test`,
      assessmentType: "test",
      rubric: rubric
    }).where(eq(quizzes.id, quizId));

    // Clear existing questions for refresh
    await db.delete(quizQuestions).where(eq(quizQuestions.quizId, quizId));
  } else {
    const inserted = await db.insert(quizzes).values({
      subtopicId,
      topicId: sub.topicId,
      assessmentType: "test",
      title: `${sub.title} Official Test`,
      rubric: rubric
    }).returning({ id: quizzes.id });
    quizId = inserted[0].id;
  }

  // 3. Save all questions to quiz_questions table for UI stats & preview
  const optionKeys = ["A", "B", "C", "D"];
  let allQuestionRows: any[] = [];

  if (rubric.objective) {
    allQuestionRows = allQuestionRows.concat(rubric.objective.map((obj: any) => ({
      quizId,
      questionType: "objective",
      questionText: obj.question,
      options: [obj.options.A || "", obj.options.B || "", obj.options.C || "", obj.options.D || ""],
      correctAnswer: optionKeys.indexOf(obj.correct_answer),
      explanation: `Correct Answer: ${obj.correct_answer}. Derived strictly from lesson notes.`
    })));
  }

  if (rubric.subjective) {
    allQuestionRows = allQuestionRows.concat(rubric.subjective.map((q: any) => ({
      quizId,
      questionType: "subjective",
      questionText: q.question,
      idealAnswer: q.ideal_answer,
      acceptableAnswers: q.acceptable_answers || [],
      explanation: ""
    })));
  }

  if (rubric.theory) {
    allQuestionRows = allQuestionRows.concat(rubric.theory.map((q: any) => ({
      quizId,
      questionType: "theory",
      questionText: q.question,
      idealAnswer: q.ideal_answer,
      crucialDetails: q.crucial_details || [],
      explanation: ""
    })));
  }

  if (allQuestionRows.length > 0) {
    await db.insert(quizQuestions).values(allQuestionRows);
  }

  return { success: true, quizId, rubric };
}

/**
 * Admin Action: Generate and save an official 50-question exam for a range of modules (terms)
 * Collects all lesson notes from startTermId to endTermId (inclusive), calls generateExamAndRubric,
 * and attaches the resulting exam to endTermId in PostgreSQL.
 */
export async function generateOfficialExamForRange(
  subjectId: string,
  startTermId: number,
  endTermId: number,
  examTitle?: string
) {
  // 1. Fetch terms, topics, and subtopics for this subject
  const termsList = await db.query.terms.findMany({
    where: eq(terms.subjectId, subjectId),
    orderBy: (terms, { asc }) => [asc(terms.id)],
    with: {
      topics: {
        with: {
          subtopics: true
        }
      }
    }
  });

  const startIdx = termsList.findIndex(t => t.id === startTermId);
  const endIdx = termsList.findIndex(t => t.id === endTermId);

  if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
    throw new Error("Invalid module range selected. Start module must come before or be the same as end module.");
  }

  const selectedTerms = termsList.slice(startIdx, endIdx + 1);
  const startTerm = selectedTerms[0];
  const endTerm = selectedTerms[selectedTerms.length - 1];

  // 2. Aggregate all lesson notes across the selected module range
  let aggregatedNotes = "";
  selectedTerms.forEach(t => {
    t.topics.forEach(tp => {
      tp.subtopics.forEach(st => {
        if (st.content && st.content.trim().length > 20) {
          aggregatedNotes += `\n\n--- Module: ${t.name} | Topic: ${tp.title} | Lesson: ${st.title} ---\n${st.content}`;
        }
      });
    });
  });

  if (!aggregatedNotes.trim()) {
    throw new Error("No lesson notes found in the selected module range.");
  }

  // 3. Fetch Subject Details for Grade Calibration
  const parentSubject = await db.query.subjects.findFirst({
    where: eq(subjects.id, subjectId)
  });
  const levelInfo = parentSubject ? `${parentSubject.levelName} (${parentSubject.className || "Standard Class"})` : undefined;

  // 4. Generate 50-Question Exam via DeepSeek with Grade & Age Calibration (max_tokens: 8000)
  const rubric = await generateExamAndRubric(aggregatedNotes, levelInfo);
  const title = examTitle || `Official Exam (${startTerm.name} - ${endTerm.name})`;

  // 4. Save into quizzes table attached to endTerm.id (endModuleId)
  const inserted = await db.insert(quizzes).values({
    termId: endTerm.id,
    assessmentType: "exam",
    title,
    rubric: rubric
  }).returning({ id: quizzes.id });

  const quizId = inserted[0].id;

  // 5. Save all questions to quiz_questions table for preview stats
  const optionKeys = ["A", "B", "C", "D"];
  let allQuestionRows: any[] = [];

  if (rubric.objective) {
    allQuestionRows = allQuestionRows.concat(rubric.objective.map((obj: any) => ({
      quizId,
      questionType: "objective",
      questionText: obj.question,
      options: [obj.options.A || "", obj.options.B || "", obj.options.C || "", obj.options.D || ""],
      correctAnswer: optionKeys.indexOf(obj.correct_answer),
      explanation: `Derived strictly from ${startTerm.name} to ${endTerm.name} notes.`
    })));
  }

  if (rubric.subjective) {
    allQuestionRows = allQuestionRows.concat(rubric.subjective.map((q: any) => ({
      quizId,
      questionType: "subjective",
      questionText: q.question,
      idealAnswer: q.ideal_answer,
      acceptableAnswers: q.acceptable_answers || [],
      explanation: ""
    })));
  }

  if (rubric.theory) {
    allQuestionRows = allQuestionRows.concat(rubric.theory.map((q: any) => ({
      quizId,
      questionType: "theory",
      questionText: q.question,
      idealAnswer: q.ideal_answer,
      crucialDetails: q.crucial_details || [],
      explanation: ""
    })));
  }

  if (allQuestionRows.length > 0) {
    await db.insert(quizQuestions).values(allQuestionRows);
  }

  return { 
    success: true, 
    quizId, 
    title,
    endTermId: endTerm.id,
    endTermName: endTerm.name,
    rubric 
  };
}
