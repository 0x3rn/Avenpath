import { db } from "@/db";
import * as schema from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { cache } from "react";

export const getAdminSubjectsTree = cache(async () => {
  return await db.query.subjects.findMany({
    orderBy: (subjects, { asc }) => [asc(subjects.name)],
    with: {
      category: {
        with: {
          level: true
        }
      },
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

export const getAdminUniversityTree = cache(async () => {
  const levels = await db.query.levels.findMany({
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
          },
          courseShares: {
            with: {
              subject: {
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
      }
    }
  });

  // Merge course shares into subjects
  return levels.map(level => {
    return {
      ...level,
      categories: level.categories.map(category => {
        const sharedSubjects = (category.courseShares || []).map(cs => cs.subject);
        return {
          ...category,
          subjects: [...category.subjects, ...sharedSubjects].sort((a, b) => a.name.localeCompare(b.name))
        };
      })
    };
  });
});
