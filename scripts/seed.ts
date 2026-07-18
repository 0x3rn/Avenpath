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
  await db.delete(schema.subtopics);
  await db.delete(schema.topics);
  await db.delete(schema.terms);
  await db.delete(schema.subjects);
  await db.delete(schema.categories);
  await db.delete(schema.levels);
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
    const dirItems = fs.readdirSync(categoriesDir);
    const categoryDirs = dirItems.filter((file) => fs.statSync(path.join(categoriesDir, file)).isDirectory());
    const rootJsonFiles = dirItems.filter((file) => file.endsWith(".json")).map(f => path.join(categoriesDir, f));

    const allGroups = [];
    if (rootJsonFiles.length > 0) {
      allGroups.push({ categoryName: "general", files: rootJsonFiles });
    }
    for (const dir of categoryDirs) {
      allGroups.push({ categoryName: dir, files: getJsonFiles(path.join(categoriesDir, dir)) });
    }

    for (const group of allGroups) {
      console.log(`  Processing category: ${group.categoryName}`);
      const [category] = await db.insert(schema.categories).values({
        levelId: level.id,
        name: group.categoryName === "general" ? "General" : group.categoryName,
        slug: group.categoryName,
      }).returning();

      for (const file of group.files) {
        const content = fs.readFileSync(file, "utf-8");
        const data = JSON.parse(content);
        
        const baseSlug = path.basename(file, ".json");
        const subjectSlug = data.class ? `${baseSlug}-${data.class.toString().toLowerCase().replace(/\s+/g, "")}` : baseSlug;
        const name = data.subject || data.name || baseSlug || "Unknown Subject";
        
        // Ensure ID uniqueness across levels if not explicitly provided
        const subjectId = data.id || `${levelName}-${subjectSlug}`;
        
        console.log(`    Processing subject: ${name} (${subjectId})`);

        const [insertedSubject] = await db.insert(schema.subjects).values({
          id: subjectId,
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
        }).returning();

        let termsToProcess = data.terms || data.modules;
        if (!termsToProcess && data.topics && Array.isArray(data.topics)) {
          // If a subject doesn't have terms or modules, create a default term
          termsToProcess = [{
            id: "general",
            name: "General Curriculum",
            theme: "Core Topics",
            topics: data.topics
          }];
        }

        if (termsToProcess && Array.isArray(termsToProcess)) {
          for (const term of termsToProcess) {
            const [insertedTerm] = await db.insert(schema.terms).values({
              subjectId: insertedSubject.id,
              termId: term.id,
              name: term.name,
              theme: term.theme || "",
            }).returning();

            if (term.topics && Array.isArray(term.topics)) {
              for (const topic of term.topics) {
                const topicTitle = topic.title || topic.name || "Unknown Topic";
                const topicSlug = topic.slug || slugify(topicTitle);
                const [insertedTopic] = await db.insert(schema.topics).values({
                  termId: insertedTerm.id,
                  title: topicTitle,
                  slug: topicSlug,
                  order: topic.order || 1,
                }).returning();

                if (topic.subtopics && Array.isArray(topic.subtopics)) {
                  const subtopicsToInsert = [];
                  for (let i = 0; i < topic.subtopics.length; i++) {
                    const subtopicItem = topic.subtopics[i];
                    let subtopicTitle = "Unknown Subtopic";
                    let subtopicSlug = "";
                    
                    if (typeof subtopicItem === 'string') {
                      subtopicTitle = subtopicItem;
                      subtopicSlug = slugify(subtopicTitle);
                    } else if (typeof subtopicItem === 'object' && subtopicItem !== null) {
                      subtopicTitle = subtopicItem.title || subtopicItem.name || "Unknown Subtopic";
                      subtopicSlug = subtopicItem.slug || slugify(subtopicTitle);
                    }

                    subtopicsToInsert.push({
                      topicId: insertedTopic.id,
                      title: subtopicTitle,
                      slug: subtopicSlug,
                      order: i + 1,
                    });
                  }
                  
                  if (subtopicsToInsert.length > 0) {
                    await db.insert(schema.subtopics).values(subtopicsToInsert);
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
