"use server";

import { db } from "@/db";
import { subtopics } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function generateLessonNotes(title: string, outline?: string): Promise<string> {
  const systemPrompt = `You are an expert Educational Content Creator for "Avenpath," a top-tier EdTech platform.
Your task is to write comprehensive, beautifully structured, engaging, and clear lesson notes in Markdown format based on the provided title and outline.

STRICT INSTRUCTIONS:
1. Format strictly using Markdown (headers #, ##, ###, bullet points, bold text, code blocks if relevant).
2. Make the content extremely rich, highly educational, easy to understand, and thorough.
3. Include real-world examples, key terms, definitions, and clear explanations.
4. Exclude All Assessments: Completely ignore and remove any quizzes, test questions, exercises, homework assignments, or practice problems found in the source text.
5. Return ONLY the Markdown content. Do NOT wrap it in a code block like \`\`\`markdown.`;

  const userPrompt = `Write full, detailed lesson notes for the topic: "${title}".
${outline ? `Outline / Key Points to cover:\n${outline}` : ""}`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("DeepSeek API Error:", errorData);
    throw new Error("Failed to generate lesson notes with DeepSeek");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function generateLessonContent(
  titleOrText: string,
  outlineOrAudience?: string,
  moduleTitle?: string,
  topicTitle?: string,
  lessonTitle?: string
): Promise<string> {
  const combinedTitle = lessonTitle || titleOrText;
  const combinedOutline = [outlineOrAudience, moduleTitle, topicTitle].filter(Boolean).join(" • ");
  return generateLessonNotes(combinedTitle, combinedOutline || undefined);
}

export async function extractTextFromPDF(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }
  const buffer = await file.arrayBuffer();
  const text = new TextDecoder().decode(buffer);
  return text;
}

export async function generateFlashcards(lessonNotes: string, levelInfo?: string): Promise<any[]> {
  const targetLevelText = levelInfo ? `\nTarget Level & Class: ${levelInfo}` : "";

  const systemPrompt = `You are an expert Educational Content Creator for "Avenpath," a top-tier EdTech platform.
Your task is to read the provided lesson notes and generate a set of highly effective study flashcards.

GRADE & AGE CALIBRATION DIRECTIVE (CRITICAL):
Calibrate question difficulty, vocabulary, and conceptual depth strictly to the target education level and specific class grade:
- Primary School (Ages 6–11):
  * Lower Primary (e.g. Primary 1–3, Ages 6–8): Use clear, simple language, encouraging phrasing, direct factual questions, and foundational concepts suitable for young learners.
  * Upper Primary (e.g. Primary 4–6, Ages 9–11): Introduce age-appropriate analytical questions, structured vocabulary, and step-by-step reasoning while maintaining an accessible tone.
- High School (Ages 12–16+):
  * Junior High (e.g. JSS 1–3 / Grades 7–9, Ages 12–14): Focus on core academic terminology, structured application of rules/definitions, and moderate problem-solving.
  * Senior High (e.g. SSS 1–3 / Grades 10–12, Ages 15–16+): Formulate rigorous, academically challenging questions with subtle distractors, deep theoretical reasoning, and precise terminology.
- University / Higher Education:
  * Advanced undergraduate depth: Expect comprehensive synthesis of complex concepts, professional domain terminology, rigorous analysis, and academic precision.

STRICT RULES:
1. Generate between 5 to 10 flashcards based ONLY on the most critical information in the text.
2. Focus on extracting: key definitions, formulas, historical dates, inventors, and core concepts.
3. The "front" of the card should be a clear, concise question or term.
4. The "back" of the card should be the direct answer or definition. Keep it brief and easy to memorize.
5. Output STRICTLY in valid JSON format. Do not use markdown blocks (\`\`\`json) around the output. Do not include any conversational text before or after the JSON.

JSON SCHEMA:
[
  {
    "front": "Who is considered the 'Father of Microbiology' and what did he discover?",
    "back": "Antonie van Leeuwenhoek. He was the first to observe single-celled organisms, which he called 'animalcules'."
  },
  {
    "front": "Formula: Total Magnification",
    "back": "Total Magnification = Ocular Magnification × Objective Magnification"
  }
]`;

  const userPrompt = `Generate a JSON flashcard deck based on these Avenpath lesson notes:${targetLevelText}\n\n${lessonNotes}`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("DeepSeek API Error:", errorData);
    throw new Error("Failed to generate flashcards with DeepSeek");
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  try {
    const jsonStr = content.replace(/^```json\s*/im, '').replace(/\s*```$/im, '').trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse JSON flashcards:", content);
    throw new Error("Failed to parse flashcards JSON from AI");
  }
}

export async function generateOfficialFlashcardsForSubtopic(subtopicId: number) {
  const sub = await db.query.subtopics.findFirst({
    where: eq(subtopics.id, subtopicId),
    with: {
      topic: {
        with: {
          term: {
            with: {
              subject: true
            }
          }
        }
      }
    }
  });

  if (!sub || !sub.content) {
    throw new Error("Subtopic not found or has no content to generate flashcards.");
  }

  const subjectObj = sub.topic?.term?.subject;
  const levelInfo = subjectObj ? `${subjectObj.levelName} (${subjectObj.className || "Standard Class"})` : undefined;

  return await generateFlashcards(sub.content, levelInfo);
}
