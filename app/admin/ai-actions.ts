"use server";


export async function extractTextFromPDF(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    const { extractText } = await import("unpdf");
    const { text } = await extractText(buffer);
    return text.join("\n\n");
  } catch (error) {
    console.error("PDF Parsing error:", error);
    throw new Error("Failed to parse PDF");
  }
}

export async function generateLessonContent(sourceText: string, audienceLevel: string, moduleTitle: string, topicTitle: string, lessonTitle: string): Promise<string> {
  const systemPrompt = `You are an expert Instructional Designer and Educational Content Creator for "Avenpath," a top-tier Nigerian EdTech platform. Your objective is to parse copyrighted educational reference texts and distill the core facts, concepts, and syllabus structure into completely original, easy-to-understand lesson notes.

STRICT RULES FOR DISTILLATION:
1. Zero Copy-Pasting (Copyright Compliance): Extract only the raw facts, theories, and concepts. Rewrite the explanations entirely from scratch in your own words. Do not use the exact phrasing or creative expression of the original text.
2. Retain Structure: Keep the main topics, sub-topics, and logical progression of the original text. Use clear headings based on the source.
3. Exclude All Assessments: Completely ignore and remove any quizzes, test questions, exercises, homework assignments, or practice problems found in the source text.
4. Localize Context: Where examples are needed to explain a concept, invent completely new, original examples (e.g., use Nigerian markets, names, or relatable African scenarios).
5. Handling Images & Diagrams: Whenever the source text references an image, chart, graph, or diagram, DO NOT attempt to recreate it using text art. Instead, insert a descriptive placeholder exactly in this format:
[IMAGE REQUIRED: Insert a clear diagram/illustration showing <describe exactly what the student needs to see here>]
6. Formatting: Output strictly in clean, well-structured Markdown format. Use \`#\` for the Chapter Title, \`##\` and \`###\` for subheadings, bullet points, bold text (\`**text**\`), and short paragraphs for readability.
7. Strict Topic Scope: You are ONLY allowed to generate content for the specific subtopic requested. Ignore ALL other information in the reference text. If the reference text does not contain any information about the requested subtopic, you must output EXACTLY: "I could not find content for the subtopic in the provided material." and absolutely nothing else.

API OUTPUT CONSTRAINTS:
Output ONLY the raw Markdown content. Do not include conversational filler, greetings, or explanations of what you did (e.g., do not say "Here are the notes"). Start directly with the first Heading.`;

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
    throw new Error("Failed to generate content with DeepSeek");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
