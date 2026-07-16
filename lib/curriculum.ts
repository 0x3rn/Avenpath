import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";

export interface Subtopic {
  id: string; // Used slug as ID
  name: string;
  slug: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  estimatedHours: number;
  prerequisites: string[];
  subtopics: Subtopic[];
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  levels: string[];
  topics: Topic[];
  category?: string;
}

export async function getLevels(): Promise<string[]> {
  const allLevels = await db.query.levels.findMany();
  return allLevels.map((l) => l.slug);
}

export async function getCategories(levelSlug: string): Promise<string[]> {
  const level = await db.query.levels.findFirst({
    where: eq(schema.levels.slug, levelSlug)
  });
  if (!level) return [];

  const cats = await db.query.categories.findMany({
    where: eq(schema.categories.levelId, level.id)
  });
  return cats.map((c) => c.slug);
}

export async function getSubjectsByLevel(levelSlug: string): Promise<Subject[]> {
  const level = await db.query.levels.findFirst({
    where: eq(schema.levels.slug, levelSlug)
  });
  if (!level) return [];

  const subjectsWithRelations = await db.query.subjects.findMany({
    with: {
      category: true,
      terms: {
        with: {
          topics: {
            with: {
              subtopics: true
            }
          }
        }
      }
    }
  });

  // Filter subjects by levelSlug manually (since filtering by nested relation is complex)
  // or we can join, but we already have category.levelId which we could filter if we fetch categories first.
  const cats = await db.query.categories.findMany({
    where: eq(schema.categories.levelId, level.id)
  });
  const catIds = cats.map(c => c.id);

  const filteredSubjects = subjectsWithRelations.filter(s => catIds.includes(s.categoryId));

  const result: Subject[] = [];
  
  for (const s of filteredSubjects) {
    const topics: Topic[] = [];
    
    // Flatten topics from all terms
    for (const term of s.terms) {
      for (const t of term.topics) {
        topics.push({
          id: t.slug,
          name: t.title,
          slug: t.slug,
          description: "", // Fallback
          estimatedHours: 2, // Fallback
          prerequisites: [], // Fallback
          subtopics: t.subtopics.map(st => ({
            id: st.slug,
            name: st.title,
            slug: st.slug
          }))
        });
      }
    }

    result.push({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description || "",
      icon: s.icon || "BookOpen",
      color: s.color || "#3b82f6",
      levels: [levelSlug],
      category: s.category.slug,
      topics
    });
  }

  return result;
}

export async function getSubject(levelSlug: string, subjectSlug: string): Promise<Subject | null> {
  const subjects = await getSubjectsByLevel(levelSlug);
  return subjects.find(s => s.slug === subjectSlug) || null;
}

export async function getTopic(levelSlug: string, subjectSlug: string, topicSlug: string): Promise<Topic | null> {
  const subject = await getSubject(levelSlug, subjectSlug);
  if (!subject) return null;
  return subject.topics.find(t => t.slug === topicSlug) || null;
}

export async function getSubtopic(levelSlug: string, subjectSlug: string, topicSlug: string, subtopicSlug: string): Promise<Subtopic | null> {
  const topic = await getTopic(levelSlug, subjectSlug, topicSlug);
  if (!topic) return null;
  return topic.subtopics.find(s => s.slug === subtopicSlug) || null;
}