import type { LessonContent } from '../../../types';

export const jsxContent: LessonContent = {
  explanation: {
    lead: 'JSX is a way to describe what the screen should look like, using tags that look like HTML, right inside your JavaScript.',
    analogy: {
      title: 'Think of it as a template with gaps',
      body: 'You write the layout once and leave small gaps, like {name}. React fills each gap with a real value when it draws the page.',
    },
    points: [
      'JSX looks like HTML but lives inside JavaScript.',
      'Curly braces {} let you drop any JavaScript value into your markup.',
      'A component returns one parent element (or a fragment: <>…</>).',
      'Use className instead of class to add a CSS class.',
    ],
  },
  visual: {
    kind: 'jsx',
    caption: 'Pick a name and watch the heading follow. The code on the left is all React needs.',
  },
  demo: {
    kind: 'jsx',
    whatsHappening:
      'Whatever sits inside the curly braces is JavaScript. React works out the value and puts the result into the page.',
  },
  practice: {
    prompt: 'Can you make the heading greet React?',
    instructions:
      'Fill in the blank with a JavaScript string so the heading reads “Hello, React!”.',
    codePrefix: 'const name = ',
    codeSuffix: ";\nreturn <h1>Hello, {name}!</h1>;",
    placeholder: "'React'",
    accepted: ["'React'", '"React"', '`React`'],
    hint: "Text in JavaScript is wrapped in quotes, like 'Ada'.",
    success: 'Yes! The heading now reads “Hello, React!”.',
    nearMiss:
      'Close. React needs quotes around it so JavaScript treats it as text, not as a variable.',
    result: 'Hello, React!',
  },
  quiz: {
    id: 'quiz-jsx',
    title: 'JSX check-in',
    questions: [
      {
        id: 'jsx-q1',
        prompt: 'What are curly braces {} used for in JSX?',
        options: [
          {
            id: 'a',
            text: 'Writing CSS styles',
            feedback:
              'Not quite. Styles can use braces, but their main job is bigger: they let you use any JavaScript value in your markup.',
          },
          {
            id: 'b',
            text: 'Dropping JavaScript values into your markup',
            feedback: 'Exactly right.',
          },
          {
            id: 'c',
            text: 'Declaring a new component',
            feedback:
              'Components are declared with functions. Braces are for values inside the JSX they return.',
          },
          {
            id: 'd',
            text: 'Importing files',
            feedback: 'Imports use the import keyword at the top of a file, not braces inside JSX.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Anything inside {} is evaluated as JavaScript. That is how a heading can say “Hello, Ada” one moment and “Hello, Grace” the next.',
      },
      {
        id: 'jsx-q2',
        prompt: 'Which attribute adds a CSS class to a JSX element?',
        options: [
          {
            id: 'a',
            text: 'class',
            feedback:
              "That's the HTML name. In JSX, class would clash with a JavaScript keyword, so React uses a different name.",
          },
          { id: 'b', text: 'className', feedback: 'Right.' },
          {
            id: 'c',
            text: 'cssClass',
            feedback: 'That one does not exist. Look for the name that combines class and name.',
          },
          {
            id: 'd',
            text: 'styleClass',
            feedback: 'Nice guess, but React has no styleClass. Try the name that mirrors HTML.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'JSX is JavaScript underneath, and class is already taken by JavaScript. className is the stand-in.',
      },
      {
        id: 'jsx-q3',
        prompt: "What must a component's JSX return?",
        options: [
          {
            id: 'a',
            text: 'Several elements side by side',
            feedback:
              'That causes an error. Wrap siblings in one parent element or a fragment <>…</>.',
          },
          { id: 'b', text: 'One parent element (or a fragment)', feedback: 'Yes.' },
          {
            id: 'c',
            text: 'Only plain text',
            feedback: 'Text is allowed, but components usually return elements that contain it.',
          },
          {
            id: 'd',
            text: 'A string of HTML',
            feedback: 'JSX is not a string. It is a description React turns into real elements.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'A function can only return one thing, so JSX needs a single root. Fragments give you one without adding an extra element to the page.',
      },
    ],
  },
};
