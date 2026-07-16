import { NextResponse } from "next/server";
import { getLevels, getSubjectsByLevel } from "@/lib/curriculum";

// Simple in-memory cache to avoid re-reading files on every keystroke
let cachedIndex: {
  subjects: any[];
  topics: any[];
  lessons: any[];
} | null = null;

async function buildSearchIndex() {
  if (cachedIndex) return cachedIndex;

  const subjects = [];
  const topics = [];
  const lessons = [];

  const levels = await getLevels();
  for (const level of levels) {
    const levelSubjects = await getSubjectsByLevel(level);
    for (const subject of levelSubjects) {
      // Add subject
      subjects.push({
        type: 'subject',
        name: subject.name,
        slug: subject.slug,
        icon: subject.icon,
        url: `/subjects/${level}/${subject.slug}`,
        breadcrumb: `${level}`
      });

      for (const topic of subject.topics) {
        // Add topic
        topics.push({
          type: 'topic',
          name: topic.name,
          slug: topic.slug,
          icon: 'BookOpen',
          url: `/subjects/${level}/${subject.slug}/${topic.slug}`,
          breadcrumb: `${subject.name} > ${topic.name}`
        });

        for (const lesson of topic.subtopics) {
          // Add lesson
          lessons.push({
            type: 'lesson',
            name: lesson.name,
            slug: lesson.slug,
            icon: 'FileText',
            url: `/subjects/${level}/${subject.slug}/${topic.slug}/${lesson.slug}`,
            breadcrumb: `${subject.name} > ${topic.name}`
          });
        }
      }
    }
  }

  cachedIndex = { subjects, topics, lessons };
  return cachedIndex;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  if (!q) {
    return NextResponse.json({ subjects: [], topics: [], lessons: [] });
  }

  const index = await buildSearchIndex();

  // Basic fuzzy search by name
  const filteredSubjects = index.subjects.filter(s => s.name.toLowerCase().includes(q)).slice(0, 4);
  const filteredTopics = index.topics.filter(t => t.name.toLowerCase().includes(q)).slice(0, 4);
  const filteredLessons = index.lessons.filter(l => l.name.toLowerCase().includes(q)).slice(0, 6);

  return NextResponse.json({
    subjects: filteredSubjects,
    topics: filteredTopics,
    lessons: filteredLessons
  });
}
