import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const q = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, 624)
  });

  return NextResponse.json({ 
    rubricKeys: Object.keys(q?.rubric || {}),
    objective: q?.rubric?.objective?.length,
    subjective: q?.rubric?.subjective?.length,
    theory: q?.rubric?.theory?.length,
    rawTheory: q?.rubric?.theory
  });
}
