"use server";

export interface ObjectiveQuestion {
  id: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: "A" | "B" | "C" | "D";
}

export interface SubjectiveQuestion {
  id: string;
  question: string;
  ideal_answer: string;
  acceptable_answers: string[];
}

export interface TheoryQuestion {
  id: string;
  question: string;
  ideal_answer: string;
  crucial_details: string[];
}

export interface QuizQuestion extends ObjectiveQuestion {
  explanation: string;
}

export interface GeneratedTest {
  objective: QuizQuestion[];
  subjective: SubjectiveQuestion[];
  theory: TheoryQuestion[];
}

export interface GeneratedQuiz {
  objective: QuizQuestion[];
}

export interface QuestionGrade {
  question_id: string;
  student_answer: string;
  points_awarded: number;
  max_points: number;
  feedback: string;
  correct_answer: string;
}

export interface EvaluationResult {
  total_score: number;
  objective_score: number;
  subjective_score: number;
  theory_score: number;
  grading_breakdown: QuestionGrade[];
}

const GRADE_AGE_CALIBRATION_PROMPT = `
GRADE & AGE CALIBRATION DIRECTIVE (CRITICAL):
Calibrate question difficulty, vocabulary, and conceptual depth strictly to the target education level and specific class grade:
- Primary School (Ages 6–11):
  * Lower Primary (e.g. Primary 1–3, Ages 6–8): Use clear, simple language, encouraging phrasing, direct factual questions, and foundational concepts suitable for young learners.
  * Upper Primary (e.g. Primary 4–6, Ages 9–11): Introduce age-appropriate analytical questions, structured vocabulary, and step-by-step reasoning while maintaining an accessible tone.
- High School (Ages 12–16+):
  * Junior High (e.g. JSS 1–3 / Grades 7–9, Ages 12–14): Focus on core academic terminology, structured application of rules/definitions, and moderate problem-solving.
  * Senior High (e.g. SSS 1–3 / Grades 10–12, Ages 15–16+): Formulate clear, well-structured questions using professional academic terminology. Avoid overly subtle distractors and ensure questions remain accessible and preparatory for standard high school exams.
- University / Higher Education:
  * Advanced undergraduate depth: Expect comprehensive synthesis of complex concepts, professional domain terminology, rigorous analysis, and academic precision.`;

/**
 * PROMPT 1: The Quiz & Rubric Generator (20 Objective MCQ Questions)
 */
export async function generateQuizAndRubric(lessonNotes: string, levelInfo?: string): Promise<GeneratedQuiz> {
  if (!lessonNotes || lessonNotes.trim().length < 10) {
    throw new Error("lesson note unavailable");
  }
  const targetLevelText = levelInfo ? `\nTarget Level & Class: ${levelInfo}` : "";

  const systemPrompt = `You are an expert Educational Assessor and Content Creator for "Avenpath," a top-tier EdTech platform. 
Your objective is to read the provided lesson notes and generate a comprehensive 20-question Objective Quiz formatted STRICTLY in JSON.

QUIZ STRUCTURE (20 Questions Total):
- Exactly 20 Objective Questions (Multiple Choice)

${GRADE_AGE_CALIBRATION_PROMPT}

STRICT RULES FOR GENERATION:
1. Scope Constraint (CRITICAL): Generate questions and answers based ONLY on the facts, concepts, and definitions present in the provided text. Do not include ANY outside knowledge. Avenpath's credibility relies on testing students ONLY on what they just read.
2. Objective (MCQ): Provide exactly 4 options (A, B, C, D). CRITICAL: You MUST strictly randomize the placement of the correct answer evenly across A, B, C, and D. Do NOT default to making 'A' the correct answer. Distractors must be academically plausible but definitively wrong based on the text. Avoid "all of the above" or "none of the above".
3. Explanation: Provide a brief, authoritative explanation of why the correct answer is right. Do NOT evaluate the user (e.g., "Great job", "You are correct"). DO NOT use robotic phrases like "The text states that" or "According to the lesson". Write it like a premium expert educator explaining the concept directly.
4. JSON Output ONLY: Output STRICTLY valid JSON. Do not wrap the output in markdown code blocks (e.g., \`\`\`json). No conversational filler.

REQUIRED JSON SCHEMA:
{
  "objective": [
    {
      "id": "obj_1",
      "question": "What is the primary function of the condenser lens in a brightfield microscope?",
      "options": {
        "A": "To magnify the image 10 times.",
        "B": "To focus light rays from the illuminator onto the specimen.",
        "C": "To block direct light from reaching the objective lens.",
        "D": "To change the wavelength of the light source."
      },
      "correct_answer": "B",
      "explanation": "The condenser lens, located below the stage, focuses all light rays onto the specimen to maximize illumination."
    }
  ]
}`;

  const userPrompt = `Generate the 20-question JSON Objective Quiz based on the following Avenpath lesson notes:${targetLevelText}\n\n${lessonNotes}`;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY environment variable is not configured.");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.2,
      max_tokens: 4000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Quiz Generator API Error:", errorText);
    throw new Error("Failed to generate quiz with DeepSeek API.");
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim() || "";

  try {
    const cleanJsonStr = rawContent
      .replace(/^```json\s*/im, "")
      .replace(/^```\s*/im, "")
      .replace(/\s*```$/im, "")
      .trim();

    return JSON.parse(cleanJsonStr) as GeneratedQuiz;
  } catch (err) {
    console.error("Failed to parse Quiz JSON from AI:", rawContent);
    throw new Error("AI output was not valid JSON for Quiz Generation.");
  }
}

/**
 * INSTANT JS QUIZ EVALUATOR (0.001s Latency, Zero API Token Cost)
 */
export async function evaluateQuizSubmission(
  quizRubric: GeneratedQuiz,
  studentSubmission: { question_id: string; answer: string }[]
): Promise<EvaluationResult> {
  const answerMap = new Map(studentSubmission.map(s => [s.question_id, s.answer.trim().toUpperCase()]));
  
  let totalScore = 0;
  const breakdown: QuestionGrade[] = [];

  quizRubric.objective.forEach((q) => {
    const studentAns = answerMap.get(q.id) || "";
    const isCorrect = studentAns === q.correct_answer;
    const points = isCorrect ? 5 : 0;
    totalScore += points;

    breakdown.push({
      question_id: q.id,
      student_answer: studentAns,
      points_awarded: points,
      max_points: 5,
      correct_answer: q.correct_answer,
      feedback: isCorrect 
        ? (q.explanation || "Correct!")
        : `Not quite. Option ${q.correct_answer} is correct. ${q.explanation || ""}`
    });
  });

  return {
    total_score: totalScore,
    objective_score: totalScore,
    subjective_score: 0,
    theory_score: 0,
    grading_breakdown: breakdown
  };
}

/**
 * PROMPT 1: The Test & Rubric Generator (20 Questions)
 */
export async function generateTestAndRubric(lessonNotes: string, levelInfo?: string): Promise<GeneratedTest> {
  if (!lessonNotes || lessonNotes.trim().length < 10) {
    throw new Error("lesson note unavailable");
  }
  const targetLevelText = levelInfo ? `\nTarget Level & Class: ${levelInfo}` : "";

  const systemPrompt = `You are an expert Educational Assessor and Content Creator for "Avenpath," a top-tier EdTech platform. 
Your objective is to read the provided lesson notes and generate a comprehensive 20-question test formatted STRICTLY in JSON.

TEST STRUCTURE:
- Exactly 10 Objective Questions (Multiple Choice)
- Exactly 5 Subjective Questions (Fill-in-the-gap)
- Exactly 5 Theory Questions (Short Essay/Explanation)

${GRADE_AGE_CALIBRATION_PROMPT}

STRICT RULES FOR GENERATION:
1. Scope Constraint (CRITICAL): Generate questions, acceptable answers, and ideal answers based ONLY on the facts, concepts, and definitions present in the provided text. Do not include ANY outside knowledge. Avenpath's credibility relies on testing students ONLY on what they just read.
2. Objective (MCQ): Provide 4 options (A, B, C, D). CRITICAL: You MUST strictly randomize the placement of the correct answer evenly across A, B, C, and D. Do NOT default to making 'A' the correct answer. Distractors must be plausible.
3. Subjective (Fill-in-the-gap): Formulate a sentence with a missing key term, name, or date. Provide an array of "acceptable_answers" and one "ideal_answer" for the UI to display later.
4. Theory: Ask a "Why", "How", or "Explain" question. Generate a well-structured "ideal_answer" (summarized strictly from the notes) and an array of 3 to 4 "crucial_details" that a student needs to mention to get full marks.
5. Explanation (MCQ ONLY): Include a short, authoritative explanation for WHY the correct answer is right. DO NOT say "Great job" or evaluate the user. DO NOT use robotic phrases like "The text states that" or "According to the lesson". Write it like a premium expert educator explaining the concept directly.
6. JSON Output ONLY: Output STRICTLY valid JSON. Do not wrap the output in markdown code blocks (e.g., \`\`\`json). No conversational filler.

REQUIRED JSON SCHEMA:
{
  "objective": [
    {
      "id": "obj_1",
      "question": "What is the primary function of...?",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct_answer": "B",
      "explanation": "..."
    }
  ],
  "subjective": [
    {
      "id": "subj_1",
      "question": "The modern light microscope was created in 1830 by ________.",
      "ideal_answer": "Joseph Jackson Lister",
      "acceptable_answers": ["Joseph Jackson Lister", "Joseph Lister", "J.J. Lister", "Lister"]
    }
  ],
  "theory": [
    {
      "id": "theo_1",
      "question": "Explain how phase-contrast microscopy works.",
      "ideal_answer": "Phase-contrast microscopy uses an annular stop and phase plate to convert slight differences in refractive index into differences in light intensity. This causes destructive interference, allowing detailed observation of live, unstained cells.",
      "crucial_details": [
        "Uses an annular stop and phase plate",
        "Exploits differences in refractive index",
        "Causes destructive interference (waves cancel out)"
      ]
    }
  ]
}`;

  const userPrompt = `Generate the 20-question JSON test based on the following Avenpath lesson notes:${targetLevelText}\n\n${lessonNotes}`;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY environment variable is not configured.");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.2,
      max_tokens: 4000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Test Generator API Error:", errorText);
    throw new Error("Failed to generate test with DeepSeek API.");
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim() || "";

  try {
    const cleanJsonStr = rawContent
      .replace(/^```json\s*/im, "")
      .replace(/^```\s*/im, "")
      .replace(/\s*```$/im, "")
      .trim();

    return JSON.parse(cleanJsonStr) as GeneratedTest;
  } catch (err) {
    console.error("Failed to parse Test JSON from AI:", rawContent);
    throw new Error("AI output was not valid JSON for Test Generation.");
  }
}

/**
 * PROMPT 2: The AI Test Grader (Evaluator) (20 Questions)
 */
export async function evaluateTestSubmission(
  testRubric: GeneratedTest,
  studentSubmission: { question_id: string; answer: string }[]
): Promise<EvaluationResult> {
  const systemPrompt = `You are an expert, encouraging AI Examiner for "Avenpath". A student has just submitted a 20-question test (10 Objective, 5 Subjective, 5 Theory). 
Your task is to evaluate their answers objectively, calculate their score out of 100%, and provide constructive feedback formatted STRICTLY as JSON.

ANTI-STRICTNESS & LENIENCY CLAUSE:
You must be flexible, lenient, and intelligent in your grading. Do NOT demand word-for-word memorization. Do NOT penalize for typos, poor grammar, or phonetic spellings. As long as the student demonstrates they understand the concept or idea, award them the points. 

SCORING MATH & RULES (100% TOTAL):

1. OBJECTIVE QUESTIONS (Total 30%, 3% per question)
- If the student's answer letter matches the correct_answer, award 3 points. Otherwise, 0.

2. SUBJECTIVE / FILL-IN-THE-GAP (Total 30%, 6% per question)
- Be very lenient with spelling. 
- If the answer requires a person's name, award the full 6 points if they provide at least 2 of the names (e.g., first and last) or the commonly known surname. 
- If the answer uses a highly accurate synonym or matches the phonetic intent of the "acceptable_answers" array, award 6 points. Otherwise, 0 points.

3. THEORY QUESTIONS (Total 40%, 8% per question)
Evaluate the student's conceptual understanding against the "crucial_details" array. Grade purely on whether they grasped the ideas from the lesson, ignoring outside knowledge.
- Full Score (8 points): Answered correctly, understands the concept in their own words, and captured the main crucial details.
- Moderate Score (4 to 6 points): The student grasps the main idea but struggles to articulate it perfectly, OR they provided about half (e.g., 2 out of 4) of the crucial details.
- Low Score (1 to 3 points): The student left out the defining crucial factor that makes the answer make sense, but they showed some effort and related knowledge.
- Zero Score (0 points): Completely wrong, off-topic, or blank.

OUTPUT FORMAT (STRICT JSON ONLY, NO MARKDOWN BLOCKS):
Return the final scores, AND return the "correct_answer" for every single question so the student can review what they missed.

{
  "total_score": 85,
  "objective_score": 27,
  "subjective_score": 30,
  "theory_score": 28,
  "grading_breakdown": [
    {
      "question_id": "theo_1",
      "student_answer": "It uses a phase ring to make light cancel out so you can see live cells.",
      "points_awarded": 6,
      "max_points": 8,
      "feedback": "Good understanding of destructive interference (canceling out) and its use for live cells! You just missed mentioning the refractive index.",
      "correct_answer": "Phase-contrast microscopy uses an annular stop and phase plate to convert slight differences in refractive index into differences in light intensity..."
    },
    {
      "question_id": "subj_1",
      "student_answer": "Joseph Lister",
      "points_awarded": 6,
      "max_points": 6,
      "feedback": "Correct!",
      "correct_answer": "Joseph Jackson Lister"
    }
  ]
}`;

  const userPrompt = `Evaluate the following student submission based on the provided Test Rubric:

TEST RUBRIC:
${JSON.stringify(testRubric, null, 2)}

STUDENT SUBMISSION:
${JSON.stringify(studentSubmission, null, 2)}`;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY environment variable is not configured.");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.1,
      max_tokens: 4000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Test Evaluator API Error:", errorText);
    throw new Error("Failed to evaluate test submission with DeepSeek API.");
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim() || "";

  try {
    const cleanJsonStr = rawContent
      .replace(/^```json\s*/im, "")
      .replace(/^```\s*/im, "")
      .replace(/\s*```$/im, "")
      .trim();

    return JSON.parse(cleanJsonStr) as EvaluationResult;
  } catch (err) {
    console.error("Failed to parse Evaluation JSON from AI:", rawContent);
    throw new Error("AI output was not valid JSON for Test Evaluation.");
  }
}

/**
 * PROMPT 1: The Exam & Rubric Generator (50 Questions Total)
 */
export async function generateExamAndRubric(lessonNotes: string, levelInfo?: string): Promise<GeneratedTest> {
  if (!lessonNotes || lessonNotes.trim().length < 10) {
    throw new Error("lesson note unavailable");
  }
  const targetLevelText = levelInfo ? `\nTarget Level & Class: ${levelInfo}` : "";

  const systemPrompt = `You are an expert Educational Assessor and Content Creator for "Avenpath," a top-tier EdTech platform. 
Your objective is to read the provided lesson notes and generate a comprehensive 50-question EXAM formatted STRICTLY in JSON.

EXAM STRUCTURE (50 Questions Total):
- Exactly 30 Objective Questions (Multiple Choice)
- Exactly 10 Subjective Questions (Fill-in-the-gap)
- Exactly 10 Theory Questions (Short Essay/Explanation)

${GRADE_AGE_CALIBRATION_PROMPT}

STRICT RULES FOR GENERATION:
1. Scope Constraint (CRITICAL): Generate questions, acceptable answers, and ideal answers based ONLY on the facts, concepts, and definitions present in the provided text. Do not include ANY outside knowledge. Avenpath's credibility relies on testing students ONLY on what they just read.
2. Objective (MCQ): Provide 4 options (A, B, C, D). CRITICAL: You MUST strictly randomize the placement of the correct answer evenly across A, B, C, and D. Do NOT default to making 'A' the correct answer. Distractors must be plausible.
3. Subjective (Fill-in-the-gap): Formulate a sentence with a missing key term, name, or date. Provide an array of "acceptable_answers" and one "ideal_answer" for the UI to display later.
4. Theory: Ask a "Why", "How", or "Explain" question. Generate a well-structured "ideal_answer" (summarized strictly from the notes) and an array of 3 to 4 "crucial_details" that a student needs to mention to get full marks.
5. Explanation (MCQ ONLY): Include a short, authoritative explanation for WHY the correct answer is right. DO NOT say "Great job" or evaluate the user. DO NOT use robotic phrases like "The text states that" or "According to the lesson". Write it like a premium expert educator explaining the concept directly.
6. JSON Output ONLY: Output STRICTLY valid JSON. Do not wrap the output in markdown code blocks (e.g., \`\`\`json). No conversational filler.

REQUIRED JSON SCHEMA:
{
  "objective": [
    {
      "id": "obj_1",
      "question": "What is the primary function of...?",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct_answer": "B",
      "explanation": "..."
    }
  ],
  "subjective": [
    {
      "id": "subj_1",
      "question": "The modern light microscope was created in 1830 by ________.",
      "ideal_answer": "Joseph Jackson Lister",
      "acceptable_answers": ["Joseph Jackson Lister", "Joseph Lister", "J.J. Lister", "Lister"]
    }
  ],
  "theory": [
    {
      "id": "theo_1",
      "question": "Explain how phase-contrast microscopy works.",
      "ideal_answer": "Phase-contrast microscopy uses an annular stop and phase plate to convert slight differences in refractive index into differences in light intensity. This causes destructive interference, allowing detailed observation of live, unstained cells.",
      "crucial_details": [
        "Uses an annular stop and phase plate",
        "Exploits differences in refractive index",
        "Causes destructive interference (waves cancel out)"
      ]
    }
  ]
}`;

  const userPrompt = `Generate the 50-question JSON Exam based on the following Avenpath lesson notes:${targetLevelText}\n\n${lessonNotes}`;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY environment variable is not configured.");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.2,
      max_tokens: 8000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Exam Generator API Error:", errorText);
    throw new Error("Failed to generate 50-question exam with DeepSeek API.");
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim() || "";

  try {
    const cleanJsonStr = rawContent
      .replace(/^```json\s*/im, "")
      .replace(/^```\s*/im, "")
      .replace(/\s*```$/im, "")
      .trim();

    return JSON.parse(cleanJsonStr) as GeneratedTest;
  } catch (err) {
    console.error("Failed to parse Exam JSON from AI:", rawContent);
    throw new Error("AI output was not valid JSON for 50-question Exam Generation.");
  }
}

/**
 * PROMPT 2: The Exam Grader (Evaluator) (50 Questions)
 */
export async function evaluateExamSubmission(
  examRubric: GeneratedTest,
  studentSubmission: { question_id: string; answer: string }[]
): Promise<EvaluationResult> {
  const systemPrompt = `You are an expert, encouraging AI Examiner for "Avenpath". A student has just submitted a 50-question Exam (30 Objective, 10 Subjective, 10 Theory). 
Your task is to evaluate their answers objectively, calculate their score out of 100%, and provide constructive feedback formatted STRICTLY as JSON.

ANTI-STRICTNESS & LENIENCY CLAUSE (CRITICAL):
These answers are freely typed by students into text boxes. Expect and completely ignore casing errors, typos, slang, shorthand (e.g., "u", "bcuz"), and informal phrasing. Do NOT demand word-for-word memorization. As long as the student demonstrates they understand the concept or idea, award them the points.

SCORING MATH & RULES (100% TOTAL):

1. OBJECTIVE QUESTIONS (Total 30%, 1% per question)
- If the student's answer letter matches the correct_answer, award 1 point. Otherwise, 0.

2. SUBJECTIVE / FILL-IN-THE-GAP (Total 20%, 2% per question)
- Be very lenient with spelling and typos. 
- If the answer requires a person's name, award the full 2 points if they provide at least 2 of the names (e.g., first and last) or the commonly known surname. 
- If the answer uses a highly accurate synonym or matches the phonetic intent of the "acceptable_answers" array, award 2 points. Otherwise, 0 points.

3. THEORY QUESTIONS (Total 50%, Max 5% per question)
Evaluate the student's conceptual understanding against the "crucial_details" array. Grade purely on whether they grasped the ideas from the lesson, ignoring outside knowledge.
- Full Score (5 points): Answered correctly, understands the concept in their own words, and captured the main crucial details.
- Moderate Score (2.5 to 4 points): The student grasps the main idea but struggles to articulate it perfectly, OR they provided about half (e.g., 2 out of 4) of the crucial details.
- Low Score (1 to 2 points): The student left out the defining crucial factor that makes the answer make sense, but they showed some effort and related knowledge.
- Zero Score (0 points): Completely wrong, off-topic, or blank.

OUTPUT FORMAT (STRICT JSON ONLY, NO MARKDOWN BLOCKS):
Return the final scores, AND return the "correct_answer" for every single question so the student can review what they missed.

{
  "total_score": 85.5,
  "objective_score": 28,
  "subjective_score": 18,
  "theory_score": 39.5,
  "grading_breakdown": [
    {
      "question_id": "theo_1",
      "student_answer": "It uses a phase ring to make light cancel out so you can see live cells.",
      "points_awarded": 3.5,
      "max_points": 5,
      "feedback": "Good understanding of destructive interference (canceling out) and its use for live cells! You just missed mentioning the refractive index.",
      "correct_answer": "Phase-contrast microscopy uses an annular stop and phase plate to convert slight differences in refractive index into differences in light intensity..."
    },
    {
      "question_id": "subj_1",
      "student_answer": "Joseph Lister",
      "points_awarded": 2,
      "max_points": 2,
      "feedback": "Correct!",
      "correct_answer": "Joseph Jackson Lister"
    }
  ]
}`;

  const userPrompt = `Evaluate the following student submission based on the provided Exam Rubric:

EXAM RUBRIC:
${JSON.stringify(examRubric, null, 2)}

STUDENT SUBMISSION:
${JSON.stringify(studentSubmission, null, 2)}`;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY environment variable is not configured.");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.1,
      max_tokens: 6000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Exam Evaluator API Error:", errorText);
    throw new Error("Failed to evaluate 50-question exam submission with DeepSeek API.");
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim() || "";

  try {
    const cleanJsonStr = rawContent
      .replace(/^```json\s*/im, "")
      .replace(/^```\s*/im, "")
      .replace(/\s*```$/im, "")
      .trim();

    return JSON.parse(cleanJsonStr) as EvaluationResult;
  } catch (err) {
    console.error("Failed to parse Exam Evaluation JSON from AI:", rawContent);
    throw new Error("AI output was not valid JSON for 50-question Exam Evaluation.");
  }
}
