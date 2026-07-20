import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
import type { Subject, Term, Topic, Subtopic } from "../types/curriculum";

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
    const terms: Term[] = [];
    
    for (const term of s.terms) {
      const termTopics: Topic[] = [];
      for (const t of term.topics) {
        const topicObj = {
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
        };
        topics.push(topicObj);
        termTopics.push(topicObj);
      }
      
      terms.push({
        id: term.termId,
        name: term.name,
        theme: term.theme,
        topics: termTopics
      });
    }

    // Capitalize slug if name is stored as lowercase slug in DB
    const formatName = (name: string) => name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    result.push({
      id: s.id,
      name: formatName(s.name),
      slug: s.slug,
      levelName: s.levelName,
      className: s.className,
      description: s.description || "",
      icon: s.icon || "BookOpen",
      color: s.color || "#3b82f6",
      levels: [levelSlug],
      category: s.category.slug,
      topics,
      terms
    });
  }

  return result;
}

export async function getSubject(levelSlug: string, subjectSlug: string): Promise<Subject | null> {
  const subjects = await getSubjectsByLevel(levelSlug);
  return subjects.find(s => s.slug === subjectSlug) || null;
}

export function getSubjectGroupId(slug: string) {
  return slug.replace(/-class\d+/, '');
}

export async function getSubjectsGroup(levelSlug: string, baseSlug: string): Promise<Subject[]> {
  const subjects = await getSubjectsByLevel(levelSlug);
  return subjects.filter(s => getSubjectGroupId(s.slug) === baseSlug || s.slug === baseSlug);
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

export async function getSubtopicWithContent(subtopicSlug: string) {
  const st = await db.query.subtopics.findFirst({
    where: eq(schema.subtopics.slug, subtopicSlug)
  });
  
  if (!st) return null;
  
  const quizzesData = await db.query.quizzes.findMany({
    where: eq(schema.quizzes.subtopicId, st.id)
  });
  
  return { ...st, name: st.title, quizzes: quizzesData };
}