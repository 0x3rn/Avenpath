import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "../db/schema";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL not set in .env.local");
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

const CURRICULUM_DIR = path.join(process.cwd(), "curriculum");

function getJsonFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getJsonFiles(filePath, fileList);
    } else if (filePath.endsWith(".json")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function generateColor(subjectName: string | undefined) {
  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
  if (!subjectName) return colors[0];
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

async function main() {
  console.log("Starting seed...");

  // First, clear existing data
  console.log("Clearing existing data...");
  await db.execute(sql`TRUNCATE TABLE subtopics, topics, terms, subjects, categories, levels CASCADE;`);
  console.log("Data cleared.");

  // Discover levels
  const levelNames = fs.readdirSync(CURRICULUM_DIR).filter((file) => fs.statSync(path.join(CURRICULUM_DIR, file)).isDirectory());
  
  for (const levelName of levelNames) {
    console.log(`Processing level: ${levelName}`);
    const [level] = await db.insert(schema.levels).values({
      name: levelName,
      slug: levelName,
    }).returning();

    const categoriesDir = path.join(CURRICULUM_DIR, levelName);
    const categoryNames = fs.readdirSync(categoriesDir).filter((file) => fs.statSync(path.join(categoriesDir, file)).isDirectory());

    for (const categoryName of categoryNames) {
      console.log(`  Processing category: ${categoryName}`);
      const [category] = await db.insert(schema.categories).values({
        levelId: level.id,
        name: categoryName,
        slug: categoryName,
      }).returning();

      const categoryDir = path.join(categoriesDir, categoryName);
      const jsonFiles = getJsonFiles(categoryDir);

      for (const file of jsonFiles) {
        const content = fs.readFileSync(file, "utf-8");
        const data = JSON.parse(content);
        
        const baseSlug = path.basename(file, ".json");
        const subjectSlug = data.class ? `${baseSlug}-${data.class.toString().toLowerCase().replace(/\s+/g, "")}` : baseSlug;
        const name = data.subject || baseSlug || "Unknown Subject";
        console.log(`    Processing subject: ${name} (${subjectSlug})`);

        await db.insert(schema.subjects).values({
          id: data.id || subjectSlug,
          categoryId: category.id,
          country: data.country || "",
          curriculum: data.curriculum || "",
          levelName: data.level || "",
          className: data.class || "",
          name: name,
          slug: subjectSlug,
          description: `Comprehensive curriculum for ${name}.`,
          icon: "BookOpen", // Default icon
          color: generateColor(name),
        });

        if (data.terms && Array.isArray(data.terms)) {
          for (const term of data.terms) {
            const [insertedTerm] = await db.insert(schema.terms).values({
              subjectId: data.id,
              termId: term.id,
              name: term.name,
              theme: term.theme || "",
            }).returning();

            if (term.topics && Array.isArray(term.topics)) {
              for (const topic of term.topics) {
                const topicSlug = topic.slug || slugify(topic.title);
                const [insertedTopic] = await db.insert(schema.topics).values({
                  termId: insertedTerm.id,
                  title: topic.title,
                  slug: topicSlug,
                  order: topic.order || 1,
                }).returning();

                if (topic.subtopics && Array.isArray(topic.subtopics)) {
                  for (let i = 0; i < topic.subtopics.length; i++) {
                    const subtopicStr = topic.subtopics[i];
                    await db.insert(schema.subtopics).values({
                      topicId: insertedTopic.id,
                      title: subtopicStr,
                      slug: slugify(subtopicStr),
                      order: i + 1,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  console.log("Seed completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
