import { db } from "@/db";
import * as schema from "@/db/schema";
import { sql } from "drizzle-orm";
import { cache } from "react";

export const getAdminSubjectsTree = cache(async () => {
  return await db.query.subjects.findMany({
    orderBy: (subjects, { asc }) => [asc(subjects.name)],
    with: {
      terms: {
        orderBy: (terms, { asc }) => [asc(terms.id)],
        with: {
          topics: {
            orderBy: (topics, { asc }) => [asc(topics.order)],
            with: {
              subtopics: {
                columns: {
                  id: true,
                  title: true,
                  slug: true,
                  order: true,
                  topicId: true,
                },
                orderBy: (subtopics, { asc }) => [asc(subtopics.order)]
              }
            }
          }
        }
      }
    }
  });
});

export const getAdminLevelsTree = cache(async () => {
  return await db.query.levels.findMany({
    orderBy: (levels, { asc }) => [asc(levels.name)],
    with: {
      categories: {
        orderBy: (categories, { asc }) => [asc(categories.slug)],
        with: {
          subjects: {
            orderBy: (subjects, { asc }) => [asc(subjects.name)],
            with: {
              terms: {
                with: {
                  topics: {
                    with: {
                      subtopics: {
                        columns: {
                          id: true,
                          title: true,
                          slug: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
});
