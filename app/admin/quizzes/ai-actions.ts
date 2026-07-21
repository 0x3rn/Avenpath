"use server";

export async function generateQuizQuestions(lessonNotes: string): Promise<any[]> {
  const systemPrompt = `You are an expert Educational Assessor for "Avenpath," an EdTech platform. 
Your task is to read the provided lesson notes and generate a Multiple-Choice Quiz (MCQ) to test the student's understanding.

STRICT RULES:
1. Generate exactly 15 highly relevant multiple-choice questions based ONLY on the provided text.
2. Each question must have exactly 4 options (A, B, C, D).
3. Include a short, encouraging explanation for WHY the correct answer is right.
4. Output STRICTLY in valid JSON format. Do not use markdown blocks (\`\`\`json) around the output. Do not include any conversational text before or after the JSON. 

JSON SCHEMA:
[
  {
    "question": "What is the primary function of...?",
    "options": {
      "A": "Option 1",
      "B": "Option 2",
      "C": "Option 3",
      "D": "Option 4"
    },
    "correct_answer": "B",
    "explanation": "Great job! The text specifically states that..."
  }
]`;

  const userPrompt = `Generate a JSON quiz based on these Avenpath lesson notes:\n\n${lessonNotes}`;

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
    throw new Error("Failed to generate quiz with DeepSeek");
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  try {
    const jsonStr = content.replace(/^```json\s*/im, '').replace(/\s*```$/im, '').trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse JSON quiz:", content);
    throw new Error("Failed to parse quiz JSON from AI");
  }
}
