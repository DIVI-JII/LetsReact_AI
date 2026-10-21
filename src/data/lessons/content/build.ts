import type { DemoKind, LessonContent, PracticeTask, Question } from '../../../types';

/** One quiz question in compact form. `wrong` holds three [text, feedback] pairs. */
export interface Q {
  prompt: string;
  correct: string;
  wrong: [[string, string], [string, string], [string, string]];
  explanation: string;
}

export interface LessonSpec {
  id: string;
  lead: string;
  analogy: [title: string, body: string];
  points: string[];
  demo: DemoKind;
  caption: string;
  whatsHappening: string;
  practice: PracticeTask;
  quizTitle: string;
  questions: [Q, Q, Q];
}

const letters = ['a', 'b', 'c', 'd'];

function toQuestion(lessonId: string, q: Q, index: number): Question {
  // Rotate where the right answer sits so it is not always the same letter.
  const slot = (index + lessonId.length) % 4;
  const texts = [...q.wrong.map(([text, feedback]) => ({ text, feedback }))];
  texts.splice(slot, 0, { text: q.correct, feedback: 'Exactly right.' });
  return {
    id: `${lessonId}-q${index + 1}`,
    prompt: q.prompt,
    options: texts.map((o, i) => ({ id: letters[i], text: o.text, feedback: o.feedback })),
    correctOptionId: letters[slot],
    explanation: q.explanation,
  };
}

export function lesson(spec: LessonSpec): LessonContent {
  return {
    explanation: {
      lead: spec.lead,
      analogy: { title: spec.analogy[0], body: spec.analogy[1] },
      points: spec.points,
    },
    visual: { kind: spec.demo, caption: spec.caption },
    demo: { kind: spec.demo, whatsHappening: spec.whatsHappening },
    practice: spec.practice,
    quiz: {
      id: `quiz-${spec.id}`,
      title: spec.quizTitle,
      questions: spec.questions.map((q, i) => toQuestion(spec.id, q, i)),
    },
  };
}
