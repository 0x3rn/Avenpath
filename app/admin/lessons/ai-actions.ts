"use server";



export async function extractTextFromPDF(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { extractText } = await import("unpdf");
    const { text } = await extractText(uint8Array);

    const extractedText = Array.isArray(text) ? text.join("\n\n").trim() : String(text || "").trim();

    if (!extractedText) {
      throw new Error("No selectable text found in PDF. If this is a scanned document or image, please paste text directly.");
    }

    return extractedText;
  } catch (error: any) {
    console.error("PDF Parsing error:", error);
    throw new Error(error.message || "Failed to parse PDF");
  }
}

export async function generateLessonContent(sourceText: string, audienceLevel: string, moduleTitle: string, topicTitle: string, lessonTitle: string): Promise<string> {
  const systemPrompt = `You are an expert Instructional Designer and Educational Content Creator for "Avenpath," a top-tier EdTech platform. Your objective is to parse copyrighted educational reference texts and distill the core facts, concepts, and syllabus structure into completely original, easy-to-understand lesson notes.

STRICT RULES FOR DISTILLATION:
1. Zero Copy-Pasting (Copyright Compliance): Extract only the raw facts, theories, and concepts. Rewrite the explanations entirely from scratch in your own words. Do not use the exact phrasing or creative expression of the original text.
2. Retain Structure: Keep the main topics, sub-topics, and logical progression of the original text. Use clear headings based on the source.
3. Exclude All Assessments: Completely ignore and remove any quizzes, test questions, exercises, homework assignments, or practice problems found in the source text.
4. Localize Context: Where examples are needed to explain a concept, invent completely new, original examples. IF the Target Audience is "Nigerian Senior Highschool", "Nigerian Junior School", or "Nigerian Primary School", use localized Nigerian markets, names, or relatable African scenarios. For all other audiences, keep examples general. If the topic is strict historical fact (e.g., European inventors) that cannot be altered, retain what was said in the reference text and ignore this rule. Only make examples localized if it can be.
5. MANDATORY IMAGE PLACEHOLDERS (CRITICAL): You are acting as an Art Director. You MUST actively scan the original text for references to figures, charts, or visual examples (e.g., "Figure 2.1", "illustrated in"). Even if the text does not explicitly say "Figure", if a visual aid is crucial for a student to understand the concept being explained, you MUST insert a placeholder. 
Format it EXACTLY like this on a new line:
[IMAGE REQUIRED: Insert a clear diagram/illustration showing <describe the exact visual the student needs here based on the text>]
6. Formatting: Output strictly in clean, well-structured Markdown format. Use \`##\` and \`###\` for subheadings, bullet points, bold text (\`**text**\`), and short paragraphs for readability. Ignore the first heading if it is the same as the lesson title, do not output the lesson title as the first heading. If there is an introductory paragraph at the beginning of the topic, evaluate it: if it contains historical facts, names, or dates (as outlined in Rule 8), it IS important and you MUST include it as the first part of the lesson using \`## Introduction\`, using \`###\` for subsequent subtopics. If it contains zero factual value, ignore it.
7. Strict Topic Scope: You are ONLY allowed to generate content for the specific subtopic requested. (Note: Any introductory text immediately following your requested subtopic heading is considered part of the scope). Ignore ALL other information in the reference text. If the reference text does not contain any information about the requested subtopic, you must output EXACTLY: "I could not find content for the subtopic in the provided material." and absolutely nothing else.
8. MANDATORY FACT RETENTION (CRITICAL): You are strictly forbidden from omitting historical dates, names of inventors/innovators, formulas, equations, or key definitions. Before writing, you MUST actively scan the ENTIRE scoped text (including the introduction) for years (e.g., "1830", "20th century"), capitalized names of people (e.g., "Joseph Jackson Lister"), and keywords like "invented", "created", "discovered", or "developed". EVERY SINGLE ONE of these entities found in the requested section MUST be explicitly integrated and stated in your generated notes.

API OUTPUT CONSTRAINTS:
Output ONLY the raw Markdown content. Do not include conversational filler, greetings, or explanations of what you did. Start directly with the first Heading.

Remember: Output ONLY markdown. Generate mandatory [IMAGE REQUIRED: ...] tags where figures/visuals were mentioned. Strictly cover only the requested subtopic. Do not output the lesson title as the first heading. If the introduction contains vital facts, dates, or inventors, you must include it; otherwise, ignore it. Do not miss any names, dates, or formulas.`;
  const moduleContextStr = moduleTitle ? `\nModule Context: ${moduleTitle}` : '';
  const userPrompt = `Target Audience: ${audienceLevel}${moduleContextStr}\nTopic Context: ${topicTitle}\nSubtopic To Generate: ${lessonTitle}\n\nPlease distill the following reference text into original Avenpath lesson notes specifically for the "Subtopic To Generate" within the context of the given Topic. Follow your strict topic scope instructions:\n\n${sourceText}`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("DeepSeek API Error:", errorData);
    throw new Error("Failed to generate content with DeepSeek");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function generateFlashcards(lessonNotes: string): Promise<any[]> {
  const systemPrompt = `You are an expert Educational Content Creator for "Avenpath," a top-tier EdTech platform.
Your task is to read the provided lesson notes and generate a set of highly effective study flashcards.

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

  const userPrompt = `Generate a JSON flashcard deck based on these Avenpath lesson notes:\n\n${lessonNotes}`;

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
