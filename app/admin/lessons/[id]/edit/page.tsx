import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { notFound } from "next/navigation";
import LessonEditor from "./LessonEditor";

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lessonId = parseInt(id, 10);
  
  if (isNaN(lessonId)) {
    notFound();
  }

  const lesson = await db.query.subtopics.findFirst({
    where: eq(schema.subtopics.id, lessonId),
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

  if (!lesson) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <LessonEditor lesson={lesson} />
    </div>
  );
}
