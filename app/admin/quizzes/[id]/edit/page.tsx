import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { notFound } from "next/navigation";
import QuizEditor from "./QuizEditor";

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quizId = parseInt(id, 10);
  
  if (isNaN(quizId)) {
    notFound();
  }

  const quiz = await db.query.quizzes.findFirst({
    where: eq(schema.quizzes.id, quizId),
  });

  if (!quiz) {
    notFound();
  }

  const questions = await db.query.quizQuestions.findMany({
    where: eq(schema.quizQuestions.quizId, quizId)
  });

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <QuizEditor quiz={quiz} initialQuestions={questions} />
    </div>
  );
}
