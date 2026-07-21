import { db } from "@/db";
import { subtopics } from "@/db/schema";
import { eq } from "drizzle-orm";
import FlashcardEditor from "./FlashcardEditor";
import { notFound } from "next/navigation";

export default async function EditFlashcardsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subtopicId = parseInt(id);
  if (isNaN(subtopicId)) notFound();

  const lesson = await db.query.subtopics.findFirst({
    where: eq(subtopics.id, subtopicId),
  });

  if (!lesson) notFound();

  return <FlashcardEditor lesson={lesson} />;
}
