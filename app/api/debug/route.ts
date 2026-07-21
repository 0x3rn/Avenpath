import { db } from "@/db";
import { subtopics } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const lessonId = 99085;
  const lesson = await db.query.subtopics.findFirst({
    where: eq(subtopics.id, lessonId),
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

  return NextResponse.json({ lesson });
}
