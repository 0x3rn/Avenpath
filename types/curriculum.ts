export interface Subtopic {
  id: string | number; // String if mock, number if DB
  name: string;
  slug: string;
  content?: string | null;
  quizzes?: any[];
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

export interface Term {
  id: string;
  name: string;
  theme: string | null;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  levelName: string;
  className: string;
  description: string;
  icon: string;
  color: string;
  levels: string[];
  topics: Topic[]; // kept for backwards compatibility
  terms: Term[];
  category?: string;
  categoryName?: string;
}
