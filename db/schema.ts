import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const levels = pgTable("levels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  levelId: integer("level_id").references(() => levels.id).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  level: one(levels, {
    fields: [categories.levelId],
    references: [levels.id],
  }),
  subjects: many(subjects),
}));

export const levelsRelations = relations(levels, ({ many }) => ({
  categories: many(categories),
}));

export const subjects = pgTable("subjects", {
  id: text("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  country: text("country").notNull(),
  curriculum: text("curriculum").notNull(),
  levelName: text("level_name").notNull(),
  className: text("class_name").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
});

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  category: one(categories, {
    fields: [subjects.categoryId],
    references: [categories.id],
  }),
  terms: many(terms),
}));

export const terms = pgTable("terms", {
  id: serial("id").primaryKey(),
  subjectId: text("subject_id").references(() => subjects.id).notNull(),
  termId: text("term_id").notNull(), // term1, term2
  name: text("name").notNull(), // First Term
  theme: text("theme"),
});

export const termsRelations = relations(terms, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [terms.subjectId],
    references: [subjects.id],
  }),
  topics: many(topics),
}));

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  termId: integer("term_id").references(() => terms.id).notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  order: integer("order").notNull(),
});

export const topicsRelations = relations(topics, ({ one, many }) => ({
  term: one(terms, {
    fields: [topics.termId],
    references: [terms.id],
  }),
  subtopics: many(subtopics),
}));

export const subtopics = pgTable("subtopics", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => topics.id).notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  order: integer("order").notNull(),
});

export const subtopicsRelations = relations(subtopics, ({ one }) => ({
  topic: one(topics, {
    fields: [subtopics.topicId],
    references: [topics.id],
  }),
}));

// --- User Profiles ---
export const userProfiles = pgTable("user_profiles", {
  id: text("id").primaryKey(), // Matches Supabase auth.users.id
  email: text("email").notNull().unique(), // Synced from auth
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  university: text("university"),
  major: text("major"),
  bio: text("bio"),
  learningGoals: jsonb("learning_goals").$type<string[]>(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  points: integer("points").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastActiveDate: timestamp("last_active_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  progress: many(userProgress),
  bookmarks: many(bookmarks),
  studySessions: many(studySessions),
  badges: many(userBadges),
  certificates: many(userCertificates),
}));

// --- Progress Tracking ---
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  subtopicId: integer("subtopic_id").references(() => subtopics.id, { onDelete: "cascade" }).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userProgress.userId],
    references: [userProfiles.id],
  }),
  subtopic: one(subtopics, {
    fields: [userProgress.subtopicId],
    references: [subtopics.id],
  }),
}));

// --- Study Sessions (Activity Tracking) ---
export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(userProfiles, {
    fields: [studySessions.userId],
    references: [userProfiles.id],
  }),
}));

// --- Bookmarks ---
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  subtopicId: integer("subtopic_id").references(() => subtopics.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(userProfiles, {
    fields: [bookmarks.userId],
    references: [userProfiles.id],
  }),
  subtopic: one(subtopics, {
    fields: [bookmarks.subtopicId],
    references: [subtopics.id],
  }),
}));

// --- Quizzes ---
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  subtopicId: integer("subtopic_id").references(() => subtopics.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }).notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(), 
  explanation: text("explanation"),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  quizId: integer("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }).notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// --- Community ---
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  subtopicId: integer("subtopic_id").references(() => subtopics.id, { onDelete: "cascade" }), 
  title: text("title").notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const discussionPosts = pgTable("discussion_posts", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").references(() => discussions.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Badges & Certificates ---
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(), // e.g. "Zap", "Flame"
  color: text("color").notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  badgeId: integer("badge_id").references(() => badges.id, { onDelete: "cascade" }).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userBadges.userId],
    references: [userProfiles.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const userCertificates = pgTable("user_certificates", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  certificateId: integer("certificate_id").references(() => certificates.id, { onDelete: "cascade" }).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const userCertificatesRelations = relations(userCertificates, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userCertificates.userId],
    references: [userProfiles.id],
  }),
  certificate: one(certificates, {
    fields: [userCertificates.certificateId],
    references: [certificates.id],
  }),
}));
