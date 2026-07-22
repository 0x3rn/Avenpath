export interface AssessmentCheckpoint {
  id: string;
  type: "quiz" | "test" | "exam";
  title: string;
  level: "topic" | "module" | "milestone" | "final";
  targetId: string | number;
  targetName: string;
  description: string;
  moduleIndex?: number;
}

export function calculateSubjectAssessments(subject: {
  id: string;
  country?: string;
  levelName?: string;
  name?: string;
  terms?: { id: string | number; name: string; topics?: { id: string | number; name: string; slug: string }[] }[];
}): AssessmentCheckpoint[] {
  const checkpoints: AssessmentCheckpoint[] = [];
  const country = subject.country || "";
  const levelName = subject.levelName || "";
  const isNigerianSchool = country === "Nigeria" || levelName.includes("Highschool") || levelName.includes("Primaryschool") || levelName.includes("Primary School");
  const terms = subject.terms || [];

  terms.forEach((term, tIdx) => {
    const termNumber = tIdx + 1;

    // 1. Topic Quizzes (after each topic)
    if (term.topics) {
      term.topics.forEach((topic) => {
        checkpoints.push({
          id: `quiz_topic_${topic.id}`,
          type: "quiz",
          title: `${topic.name} Quiz`,
          level: "topic",
          targetId: topic.id,
          targetName: topic.name,
          description: `Knowledge check quiz covering ${topic.name}.`
        });
      });
    }

    // 2. Module / Term Tests
    const testTitle = isNigerianSchool ? `${term.name} Test` : `${term.name} Module Test`;
    checkpoints.push({
      id: `test_term_${term.id}`,
      type: "test",
      title: testTitle,
      level: "module",
      targetId: term.id,
      targetName: term.name,
      description: `Progress assessment test for ${term.name}.`,
      moduleIndex: termNumber
    });

    // 3. Exam Placement Rules
    if (isNigerianSchool) {
      // Nigerian Highschool & Primary School: Term Exam at the end of each term_id
      checkpoints.push({
        id: `exam_term_${term.id}`,
        type: "exam",
        title: `${term.name} Term Exam`,
        level: "final",
        targetId: term.id,
        targetName: term.name,
        description: `Official Term Examination for ${term.name}.`
      });
    } else {
      // University / General Highschool: Milestone Exam after every 5 modules
      if (termNumber % 5 === 0) {
        checkpoints.push({
          id: `exam_milestone_${termNumber}`,
          type: "exam",
          title: `Milestone Exam (Modules 1 - ${termNumber})`,
          level: "milestone",
          targetId: term.id,
          targetName: term.name,
          description: `Comprehensive 50-question Milestone Examination covering Modules 1 through ${termNumber}.`,
          moduleIndex: termNumber
        });
      }
    }
  });

  // Final Course Exam for University / General Highschool
  if (!isNigerianSchool && terms.length > 0) {
    const subjectTitle = subject.name || subject.id;
    checkpoints.push({
      id: `exam_course_final_${subject.id}`,
      type: "exam",
      title: `${subjectTitle} Final Course Exam`,
      level: "final",
      targetId: subject.id,
      targetName: subjectTitle,
      description: `Comprehensive 50-question Final Examination for ${subjectTitle}.`
    });
  }

  return checkpoints;
}
