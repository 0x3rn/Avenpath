import { db } from "../db";
import * as schema from "../db/schema";
import { eq, inArray, and } from "drizzle-orm";
import type { Subject, Term, Topic, Subtopic } from "../types/curriculum";
import { cache } from "react";

export const getLevels = cache(async (): Promise<string[]> => {
  const allLevels = await db.query.levels.findMany();
  return allLevels.map((l) => l.slug);
});

export const getRegions = cache(async (): Promise<string[]> => {
  const allLevels = await db.query.levels.findMany();
  const regions = new Set(allLevels.map(l => l.region).filter(r => r !== 'nigerian-university'));
  return Array.from(regions);
});

export const getLevelsByRegion = cache(async (regionSlug: string): Promise<any[]> => {
  return await db.query.levels.findMany({
    where: eq(schema.levels.region, regionSlug)
  });
});

export const getCategories = cache(async (levelSlug: string): Promise<string[]> => {
  const level = await db.query.levels.findFirst({
    where: eq(schema.levels.slug, levelSlug)
  });
  if (!level) return [];

  const cats = await db.query.categories.findMany({
    where: eq(schema.categories.levelId, level.id)
  });
  return cats.map((c) => c.slug);
});

function formatSubjectHelper(s: any, levelSlug: string, regionSlug: string): Subject {
  const topics: Topic[] = [];
  const terms: Term[] = [];
  
  if (s.terms) {
    for (const term of s.terms) {
      const termTopics: Topic[] = [];
      if (term.topics) {
        for (const t of term.topics) {
          const topicObj = {
            id: t.slug,
            name: t.title,
            slug: t.slug,
            description: t.summary || "",
            estimatedHours: 2,
            prerequisites: [],
            subtopics: (t.subtopics || []).map((st: any) => ({
              id: st.slug,
              name: st.title,
              slug: st.slug,
              content: st.content
            }))
          };
          topics.push(topicObj);
          termTopics.push(topicObj);
        }
      }
      
      terms.push({
        id: term.termId,
        name: term.name,
        theme: term.theme,
        topics: termTopics
      });
    }
  }

  const formatName = (name: string) => name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    id: s.id,
    name: formatName(s.name),
    slug: s.slug,
    levelName: s.levelName,
    className: s.className,
    description: s.description || "",
    icon: s.icon || "BookOpen",
    color: s.color || "#3b82f6",
    levels: [levelSlug],
    category: s.category?.slug || "",
    categoryName: s.category?.name || "",
    regionSlug,
    topics,
    terms
  };
}

export const getSubjectsByLevel = cache(async (levelSlug: string): Promise<Subject[]> => {
  const level = await db.query.levels.findFirst({
    where: eq(schema.levels.slug, levelSlug)
  });
  if (!level) return [];

  const cats = await db.query.categories.findMany({
    where: eq(schema.categories.levelId, level.id)
  });
  if (cats.length === 0) return [];
  const catIds = cats.map(c => c.id);

  const subjectsWithRelations = await db.query.subjects.findMany({
    where: inArray(schema.subjects.categoryId, catIds),
    with: {
      category: true,
      terms: {
        orderBy: (terms, { asc }) => [asc(terms.id)],
        with: {
          topics: {
            orderBy: (topics, { asc }) => [asc(topics.order)],
            with: {
              subtopics: {
                where: (subtopics, { eq }) => eq(subtopics.isPublished, true),
                orderBy: (subtopics, { asc }) => [asc(subtopics.order)]
              }
            }
          }
        }
      }
    }
  });

  return subjectsWithRelations.map(s => formatSubjectHelper(s, levelSlug, level.region));
});

export const getSubject = cache(async (levelSlug: string, subjectSlug: string): Promise<Subject | null> => {
  const s = await db.query.subjects.findFirst({
    where: eq(schema.subjects.slug, subjectSlug),
    with: {
      category: true,
      terms: {
        orderBy: (terms, { asc }) => [asc(terms.id)],
        with: {
          topics: {
            orderBy: (topics, { asc }) => [asc(topics.order)],
            with: {
              subtopics: {
                where: (subtopics, { eq }) => eq(subtopics.isPublished, true),
                orderBy: (subtopics, { asc }) => [asc(subtopics.order)]
              }
            }
          }
        }
      }
    }
  });

  if (!s) return null;
  const level = await db.query.levels.findFirst({ where: eq(schema.levels.slug, levelSlug) });
  return formatSubjectHelper(s, levelSlug, level?.region || 'international');
});

export function getSubjectGroupId(slug: string) {
  return slug.replace(/-class\d+/, '');
}

export const getSubjectsGroup = cache(async (levelSlug: string, baseSlug: string): Promise<Subject[]> => {
  const subjects = await getSubjectsByLevel(levelSlug);
  return subjects.filter(s => getSubjectGroupId(s.slug) === baseSlug || s.slug === baseSlug);
});

export const getTopic = cache(async (levelSlug: string, subjectSlug: string, topicSlug: string): Promise<Topic | null> => {
  const subject = await getSubject(levelSlug, subjectSlug);
  if (!subject) return null;
  return subject.topics.find(t => t.slug === topicSlug) || null;
});

export const getSubtopic = cache(async (levelSlug: string, subjectSlug: string, topicSlug: string, subtopicSlug: string): Promise<Subtopic | null> => {
  const topic = await getTopic(levelSlug, subjectSlug, topicSlug);
  if (!topic) return null;
  return topic.subtopics.find(s => s.slug === subtopicSlug) || null;
});

export const getSubtopicWithContent = cache(async (subtopicSlug: string) => {
  const st = await db.query.subtopics.findFirst({
    where: and(eq(schema.subtopics.slug, subtopicSlug), eq(schema.subtopics.isPublished, true))
  });
  
  if (!st) return null;
  
  const quizzesData = await db.query.quizzes.findMany({
    where: eq(schema.quizzes.subtopicId, st.id)
  });
  
  return { ...st, name: st.title, quizzes: quizzesData };
});

export const getPublicUniversityTree = cache(async () => {
  return await db.query.levels.findMany({
    where: eq(schema.levels.region, 'nigerian-university'),
    orderBy: (levels, { asc }) => [asc(levels.name)],
    with: {
      categories: {
        orderBy: (categories, { asc }) => [asc(categories.slug)],
        with: {
          subjects: {
            orderBy: (subjects, { asc }) => [asc(subjects.name)],
            with: {
              terms: {
                orderBy: (terms, { asc }) => [asc(terms.id)]
              }
            }
          }
        }
      }
    }
  });
});