import fs from 'fs';
import path from 'path';

export interface Subtopic {
  id: string;
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
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  levels: string[];
  topics: Topic[];
  category?: string; // We'll inject this based on the folder
}

const CURRICULUM_DIR = path.join(process.cwd(), 'curriculum');

/**
 * Helper to read JSON files recursively
 */
function getJsonFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getJsonFiles(filePath, fileList);
    } else if (filePath.endsWith('.json')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

/**
 * Get all available levels (e.g. ['highschool', 'university'])
 */
export function getLevels(): string[] {
  if (!fs.existsSync(CURRICULUM_DIR)) return [];
  return fs.readdirSync(CURRICULUM_DIR).filter(file => {
    return fs.statSync(path.join(CURRICULUM_DIR, file)).isDirectory();
  });
}

/**
 * Get all categories across all levels, or just for a specific level.
 */
export function getCategories(level: string): string[] {
  const levelDir = path.join(CURRICULUM_DIR, level);
  if (!fs.existsSync(levelDir)) return [];
  return fs.readdirSync(levelDir).filter(file => {
    return fs.statSync(path.join(levelDir, file)).isDirectory();
  });
}

/**
 * Get all subjects for a specific level.
 * It reads curriculum/[level]/** /*.json
 */
export function getSubjectsByLevel(level: string): Subject[] {
  const levelDir = path.join(CURRICULUM_DIR, level);
  if (!fs.existsSync(levelDir)) return [];

  const files = getJsonFiles(levelDir);
  const subjects: Subject[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const data = JSON.parse(content) as Subject;
      
      // Inject category based on parent folder name
      const categoryDir = path.dirname(file);
      data.category = path.basename(categoryDir);
      
      subjects.push(data);
    } catch (e) {
      console.error(`Failed to parse curriculum file: ${file}`, e);
    }
  }

  return subjects;
}

/**
 * Get a specific subject by its slug within a level.
 */
export function getSubject(level: string, subjectSlug: string): Subject | null {
  const subjects = getSubjectsByLevel(level);
  return subjects.find(s => s.slug === subjectSlug) || null;
}

/**
 * Get a specific topic within a subject.
 */
export function getTopic(level: string, subjectSlug: string, topicSlug: string): Topic | null {
  const subject = getSubject(level, subjectSlug);
  if (!subject) return null;
  return subject.topics.find(t => t.slug === topicSlug) || null;
}

export function getSubtopic(level: string, subjectSlug: string, topicSlug: string, subtopicSlug: string): Subtopic | null {
  const topic = getTopic(level, subjectSlug, topicSlug);
  if (!topic) return null;
  return topic.subtopics.find(s => s.slug === subtopicSlug) || null;
}